// Flex CX Backend Server Engine
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit for file uploads
app.use(express.static(path.join(__dirname, '../')));

// Chat API Endpoint - now supports file attachments
app.post('/api/chat', async (req, res) => {
  try {
    const { message, model, fileData, fileName } = req.body;
    let reply = `Flex CX [${model || 'gemini-2.5-flash'}]: Processed: "${message}"`;
    if (fileName) {
      reply += ` (Attached file: ${fileName})`;
      // In a real application, 'fileData' would be processed here:
      // - Save file to storage (e.g., S3)
      // - Pass file data to Gemini Vision API for analysis if it's an image
      // - Pass file data to document parsing service for text/PDF/DOCX
    }
    res.json({ success: true, reply: reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Placeholder API Endpoint for Image Generation
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;
    // Implement actual image generation with a service like DALL-E or Stable Diffusion
    const imageUrl = `https://via.placeholder.com/400x300?text=Flex+CX+Image:+${encodeURIComponent(prompt.substring(0,20))}`;
    res.json({ success: true, imageUrl: imageUrl, reply: `Generated an image for: "${prompt}"` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Placeholder API Endpoint for Document Analysis
app.post('/api/analyze-document', async (req, res) => {
  try {
    const { fileData, fileName } = req.body;
    console.log(`Received document for analysis: ${fileName}`);
    // In a real application, analyze 'fileData' using AI models
    const analysisResult = `Document '${fileName}' analyzed. Key insights: Customer sentiment is positive, with 75% satisfaction. Top keywords: 'support', 'feature request'.`;
    res.json({ success: true, result: analysisResult, fileName });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Placeholder API Endpoint for Work Suggestions
app.post('/api/work-suggestions', async (req, res) => {
  try {
    const { context } = req.body;
    console.log(`Received context for work suggestions: ${context}`);
    // Generate suggestions based on 'context'
    const suggestions = [
      `Automate responses for '${context}' related queries.`, 
      `Prioritize cases tagged with '${context}'.`, 
      `Suggest Upsell for related products.`
    ];
    res.json({ success: true, suggestions: suggestions, reply: `Here are some smart work suggestions for: "${context}"` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Placeholder API Endpoint for Processing Guides/Knowledge Base
app.post('/api/process-guide', async (req, res) => {
  try {
    const { query } = req.body;
    console.log(`Received guide query: ${query}`);
    // Process query against a knowledge base
    const guideResponse = `Based on your query for "${query}", here is a link to the 'Advanced Troubleshooting Guide' or a summary: [Link to Guide]`;
    res.json({ success: true, response: guideResponse, query });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Root endpoint - serves index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

app.listen(PORT, () => {
  console.log(`⚡ Flex CX Server running on port ${PORT}`);
});
