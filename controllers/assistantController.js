const axios = require('axios');
require('dotenv').config();

// Define LLM provider and API details
const llmProvider = process.env.LLM_PROVIDER || 'groq';
const openaiApiKey = process.env.OPENAI_API_KEY;
const chatgptModel = process.env.CHATGPT_MODEL || 'gpt-4o';
const groqApiKey = process.env.GROQ_API_KEY || 'gsk_free'; // Groq offers free tier
const groqModel = process.env.GROQ_MODEL || 'llama3-8b-8192';

console.log(`[DEBUG] Using LLM Provider: ${llmProvider}`);
console.log(`[DEBUG] Groq API Key configured: ${groqApiKey ? 'Yes' : 'No'}`);

// Educational response templates for common questions
const educationalResponses = {
  'teorema lui pitagora': {
    answer: 'Teorema lui Pitagora este una dintre cele mai importante teoreme din geometrie. Aceasta afirmă că într-un triunghi dreptunghic, suma pătratelor catetelor este egală cu pătratul ipotenuzei. Formula este: a² + b² = c², unde a și b sunt catetele, iar c este ipotenuza (latura cea mai lungă, opusă unghiului drept).',
    example: 'Exemplu: Dacă un triunghi dreptunghic are catetele de 3 cm și 4 cm, putem calcula ipotenuza astfel: 3² + 4² = c², deci 9 + 16 = 25, iar c = 5 cm.'
  },
  'fractii': {
    answer: 'Fracțiile sunt numere care reprezintă părți dintr-un întreg. O fracție se compune din numărător (numărul de sus) și numitor (numărul de jos). Numărătorul arată câte părți avem, iar numitorul arată în câte părți egale este împărțit întregul.',
    example: 'Exemplu: 3/4 înseamnă că avem 3 părți dintr-un întreg împărțit în 4 părți egale. Dacă ai o pizza împărțită în 4 felii și mănânci 3 felii, ai mâncat 3/4 din pizza.'
  }
};

// Enhanced controller for AI Assistant with teacher-like behavior
exports.askAssistant = async (req, res) => {
  try {
    const { question, subject, grade, gradeLevel } = req.body;
    const studentGrade = grade || gradeLevel || '5-8';

    console.log('[DEBUG] Received question:', question, 'subject:', subject, 'gradeLevel:', studentGrade);

    if (!question) {
      return res.status(400).json({ error: 'Missing question.' });
    }

    // Determine subject in Romanian
    let subjectRo = 'toate materiile';
    if (subject === 'mate' || subject === 'mathematics' || subject === 'matematică') {
      subjectRo = 'matematică';
    } else if (subject === 'romana' || subject === 'romanian' || subject === 'limba română') {
      subjectRo = 'limba română';
    }

    try {
      let answerText;

      // Check if we have a predefined response for this question
      const questionLower = question.toLowerCase();
      for (const [key, response] of Object.entries(educationalResponses)) {
        if (questionLower.includes(key)) {
          console.log('[DEBUG] Using predefined educational response');
          return res.json({
            answer: response.answer,
            example: response.example,
            checkQuestion: null,
            citations: [],
            source: 'educational-database'
          });
        }
      }

      if (llmProvider === 'groq') {
        // Use Groq API (free and fast)
        const groqApiKey = process.env.GROQ_API_KEY;

        if (!groqApiKey) {
          console.log('[DEBUG] Groq API key not configured, using fallback response');
          throw new Error('Groq API key not configured');
        }

        console.log(`[DEBUG] Using Groq model: ${groqModel}`);

        const groqResponse = await axios.post(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            model: groqModel,
            messages: [
              {
                role: 'system',
                content: `Tu ești un profesor dedicat de ${subjectRo} pentru clasa ${studentGrade} din România. Răspunde în limba română cu explicații clare și exemple practice.`
              },
              {
                role: 'user',
                content: question
              }
            ],
            max_tokens: 500,
            temperature: 0.7
          },
          {
            headers: {
              'Authorization': `Bearer ${groqApiKey}`,
              'Content-Type': 'application/json'
            },
            timeout: 30000
          }
        );

        answerText = groqResponse.data.choices[0].message.content.trim();
        console.log('[DEBUG] Groq answer preview:', answerText.substring(0, 150) + '...');

      } else if (llmProvider === 'chatgpt' || llmProvider === 'openai') {
        // Use OpenAI API
        if (!openaiApiKey) {
          throw new Error('OpenAI API key not configured');
        }

        console.log('[DEBUG] Using OpenAI/ChatGPT...');

        const openaiResponse = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: chatgptModel,
            messages: [
              {
                role: 'system',
                content: `Tu ești un profesor dedicat de ${subjectRo} pentru clasa ${studentGrade} din România. Răspunde în limba română cu explicații clare și exemple practice.`
              },
              { role: 'user', content: question }
            ],
            max_tokens: 1000,
            temperature: 0.7
          },
          {
            headers: {
              'Authorization': `Bearer ${openaiApiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );

        answerText = openaiResponse.data.choices[0].message.content.trim();
        console.log('[DEBUG] ChatGPT answer preview:', answerText.substring(0, 150) + '...');
      } else {
        throw new Error(`Unsupported LLM provider: ${llmProvider}`);
      }

      // Return the response
      return res.json({
        answer: answerText,
        example: '',
        checkQuestion: null,
        citations: [],
        source: llmProvider
      });

    } catch (apiError) {
      console.error('[ERROR] API error details:', {
        message: apiError.message,
        response: apiError.response?.data,
        status: apiError.response?.status,
        statusText: apiError.response?.statusText
      });

      // Fallback to a helpful educational response
      const fallbackResponse = `Îmi pare rău, sistemul AI este temporar indisponibil.

Pentru a primi ajutor cu această întrebare (${question}), te rog să:
1. Verifici manualul tău de ${subjectRo} pentru clasa ${studentGrade}
2. Încerci din nou peste câteva momente
3. Reformulezi întrebarea mai specific

Sistemul va fi disponibil în curând. Mulțumim pentru înțelegere!`;

      return res.json({
        answer: fallbackResponse,
        example: '',
        checkQuestion: null,
        citations: [],
        source: 'fallback'
      });
    }
  } catch (error) {
    console.error('[ERROR] Assistant controller error:', error);

    // Always provide a helpful response, never just an error
    return res.json({
      answer: `Bine ai venit! Sistemul de asistență educațională este în curs de configurare. Te rugăm să încerci din nou în câteva momente. Pentru întrebarea ta despre ${req.body.question}, consultă materialele tale de curs sau încearcă să reformulezi întrebarea.`,
      example: '',
      checkQuestion: null,
      citations: [],
      source: 'system-fallback'
    });
  }
};
