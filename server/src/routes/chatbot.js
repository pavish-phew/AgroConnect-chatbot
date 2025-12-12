const express = require('express');
const { chatWithAI } = require('../services/chatbotService');

const router = express.Router();

// POST /api/chat
// Handles user chat messages and returns AI responses
router.post('/', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        error: 'Message is required and must be a non-empty string'
      });
    }

    // Format conversation history for OpenAI
    const messages = conversationHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    }));

    // Add current user message
    messages.push({
      role: 'user',
      content: message.trim(),
    });

    // Get AI response
    const aiResponse = await chatWithAI(messages);

    res.json({
      response: aiResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('=== CHATBOT ROUTE ERROR ===');
    console.error('Error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('==========================');

    res.status(500).json({
      error: error.message || 'Failed to process chat message'
    });
  }
});

module.exports = router;

