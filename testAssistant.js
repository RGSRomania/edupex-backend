// Simple script to test the AI Assistant API
const axios = require('axios');

async function testAIAssistant() {
  console.log('Testing AI Assistant API...');

  try {
    // Using a question about Pythagorean theorem to trigger our special case
    const response = await axios.post('http://localhost:5000/api/assistant/ask', {
      question: "Ce este teorema lui Pitagora?",
      subject: "mate",
      grade: 5
    }, {
      headers: {
        'Content-Type': 'application/json',
        // You would need a valid token here in a real scenario
        'Authorization': 'Bearer test-token'
      }
    });

    console.log('Response structure:');
    console.log(JSON.stringify(response.data, null, 2));

    // Check if the response matches the expected format
    const { answer, example, checkQuestion, citations } = response.data;

    console.log('\nResponse components:');
    console.log('- answer:', answer ? 'Present' : 'Missing');
    console.log('- example:', example ? 'Present' : 'Missing');
    console.log('- checkQuestion:', checkQuestion ? 'Present' : 'Missing');
    console.log('- citations:', citations ? 'Present' : 'Missing');

    return response.data;
  } catch (error) {
    console.error('Error testing AI Assistant API:');
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received');
    } else {
      // Something else happened in setting up the request
      console.error('Error:', error.message);
    }
    throw error;
  }
}

// Run the test
testAIAssistant()
  .then(() => console.log('Test completed'))
  .catch(() => console.log('Test failed'));
