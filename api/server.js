    origin: true,
    credentials: true
  })
);

app.use(
  express.json({
    limit: '50mb'
  })
);

// Static files
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ============================================================
// HELPERS
// ============================================================

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const requireGemini = (res) => {
  if (!genAI) {
    res.status(500).json({
      success: false,
      error: 'GEMINI_API_KEY is not configured on the server.'
    });

    return false;
  }

  return true;
};

// ============================================================
// HEALTH CHECK
// ============================================================

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    message: 'Flex CX Server is running',
    environment: process.env.NODE_ENV || 'production'
  });
});

// ============================================================
// CHAT API
// ============================================================

app.post(
  '/api/chat',
  asyncHandler(async (req, res) => {
    const {
      message,
      model = 'gemini-2.5-flash',
      fileData,
      fileName,
      history = []
    } = req.body;

    // Validate message
    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message cannot be empty'
      });
    }

    // Check Gemini configuration
    if (!requireGemini(res)) {
      return;
    }

    try {
      const geminiModel = genAI.getGenerativeModel({
        model
      });

      // Build conversation history
      const contents = [
        ...history.map((msg) => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [
            {
              text: msg.text || ''
            }
          ]
        })),
        {
          role: 'user',
          parts: [
            {
              text: message
            }
          ]
        }
      ];

      // Handle optional file attachment
      let messageContent = message;

      if (fileData && fileName) {
        messageContent += `\n[Attached file: ${fileName}]`;

        console.log(
          `[API] Processing file attachment: ${fileName}`
        );
      }

      // Generate Gemini response
      const result = await geminiModel.generateContent({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: messageContent
              }
            ]
          }
        ]
      });

      const aiResponse = result.response.text();

      res.json({
        success: true,
        reply: aiResponse,
        model
      });
    } catch (error) {
      console.error(
        '❌ Gemini Chat Error:',
        error
      );

      res.status(500).json({
        success: false,
        error: `Failed to process chat: ${
          error.message || 'Unknown error'
        }`
      });
    }
  })
);

// ============================================================
// IMAGE GENERATION
// ============================================================

app.post(
  '/api/generate-image',
  asyncHandler(async (req, res) => {
    const { prompt } = req.body;

    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Prompt cannot be empty'
      });
    }

    try {
      // Placeholder image generation
      // Replace with a real image generation provider later.
      const imageUrl =
        `https://via.placeholder.com/400x300?text=` +
        `Flex+CX+Image:+` +
        encodeURIComponent(prompt.substring(0, 20));

      res.json({
        success: true,
        imageUrl,
        reply: `Image generated for: "${prompt}"`,
        model: 'placeholder'
      });
    } catch (error) {
      console.error(
        '❌ Image Generation Error:',
        error
      );

      res.status(500).json({
        success: false,
        error: `Failed to generate image: ${
          error.message || 'Unknown error'
        }`
      });
    }
  })
);

// ============================================================
// DOCUMENT ANALYSIS
// ============================================================

app.post(
  '/api/analyze-document',
  asyncHandler(async (req, res) => {
    const { fileData, fileName } = req.body;

    if (!fileData || !fileName) {
      return res.status(400).json({
        success: false,
        error: 'File data and name are required'
      });
    }

    console.log(
      `[API] Analyzing document: ${fileName}`
    );

    if (!requireGemini(res)) {
      return;
    }

    try {
      const geminiModel =
        genAI.getGenerativeModel({
          model: 'gemini-2.5-flash'
        });

      const analysisPrompt = `
You are a professional document analyzer.

Analyze the following document and provide:

1. Key insights
2. Summary
3. Main topics
4. Sentiment analysis
5. Actionable recommendations

Document name: ${fileName}

Document content:
[Attached document data]
`;

      const result =
        await geminiModel.generateContent(
          analysisPrompt
        );

      const analysisResult =
        result.response.text();

      res.json({
        success: true,
        result: analysisResult,
        fileName,
        model: 'gemini-2.5-flash'
      });
    } catch (error) {
      console.error(
        '❌ Document Analysis Error:',
        error
      );

      res.status(500).json({
        success: false,
        error: `Failed to analyze document: ${
          error.message || 'Unknown error'
        }`
      });
    }
  })
);

// ============================================================
// WORK SUGGESTIONS
// ============================================================

app.post(
  '/api/work-suggestions',
  asyncHandler(async (req, res) => {
    const { context } = req.body;

    if (!context || context.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Context cannot be empty'
      });
    }

    console.log(
      `[API] Generating work suggestions for: ${context}`
    );

    if (!requireGemini(res)) {
      return;
    }

    try {
      const geminiModel =
        genAI.getGenerativeModel({
          model: 'gemini-2.5-flash'
        });

      const suggestionsPrompt = `
Based on the following context, provide smart work suggestions and recommendations:

Context:
${context}

Provide 5-7 actionable suggestions that can help improve efficiency, productivity, or outcomes.

Format the answer as a numbered list.
`;

      const result =
        await geminiModel.generateContent(
          suggestionsPrompt
        );

      const suggestionsText =
        result.response.text();

      res.json({
        success: true,
        suggestions: suggestionsText,
        reply: suggestionsText,
        model: 'gemini-2.5-flash'
      });
    } catch (error) {
      console.error(
        '❌ Work Suggestions Error:',
        error
      );

      res.status(500).json({
        success: false,
        error: `Failed to generate suggestions: ${
          error.message || 'Unknown error'
        }`
      });
    }
  })
);

// ============================================================
// KNOWLEDGE BASE / GUIDE
// ============================================================

app.post(
  '/api/process-guide',
  asyncHandler(async (req, res) => {
    const { query } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Query cannot be empty'
      });
    }

    console.log(
      `[API] Processing guide query: ${query}`
    );

    if (!requireGemini(res)) {
      return;
    }

    try {
      const geminiModel =
        genAI.getGenerativeModel({
          model: 'gemini-2.5-flash'
        });

      const guidePrompt = `
You are a helpful knowledge base assistant.

Answer the following question with detailed information:

Question:
${query}

Provide a comprehensive answer with examples where applicable.
`;

      const result =
        await geminiModel.generateContent(
          guidePrompt
        );

      const guideResponse =
        result.response.text();

      res.json({
        success: true,
        response: guideResponse,
        query,
        model: 'gemini-2.5-flash'
      });
    } catch (error) {
      console.error(
        '❌ Guide Processing Error:',
        error
      );

      res.status(500).json({
        success: false,
        error: `Failed to process guide: ${
          error.message || 'Unknown error'
        }`
      });
    }
  })
);

// ============================================================
// API 404 HANDLER
// ============================================================

app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
    path: req.path
  });
});

// ============================================================
// GLOBAL ERROR HANDLER
// ============================================================

app.use((err, req, res, next) => {
  console.error(
    '❌ Unhandled Server Error:',
    err
  );

  res.status(err.status || 500).json({
    success: false,
    error:
      err.message ||
      'Internal Server Error'
  });
});

// ============================================================
// VERCEL SERVERLESS EXPORT
// ============================================================

// IMPORTANT:
// Do NOT use app.listen() on Vercel.
// Vercel automatically starts this Express application.
module.exports = app;
