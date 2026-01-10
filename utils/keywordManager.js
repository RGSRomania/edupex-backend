 // filepath: /Users/mdica/PycharmProjects/EduPex/backend/utils/keywordManager.js
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

/**
 * Manages keywords for special cases in the supabaseClient.js file
 */
class KeywordManager {
  constructor() {
    this.supabaseClientPath = path.join(__dirname, 'supabaseClient.js');
    this.keywordLogPath = path.join(__dirname, 'missingKeywords.json');
    this.missingKeywords = {};
  }

  /**
   * Initialize the keyword manager by loading any existing missing keywords
   */
  async initialize() {
    try {
      // Try to load existing missing keywords
      if (fs.existsSync(this.keywordLogPath)) {
        const data = await readFileAsync(this.keywordLogPath, 'utf8');
        this.missingKeywords = JSON.parse(data);
        console.log(`[DEBUG] Loaded ${Object.keys(this.missingKeywords).length} tracked missing keywords`);
      }
    } catch (error) {
      console.error('[DEBUG] Error initializing keyword manager:', error);
      // Create empty file if it doesn't exist
      this.missingKeywords = {};
      await this.saveMissingKeywords();
    }
  }

  /**
   * Log a query that didn't return good results
   * @param {string} query - The user's query
   * @param {string} subject - The subject (e.g., 'mate', 'romana')
   * @param {number} gradeLevel - The grade level
   * @param {number} resultsCount - How many results were found
   */
  async logMissingKeyword(query, subject, gradeLevel, resultsCount = 0) {
    if (!query || query.length < 5) return; // Skip very short queries

    const normalizedQuery = query.toLowerCase().trim();
    const keywords = this.extractPotentialKeywords(normalizedQuery);

    // Skip if no good keywords were found
    if (keywords.length === 0) return;

    // For each keyword, update the count or add a new entry
    for (const keyword of keywords) {
      if (!this.missingKeywords[keyword]) {
        this.missingKeywords[keyword] = {
          count: 1,
          lastSeen: new Date().toISOString(),
          queries: [normalizedQuery],
          subjects: [subject || 'unknown'],
          gradeLevels: gradeLevel ? [gradeLevel] : [],
          searchTerms: [normalizedQuery]
        };
      } else {
        this.missingKeywords[keyword].count += 1;
        this.missingKeywords[keyword].lastSeen = new Date().toISOString();

        // Add the query if it's not already in the list
        if (!this.missingKeywords[keyword].queries.includes(normalizedQuery)) {
          this.missingKeywords[keyword].queries.push(normalizedQuery);
        }

        // Add the subject if it's not already in the list
        if (subject && !this.missingKeywords[keyword].subjects.includes(subject)) {
          this.missingKeywords[keyword].subjects.push(subject);
        }

        // Add the grade level if it's not already in the list
        if (gradeLevel && !this.missingKeywords[keyword].gradeLevels.includes(gradeLevel)) {
          this.missingKeywords[keyword].gradeLevels.push(gradeLevel);
        }
      }
    }

    // Save the updated missing keywords
    await this.saveMissingKeywords();

    // If a keyword has been seen multiple times, consider adding it to the special cases
    const frequentKeywords = Object.entries(this.missingKeywords)
      .filter(([_, data]) => data.count >= 3)  // Keywords missing 3+ times
      .map(([keyword, _]) => keyword);

    if (frequentKeywords.length > 0) {
      await this.addKeywordsToSpecialCases(frequentKeywords);
    }
  }

  /**
   * Extract potential keywords from a query
   * @param {string} query - The user's query
   * @returns {string[]} - List of potential keywords
   */
  extractPotentialKeywords(query) {
    const words = query.split(/\s+/);
    const keywords = [];

    // Filter out common words and keep only good keyword candidates
    const commonWords = ['ce', 'este', 'sunt', 'cum', 'care', 'unde', 'cand', 'când',
                         'pentru', 'despre', 'dacă', 'daca', 'mai', 'din', 'fără',
                         'și', 'si', 'sau', 'ori', 'la', 'în', 'in', 'pe', 'cu', 'de'];

    // Look for multi-word concepts (up to 3 words)
    for (let i = 0; i < words.length; i++) {
      if (words[i].length < 4 || commonWords.includes(words[i])) continue;

      // Single word
      keywords.push(words[i]);

      // Two-word phrase
      if (i < words.length - 1) {
        keywords.push(`${words[i]} ${words[i+1]}`);
      }

      // Three-word phrase
      if (i < words.length - 2) {
        keywords.push(`${words[i]} ${words[i+1]} ${words[i+2]}`);
      }
    }

    return keywords.filter(k => k.length > 3);
  }

  /**
   * Save the missing keywords to a JSON file
   */
  async saveMissingKeywords() {
    try {
      await writeFileAsync(
        this.keywordLogPath,
        JSON.stringify(this.missingKeywords, null, 2),
        'utf8'
      );
    } catch (error) {
      console.error('[DEBUG] Error saving missing keywords:', error);
    }
  }

  /**
   * Add frequent keywords to special cases in supabaseClient.js
   * @param {string[]} keywords - List of keywords to add
   */
  async addKeywordsToSpecialCases(keywords) {
    try {
      // Get the current supabaseClient.js file
      let content = await readFileAsync(this.supabaseClientPath, 'utf8');

      // Find where special cases array starts
      const specialCasesStartRegex = /const\s+specialCases\s*=\s*\[/;
      const match = content.match(specialCasesStartRegex);

      if (!match) {
        console.error('[DEBUG] Could not find specialCases array in supabaseClient.js');
        return;
      }

      // For each keyword, create a new special case if it doesn't exist already
      for (const keyword of keywords) {
        const keywordData = this.missingKeywords[keyword];

        // Skip if we don't have enough data
        if (!keywordData || keywordData.queries.length < 2) continue;

        // Check if this keyword already exists in specialCases
        const keywordEscaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const keywordRegex = new RegExp(`keywords\\s*:\\s*\\[.*?['"]${keywordEscaped}['"].*?\\]`);

        if (content.match(keywordRegex)) {
          console.log(`[DEBUG] Keyword '${keyword}' already exists in specialCases, skipping`);
          continue;
        }

        // Prepare variations of the keyword
        const variations = [keyword];
        if (keyword.endsWith('e')) {
          variations.push(keyword.substring(0, keyword.length - 1) + 'a');
        }
        if (!keyword.endsWith('e') && !keyword.endsWith('a')) {
          variations.push(keyword + 'a');
          variations.push(keyword + 'e');
        }

        // Build a list of search terms
        const searchTerms = [
          ...new Set([
            keyword,
            ...keywordData.queries,
            ...variations
          ])
        ];

        // Create the new special case entry
        const newSpecialCase = `      {
        keywords: ['${variations.join("', '")}'],
        searchTerms: ['${searchTerms.join("', '")}']
      },`;

        // Add the new special case after the first match
        content = content.replace(
          specialCasesStartRegex,
          `const specialCases = [\n${newSpecialCase}`
        );

        // Update the missing keywords to mark this one as added
        this.missingKeywords[keyword].addedToSpecialCases = true;
        this.missingKeywords[keyword].addedDate = new Date().toISOString();
      }

      // Write the modified file back
      await writeFileAsync(this.supabaseClientPath, content, 'utf8');
      console.log(`[DEBUG] Added ${keywords.length} new keywords to specialCases`);

      // Save the updated missing keywords
      await this.saveMissingKeywords();
    } catch (error) {
      console.error('[DEBUG] Error adding keywords to special cases:', error);
    }
  }

  /**
   * Analyze a failed search to determine if we need to track missing keywords
   * @param {string} query - The user's query
   * @param {string} subject - The subject (e.g., 'mate', 'romana')
   * @param {number} gradeLevel - The grade level
   * @param {Array} results - The search results
   */
  async analyzeMissingContext(query, subject, gradeLevel, results = []) {
    // If results are empty or very limited, log this as a potential missing keyword
    if (!results || results.length === 0) {
      await this.logMissingKeyword(query, subject, gradeLevel, 0);
      return true; // Context was missing
    } else if (results.length < 2) {
      // If we only have one result, it might not be comprehensive enough
      await this.logMissingKeyword(query, subject, gradeLevel, results.length);
      return false; // Had some context, but limited
    }

    return false; // Had sufficient context
  }
}

// Export a singleton instance
const keywordManager = new KeywordManager();
module.exports = keywordManager;
