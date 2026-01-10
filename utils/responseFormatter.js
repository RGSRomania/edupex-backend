/**
 * Utility functions for formatting and sanitizing AI assistant responses
 */

/**
 * Sanitizes and formats the AI assistant's response to make it more compact and readable
 * @param {string} response - The raw response from the AI model
 * @param {object} options - Configuration options for formatting
 * @returns {string} - The sanitized and formatted response
 */
const sanitizeResponse = (response, options = {}) => {
  if (!response) return '';

  // Default options
  const config = {
    maxLength: options.maxLength || 1200,     // Maximum length of response
    compactParagraphs: options.compactParagraphs !== false, // Whether to compact paragraphs
    removeRedundantSpaces: options.removeRedundantSpaces !== false, // Whether to remove redundant spaces
    preserveMarkdown: options.preserveMarkdown !== false, // Whether to preserve markdown formatting
    preserveNewLines: options.preserveNewLines !== false, // Whether to preserve important newlines
    addMissingPeriods: options.addMissingPeriods !== false, // Whether to add periods to the end of sentences
    enforceTeacherVoice: options.enforceTeacherVoice !== false, // Whether to enforce teacher-like formatting
  };

  let sanitized = response;

  // Initialize arrays for markdown processing
  const codeBlocks = [];
  const markdownElements = [];

  // Remove any HTML tags that might have been generated
  sanitized = sanitized.replace(/<[^>]*>/g, '');

  // Handle markdown special cases before general processing
  if (config.preserveMarkdown) {
    // Temporarily replace markdown code blocks with placeholders
    sanitized = sanitized.replace(/```([^`]*)```/g, (match) => {
      codeBlocks.push(match);
      return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
    });

    // Preserve other markdown elements like bullet points, bold, italics
    sanitized = sanitized.replace(/(\*\*.*?\*\*|\*.*?\*|_.*?_|`.*?`|\[\d+\]|\[.*?\]\(.*?\))/g, (match) => {
      markdownElements.push(match);
      return `__MD_ELEMENT_${markdownElements.length - 1}__`;
    });
  }

  if (config.removeRedundantSpaces) {
    // Remove redundant spaces
    sanitized = sanitized.replace(/\s+/g, ' ');

    // Restore meaningful line breaks for readability
    if (config.preserveNewLines) {
      sanitized = sanitized.replace(/\. /g, '.\n');
      sanitized = sanitized.replace(/\? /g, '?\n');
      sanitized = sanitized.replace(/! /g, '!\n');
      sanitized = sanitized.replace(/; /g, ';\n');
    }
  }

  // Apply teacher voice formatting if enabled
  if (config.enforceTeacherVoice) {
    // Remove conversational openings and greetings that LLMs often add
    sanitized = sanitized.replace(/^(bună|salut|hello|hi|hey|în primul rând|pentru a răspunde la întrebarea ta|pentru a-ți răspunde|dacă înțeleg corect|ca răspuns la întrebarea ta|ca să răspund la întrebarea ta)[,.:]?\s+/i, '');
    sanitized = sanitized.replace(/^(așadar|deci|ei bine)[,.:]?\s+/i, '');

    // Remove "let me explain" type phrases
    sanitized = sanitized.replace(/^(îți voi explica|hai să-ți explic|o să-ți explic|vreau să-ți explic|să-ți explic)[,.:]?\s+/i, '');

    // Remove lines that reference the student directly at the beginning
    sanitized = sanitized.replace(/^(în întrebarea ta|așa cum ai menționat|așa cum ai întrebat|după cum ai întrebat|conform întrebării tale)[,.:]?\s+/i, '');

    // Remove any remaining "I'll explain/clarify" phrases anywhere in text
    sanitized = sanitized.replace(/(îți voi explica|hai să-ți explic|o să-ți explic|permit[eă]-mi să explic|lasă-mă să explic)[,.:]?\s+/ig, '');

    // Remove first-person references that LLMs often use
    sanitized = sanitized.replace(/(eu cred că|în opinia mea|din punctul meu de vedere|consider că)[,.:]?\s+/ig, '');

    // Remove verbose transitional phrases that don't add content
    sanitized = sanitized.replace(/(este important să știm că|trebuie să menționez că|trebuie să știi că|este esențial să înțelegi că)[,.:]?\s+/ig, '');

    // Remove hedging language and tentative phrasing
    sanitized = sanitized.replace(/(s-ar putea să|probabil că|poate că|este posibil să)[,.:]?\s+/ig, '');

    // Remove "I hope this helps" style closings
    sanitized = sanitized.replace(/(\s+sper că (acest răspuns|această explicație|informația|aceste informații) (te ajută|îți este de folos|îți sunt de folos|îți vor fi de folos|te-a ajutat)\.?$)/i, '');
    sanitized = sanitized.replace(/(\s+succes[!.]?$|\s+spor[!.]?$)/i, '');

    // Fix capitalization of first letter after removing phrases
    sanitized = sanitized.replace(/^[a-z]/, match => match.toUpperCase());

    // Ensure mathematical terms are properly formatted
    sanitized = sanitized.replace(/\btriunghi(ul)? dreptunghic\b/gi, 'triunghi dreptunghic');
    sanitized = sanitized.replace(/\bcatetă\b/gi, 'catetă');
    sanitized = sanitized.replace(/\bipotenuz[aă]\b/gi, 'ipotenuză');
  }

  if (config.compactParagraphs) {
    // Compact multiple empty lines into at most two line breaks
    sanitized = sanitized.replace(/\n{3,}/g, '\n\n');
  }

  if (config.addMissingPeriods) {
    // Add a period to the end if it's missing
    if (!/[.!?]$/.test(sanitized.trim())) {
      sanitized = sanitized.trim() + '.';
    }
  }

  // Restore markdown elements if preserved
  if (config.preserveMarkdown) {
    // Restore code blocks
    codeBlocks.forEach((block, i) => {
      sanitized = sanitized.replace(`__CODE_BLOCK_${i}__`, block);
    });

    // Restore other markdown elements
    markdownElements.forEach((element, i) => {
      sanitized = sanitized.replace(`__MD_ELEMENT_${i}__`, element);
    });
  }

  // Apply additional teacher-voice formatting before truncation
  if (config.enforceTeacherVoice) {
    // Ensure the response has a clear structure by breaking into paragraphs if needed
    const paragraphs = sanitized.split('\n\n');

    // If there's only one paragraph and it's long, try to break it into structured paragraphs
    if (paragraphs.length === 1 && paragraphs[0].length > 300) {
      sanitized = breakIntoStructuredParagraphs(sanitized);
    }

    // Make sure we don't end with a question unless it's a rhetorical device
    if (sanitized.trim().endsWith('?')) {
      // Replace the final question with an invitation to explore further
      sanitized = sanitized.replace(/\?$/, '. Reflectează asupra acestui concept pentru a-l înțelege mai bine.');
    }
  }

  // Truncate to maximum length if needed
  if (sanitized.length > config.maxLength) {
    sanitized = sanitized.substring(0, config.maxLength - 3) + '...';
  }

  return sanitized;
};

/**
 * Break a long text into more structured paragraphs for better readability
 * @param {string} text - The text to structure
 * @returns {string} - Text with improved paragraph structure
 */
function breakIntoStructuredParagraphs(text) {
  // Split at sensible break points (definitions, examples, explanations, etc.)
  const breakPoints = [
    /\b(Definiție|Definiția|Exemplu|Explicație|Formulă|Observație|Proprietate|Teoremă|Concluzie)[:.]/gi,
    /\bPe de altă parte\b/gi,
    /\bÎn concluzie\b/gi,
    /\bDe asemenea\b/gi,
    /\bPentru a înțelege mai bine\b/gi
  ];

  let structuredText = text;

  breakPoints.forEach(breakPoint => {
    structuredText = structuredText.replace(breakPoint, '\n\n$&');
  });

  // Also break at transition points
  structuredText = structuredText.replace(/\. (Astfel|Prin urmare|Deci|Așadar|Totuși|Cu toate acestea|Mai mult|În plus)/g, '.\n\n$1');

  // Remove any triple line breaks that might have been created
  structuredText = structuredText.replace(/\n{3,}/g, '\n\n');

  return structuredText;
}

/**
 * Format page references to be more compact
 * @param {Array} references - Array of page references
 * @returns {string} - Formatted references string
 */
const formatPageReferences = (references) => {
  if (!references || !Array.isArray(references) || references.length === 0) {
    return '';
  }

  // Extract unique page numbers
  const pages = [...new Set(references.map(ref => ref.page).filter(page => page))];

  if (pages.length === 0) return '';

  // Sort the page numbers
  pages.sort((a, b) => a - b);

  // Format as a compact string
  return `Vezi paginile: ${pages.join(', ')}`;
};

/**
 * Clean and format textbook content for presentation
 * @param {string} content - Raw textbook content
 * @returns {string} - Cleaned and formatted content
 */
function cleanTextContent(content) {
  if (!content) return '';

  // Replace common OCR errors for Romanian characters
  let cleaned = content;
  cleaned = cleaned.replace(/\bn\b/g, 'în');
  cleaned = cleaned.replace(/\bsi\b/g, 'și');
  cleaned = cleaned.replace(/\bdreapt\\\s*([a-z])/gi, 'dreapta $1');
  cleaned = cleaned.replace(/distan\\ei/g, 'distanței');
  cleaned = cleaned.replace(/distan\\a/g, 'distanța');
  cleaned = cleaned.replace(/\\\s*([a-z])/g, 'ț$1');
  cleaned = cleaned.replace(/@n/g, 'în');
  cleaned = cleaned.replace(/@î/g, 'în');
  cleaned = cleaned.replace(/\[/g, 'ă');
  cleaned = cleaned.replace(/fi\\/g, 'și');
  cleaned = cleaned.replace(/calculat\[\s+/g, 'calculată ');
  cleaned = cleaned.replace(/Av`nd/g, 'Având');
  cleaned = cleaned.replace(/g[a\[]sim/g, 'găsim');
  cleaned = cleaned.replace(/ob\\inem/g, 'obținem');
  cleaned = cleaned.replace(/Calcula\\i/g, 'Calculați');

  // Fix mathematical symbols
  cleaned = cleaned.replace(/∢/g, 'unghiul');
  cleaned = cleaned.replace(/∆/g, 'triunghiul');
  cleaned = cleaned.replace(/≡/g, '≡');
  cleaned = cleaned.replace(/perpendicular[a]?\s*\./g, 'perpendiculara ');

  // Fix special notation for points, angles, triangles
  cleaned = cleaned.replace(/\b([A-Z])\s+([A-Z])\s+([A-Z])\b/g, '$1$2$3');
  cleaned = cleaned.replace(/\b([A-Z])\s+([A-Z])\b/g, '$1$2');
  cleaned = cleaned.replace(/\b([A-Z])\s*⊥\s*([A-Z])/g, '$1 perpendicular pe $2');
  cleaned = cleaned.replace(/\b∠\s*([A-Z])/g, 'unghiul $1');

  // Fix mathematical operations
  cleaned = cleaned.replace(/(\d+)\s*\^\s*(\d+)/g, '$1^$2');
  cleaned = cleaned.replace(/(\d+)\s*\*\s*(\d+)/g, '$1×$2');

  // Fix special paragraphs for problem solving
  cleaned = cleaned.replace(/Problem[a\[]?\s*rezolvat[a\[]?/g, 'Problemă rezolvată:');
  cleaned = cleaned.replace(/Solu\\ie/g, 'Soluție:');

  // Better handling of parentheses in mathematical expressions
  cleaned = cleaned.replace(/\(\s*([A-Za-z0-9]+)\s*,\s*([A-Za-z0-9]+)\s*\)/g, '($1,$2)');
  cleaned = cleaned.replace(/d\s*\(\s*([A-Za-z])\s*,\s*([A-Za-z0-9]+)\s*\)/g, 'd($1,$2)');

  // Fix distance notation
  cleaned = cleaned.replace(/d\s*\(\s*([A-Z])\s*,\s*([A-Z][A-Z])\s*\)/g, 'distanța de la $1 la dreapta $2');

  // Fix measurement units
  cleaned = cleaned.replace(/(\d+)\s*cm/g, '$1 cm');

  // Replace strange characters with their common equivalents
  cleaned = cleaned.replace(/…/g, '...');
  cleaned = cleaned.replace(/◗/g, '-');

  // Special case for "in triunghiul"
  cleaned = cleaned.replace(/@în triunghiul/g, 'În triunghiul');
  cleaned = cleaned.replace(/@n triunghiul/g, 'În triunghiul');

  // Special case for angle measurements
  cleaned = cleaned.replace(/([A-Z])\s*=\s*(\d+)/g, '$1 = $2°');

  // Clean up extra whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // Format nicely with paragraphs - mathematical text needs better separation
  cleaned = cleaned.split(/\.(?=\s*[A-Z])/).filter(p => p.trim()).join('.\n\n');

  // Keep lowercase letters after period in same paragraph
  cleaned = cleaned.replace(/\.\n\n\s*([a-z])/g, '. $1');

  return cleaned;
}

module.exports = {
  sanitizeResponse,
  formatPageReferences,
  cleanTextContent,
  breakIntoStructuredParagraphs
};
