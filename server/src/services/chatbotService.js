const { GoogleGenerativeAI } = require('@google/generative-ai');

// System prompt to make the chatbot context-aware for the Agro Connect marketplace
const SYSTEM_PROMPT = `You are a helpful AI assistant for Agro Connect, an online marketplace for farm products. 
You help customers with:
- Product inquiries and recommendations
- Order status and tracking
- General marketplace questions
- Farming and agricultural advice
- Account and payment questions

Be friendly, concise, and helpful. If you don't know something specific about a user's account or order, 
direct them to contact support or check their account dashboard.

IMPORTANT: Answer as the AI assistant.`;

const chatWithAI = async (messages) => {
  console.log('=== chatWithAI called ===');
  console.log('Number of messages:', messages.length);

  try {
    // Get and validate API key
    const apiKey = (process.env.GEMINI_API_KEY || '').replace(/[\"']/g, '').trim();
    console.log('API Key check - Present:', !!apiKey, 'Length:', apiKey ? apiKey.length : 0);

    if (!apiKey) {
      const error = new Error('Gemini API key is not configured in environment variables');
      console.error('FATAL:', error.message);
      throw error;
    }

    // Initialize Gemini client
    console.log('Initializing Gemini client...');
    const genAI = new GoogleGenerativeAI(apiKey);

    // Convert conversation history to Gemini format
    console.log('Converting message history...');
    let rawHistory = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    // Sanitize history to ensure proper user/model alternation
    const sanitizedHistory = [];
    let expectingRole = 'user';

    for (const msg of rawHistory) {
      if (msg.role === expectingRole) {
        sanitizedHistory.push(msg);
        expectingRole = expectingRole === 'user' ? 'model' : 'user';
      } else {
        if (sanitizedHistory.length > 0) {
          const lastMsg = sanitizedHistory[sanitizedHistory.length - 1];
          lastMsg.parts[0].text += `\n\n(Additional context: ${msg.parts[0].text})`;
        }
      }
    }

    // Inject system prompt into first user message
    if (sanitizedHistory.length > 0) {
      sanitizedHistory[0].parts[0].text = `${SYSTEM_PROMPT}\n\nUser: ${sanitizedHistory[0].parts[0].text}`;
    }

    // Get the current message
    const lastMessage = messages[messages.length - 1];
    let lastMessageText = lastMessage.content;
    if (sanitizedHistory.length === 0) {
      lastMessageText = `${SYSTEM_PROMPT}\n\nUser: ${lastMessageText}`;
    }

    console.log('History length:', sanitizedHistory.length);
    console.log('Current message:', lastMessageText.substring(0, 100) + '...');

    // Try multiple models as fallback
    // Using models that are actually available with the current API key
    const modelsToTry = [
      "gemini-2.5-flash",           // Recommended - fastest
      "gemini-flash-latest",        // Alias for latest flash
      "gemini-2.0-flash",           // Stable version
      "gemini-2.5-pro",             // More capable
      "gemini-pro-latest",          // Alias for latest pro
      "gemini-exp-1206"             // Experimental
    ];

    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`Attempting model: ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });

        const chat = model.startChat({
          history: sanitizedHistory,
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.7,
          },
        });

        console.log('Sending message to Gemini API...');
        const result = await chat.sendMessage(lastMessageText);
        const response = await result.response;
        const text = response.text();

        console.log(`✓ Success with model: ${modelName}`);
        console.log('Response length:', text.length);
        return text;

      } catch (err) {
        console.warn(`✗ Failed with model ${modelName}:`, err.message);
        lastError = err;
        // Continue to next model
      }
    }

    // If all models failed
    console.error('All models failed. Last error:', lastError);
    throw lastError || new Error('All Gemini models failed');

  } catch (error) {
    console.error('=== CHATBOT SERVICE ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('============================');
    throw new Error(error.message || 'Failed to get response from AI');
  }
};

module.exports = {
  chatWithAI,
};
