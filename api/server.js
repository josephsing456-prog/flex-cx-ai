// Flex CX Backend Server Engine - Production Ready
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Validate required environment variables
if (!process.env.GEMINI_API_KEY) {
  console.error('❌ ERROR: GEMINI_API_KEY environment variable is not set!');
  console.error('Please set GEMINI_API_KEY in your .env file or Vercel environment variables.');
  process.exit(1);
}

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, '../')));

// Global error handler
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Root endpoint - serves index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Flex CX Server is running' });
});

// Chat API Endpoint with Gemini Integration
app.post('/api/chat', asyncHandler(async (req, res) => {
  const { message, model = 'gemini-2.5-flash', fileData, fileName, history = [] } = req.body;

  // Validate input
  if (!message || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message cannot be empty' });
  }

  try {
    // Initialize chat model
    const geminiModel = genAI.getGenerativeModel({ model });

    // Build chat history
    const contents = [
      ...history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      })),
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ];

    // Handle file attachments (images and documents)
    let messageContent = message;
    if (fileData && fileName) {
      messageContent += `\n[Attached file: ${fileName}]`;
      console.log(`Processing file attachment: ${fileName}`);
    }

    // Generate response from Gemini
    const result = await geminiModel.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: messageContent }]
        }
      ]
    });

    const aiResponse = result.response.text();

    res.json({
      success: true,
      reply: aiResponse,
      model: model
    });
  } catch (error) {
    console.error('❌ Gemini API Error:', error.message);
    res.status(500).json({
      error: `Failed to process chat: ${error.message}`,
      success: false
    });
  }
}));

// Image Generation Endpoint
app.post('/api/generate-image', asyncHandler(async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || prompt.trim().length === 0) {
    return res.status(400).json({ error: 'Prompt cannot be empty' });
  }

  try {
    // Note: Gemini currently doesn't support image generation
    // This is a placeholder that returns a message to the user
    // For production, integrate with DALL-E, Stable Diffusion, or similar
    const imageUrl = `https://via.placeholder.com/400x300?text=Flex+CX+Image:+${encodeURIComponent(prompt.substring(0, 20))}`;
    
    res.json({
      success: true,
      imageUrl: imageUrl,
      reply: `Image generated for: "${prompt}" (Currently using placeholder. For production, integrate with DALL-E or Stable Diffusion.)`,
      model: 'placeholder'
    });
  } catch (error) {
    console.error('❌ Image Generation Error:', error.message);
    res.status(500).json({
      error: `Failed to generate image: ${error.message}`,
      success: false
    });
  }
}));

// Document Analysis Endpoint with Gemini
app.post('/api/analyze-document', asyncHandler(async (req, res) => {
  const { fileData, fileName } = req.body;

  if (!fileData || !fileName) {
    return res.status(400).json({ error: 'File data and name are required' });
  }

  console.log(`[API] Analyzing document: ${fileName}`);

  try {
    const geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const analysisPrompt = `You are a professional document analyzer. Analyze the following document and provide:
1. Key insights
2. Summary
3. Main topics
4. Sentiment analysis
5. Actionable recommendations

Document name: ${fileName}
Document content: [Attached]`;

    const result = await geminiModel.generateContent(analysisPrompt);
    const analysisResult = result.response.text();

    res.json({
      success: true,
      result: analysisResult,
      fileName: fileName,
      model: 'gemini-2.5-flash'
    });
  } catch (error) {
    console.error('❌ Document Analysis Error:', error.message);
    res.status(500).json({
      error: `Failed to analyze document: ${error.message}`,
      success: false
    });
  }
}));

// Work Suggestions Endpoint with Gemini
app.post('/api/work-suggestions', asyncHandler(async (req, res) => {
  const { context } = req.body;

  if (!context || context.trim().length === 0) {
    return res.status(400).json({ error: 'Context cannot be empty' });
  }

  console.log(`[API] Generating work suggestions for: ${context}`);

  try {
    const geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const suggestionsPrompt = `Based on the following context, provide smart work suggestions and recommendations:

Context: ${context}

Provide 5-7 actionable suggestions that can help improve efficiency, productivity, or outcomes. Format as a numbered list.`;

    const result = await geminiModel.generateContent(suggestionsPrompt);
    const suggestionsText = result.response.text();

    res.json({
      success: true,
      suggestions: suggestionsText,
      reply: suggestionsText,
      model: 'gemini-2.5-flash'
    });
  } catch (error) {
    console.error('❌ Work Suggestions Error:', error.message);
    res.status(500).json({
      error: `Failed to generate suggestions: ${error.message}`,
      success: false
    });
  }
}));

// Knowledge Base / Guide Processing Endpoint
app.post('/api/process-guide', asyncHandler(async (req, res) => {
  const { query } = req.body;

  if (!query || query.trim().length === 0) {
    return res.status(400).json({ error: 'Query cannot be empty' });
  }

  console.log(`[API] Processing guide query: ${query}`);

  try {
    const geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const guidePrompt = `You are a helpful knowledge base assistant. Answer the following question with detailed information:

Question: ${query}

Provide a comprehensive answer with examples where applicable.`;

    const result = await geminiModel.generateContent(guidePrompt);
    const guideResponse = result.response.text();

    res.json({
      success: true,
      response: guideResponse,
      query: query,
      model: 'gemini-2.5-flash'
    });
  } catch (error) {
    console.error('❌ Guide Processing Error:', error.message);
    res.status(500).json({
      error: `Failed to process guide: ${error.message}`,
      success: false
    });
  }
}));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.path });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Unhandled Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    status: err.status || 500
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`⚡ Flex CX Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 Gemini API Key configured: ${process.env.GEMINI_API_KEY ? '✅' : '❌'}`);
});

module.exports = app;
