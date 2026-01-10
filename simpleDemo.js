// Simple demo of how the AI Assistant flow works with the expected response format
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock AI Assistant response in the format specified
app.post('/ask', (req, res) => {
  const { question, subject, grade } = req.body;

  console.log('Received request:', { question, subject, grade });

  // Mock response that matches the requested format
  const mockResponse = {
    answer: "Fractions represent parts of a whole. They consist of a numerator (the top number) and a denominator (the bottom number). The numerator tells how many parts we have, while the denominator tells how many equal parts make up one whole.",
    example: "Example: 3/4 means we have 3 parts out of 4 equal parts. If you divide a pizza into 4 equal slices and take 3 slices, you have 3/4 of the whole pizza.",
    checkQuestion: {
      stem: "Which fraction represents three-quarters?",
      choices: ["1/4", "3/4", "4/3", "3/3"],
      correctIndex: 1
    },
    citations: [
      {
        sourceId: "Matematica Manual Clasa 5",
        pageStart: 45,
        pageEnd: 47
      }
    ]
  };

  // Add a small delay to simulate processing time
  setTimeout(() => {
    res.json(mockResponse);
  }, 1000);
});

// Start server
app.listen(port, () => {
  console.log(`Demo server running at http://localhost:${port}`);
  console.log(`\nTest it with:
  curl -X POST http://localhost:${port}/ask \\
    -H "Content-Type: application/json" \\
    -d '{"question": "What are fractions?", "subject": "mate", "grade": 5}'
  `);

  console.log(`\nFrontend code would look like:
  const r = await fetch("/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      question: "What are fractions?",
      subject: "mate",
      grade: 5
    })
  });
  const data = await r.json();
  /* data = {
    answer: "...short teacher-style explanation...",
    example: "Example: 3/4 means...",
    checkQuestion: { stem, choices, correctIndex },
    citations: [{ sourceId, pageStart, pageEnd }]
  } */
  `);
});
