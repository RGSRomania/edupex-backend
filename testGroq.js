const axios = require('axios');
require('dotenv').config();

const testGroqAPI = async () => {
  const groqApiKey = process.env.GROQ_API_KEY;
  const groqModel = process.env.GROQ_MODEL || 'llama3-8b-8192';

  console.log('Testing Groq API...');
  console.log('API Key:', groqApiKey ? groqApiKey.substring(0, 10) + '...' : 'NOT SET');
  console.log('Model:', groqModel);

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: groqModel,
        messages: [
          {
            role: 'system',
            content: 'Tu ești un profesor de matematică pentru clasa 5 din România. Răspunde în limba română cu explicații clare.'
          },
          {
            role: 'user',
            content: 'Ce este teorema lui Thales?'
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

    console.log('\n✅ SUCCESS! Response:');
    console.log('Answer:', response.data.choices[0].message.content);
    console.log('\nFull response data:', JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.error('\n❌ ERROR!');
    console.error('Message:', error.message);

    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Status Text:', error.response.statusText);
      console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received');
      console.error('Request:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
  }
};

testGroqAPI();

