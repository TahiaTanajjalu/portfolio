const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Store form submissions in memory (in production, use a database)
let formSubmissions = [];

// Submit form data endpoint
app.post('/submit-form', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required fields'
      });
    }

    // Create submission object
    const submission = {
      name,
      email,
      message,
      timestamp: new Date().toISOString(),
      ip: req.ip || req.connection.remoteAddress
    };

    // Store the submission
    formSubmissions.push(submission);
    
    // In a real application, you would save to a database here
    console.log('Form submission received:', submission);

    res.json({
      success: true,
      message: 'Form submitted successfully! I will get back to you soon.',
      data: submission
    });
  } catch (error) {
    console.error('Error processing form submission:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit form. Please try again later.'
    });
  }
});

// Get all submissions (for your viewing - protect this in production)
app.get('/submissions', (req, res) => {
  res.json({
    success: true,
    count: formSubmissions.length,
    submissions: formSubmissions
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Form backend is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Portfolio Form Backend API',
    version: '1.0.0',
    endpoints: {
      submitForm: 'POST /submit-form',
      viewSubmissions: 'GET /submissions',
      healthCheck: 'GET /health'
    }
  });
});

app.listen(port, () => {
  console.log(`=== Portfolio Backend Server ===`);
  console.log(`Server running on port ${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
  console.log(`Local testing: http://localhost:${port}/`);
});
