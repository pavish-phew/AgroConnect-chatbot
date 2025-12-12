# AI Chatbot Integration Guide

This guide explains how the AI-powered chatbot has been integrated into your MERN stack application.

## 📁 Files Added/Modified

### Backend Files

#### 1. `server/src/services/chatbotService.js` (NEW)
- **Purpose**: Handles communication with OpenAI API
- **Key Features**:
  - Initializes OpenAI client with API key from environment variables
  - Contains system prompt tailored for Agro Connect marketplace
  - Processes chat messages and returns AI responses
  - Error handling for API failures

#### 2. `server/src/routes/chatbot.js` (NEW)
- **Purpose**: Express route handler for chat endpoints
- **Route**: `POST /api/chat`
- **Request Body**:
  ```json
  {
    "message": "User's message here",
    "conversationHistory": [
      { "role": "user", "content": "Previous message" },
      { "role": "assistant", "content": "AI response" }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "response": "AI's response text",
    "timestamp": "2024-01-01T12:00:00.000Z"
  }
  ```

#### 3. `server/src/app.js` (MODIFIED)
- **Change**: Added chatbot route import and registration
- **Line Added**: `const chatbotRoutes = require('./routes/chatbot');`
- **Line Added**: `app.use('/api/chat', chatbotRoutes);`

#### 4. `server/package.json` (MODIFIED)
- **Dependency Added**: `openai` package for OpenAI API integration

### Frontend Files

#### 5. `client/src/components/Chatbot.jsx` (NEW)
- **Purpose**: React component for the chatbot UI
- **Features**:
  - Floating chat bubble button
  - Expandable chat window
  - Message history display
  - Real-time typing indicator
  - Auto-scroll to latest message
  - Keyboard shortcuts (Enter to send)

#### 6. `client/src/components/Chatbot.css` (NEW)
- **Purpose**: Styling for the chatbot component
- **Features**:
  - Modern gradient design
  - Responsive layout
  - Smooth animations
  - Mobile-friendly

#### 7. `client/src/App.jsx` (MODIFIED)
- **Change**: Added Chatbot component import and rendered it
- **Lines Added**: 
  - `import Chatbot from './components/Chatbot'`
  - `<Chatbot />` component in the JSX

## 🚀 Setup Instructions

### Step 1: Install Dependencies

The OpenAI package should already be installed. If not, run:

```bash
cd server
npm install openai
```

### Step 2: Configure Environment Variables

1. Create a `.env` file in the `server` directory (if it doesn't exist)
2. Copy the contents from `server/.env.example` to your `.env` file
3. Add your OpenAI API key:

```env
OPENAI_API_KEY=sk-your-actual-api-key-here
OPENAI_MODEL=gpt-3.5-turbo
```

**How to get an OpenAI API key:**
1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Create a new API key
4. Copy the key and paste it in your `.env` file

**Note**: Keep your `.env` file secure and never commit it to version control!

### Step 3: Start the Application

1. **Start the backend server:**
   ```bash
   cd server
   npm run dev
   ```

2. **Start the frontend (in a new terminal):**
   ```bash
   cd client
   npm run dev
   ```

### Step 4: Test the Chatbot

1. Open your application in the browser (usually `http://localhost:5173`)
2. Look for the floating chat bubble in the bottom-right corner
3. Click it to open the chat window
4. Type a message and press Enter or click Send
5. The AI should respond!

## 🔒 Security Features

1. **API Key Protection**: OpenAI API key is stored in `.env` file (server-side only)
2. **Input Validation**: Backend validates all incoming messages
3. **Error Handling**: Graceful error handling prevents API key exposure
4. **Rate Limiting**: Consider adding rate limiting in production (not included by default)

## 🎨 Customization

### Change the Chatbot Appearance

Edit `client/src/components/Chatbot.css` to customize:
- Colors (search for `#667eea` and `#764ba2` for gradient colors)
- Size and position of chat window
- Animation speeds
- Font sizes

### Modify Chatbot Behavior

Edit `server/src/services/chatbotService.js`:
- **System Prompt**: Change the `SYSTEM_PROMPT` constant to customize the AI's personality and knowledge
- **Model**: Change `OPENAI_MODEL` in `.env` to use different models (gpt-4, etc.)
- **Temperature**: Adjust `temperature` parameter (0.0-1.0) for more/less creative responses
- **Max Tokens**: Adjust `max_tokens` for longer/shorter responses

### Change the API Endpoint

If you want to use a different LLM provider:

1. Modify `server/src/services/chatbotService.js` to use a different API
2. Update the API call logic
3. Adjust environment variables accordingly

## 🐛 Troubleshooting

### Chatbot not responding?

1. **Check API Key**: Ensure `OPENAI_API_KEY` is set in `server/.env`
2. **Check Server Logs**: Look for errors in the backend console
3. **Check Network**: Open browser DevTools → Network tab to see API calls
4. **Check CORS**: Ensure CORS is properly configured in `server/src/app.js`

### Error: "OpenAI API key is not configured"

- Make sure your `.env` file exists in the `server` directory
- Verify the variable name is exactly `OPENAI_API_KEY`
- Restart your server after adding the API key

### Chatbot UI not showing?

1. Check browser console for errors
2. Verify `Chatbot` component is imported in `App.jsx`
3. Check if CSS file is loading properly

## 📝 API Usage Example

### Direct API Call (for testing)

```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What products do you have?",
    "conversationHistory": []
  }'
```

### From Frontend

The chatbot component automatically handles API calls. The conversation history is maintained in the component state and sent with each request for context-aware responses.

## 🎯 Features Implemented

✅ Floating chat bubble button  
✅ Expandable chat window  
✅ Message history with timestamps  
✅ Typing indicator during AI response  
✅ Auto-scroll to latest message  
✅ Keyboard shortcuts (Enter to send)  
✅ Responsive design (mobile-friendly)  
✅ Error handling and user feedback  
✅ Conversation context maintenance  
✅ Secure API key management  
✅ Clean, well-commented code  

## 🔄 Next Steps (Optional Enhancements)

1. **Add Authentication**: Require users to be logged in to use chatbot
2. **Add Rate Limiting**: Prevent API abuse
3. **Add Chat History**: Store conversations in database
4. **Add File Uploads**: Allow users to share images/documents
5. **Add Voice Input**: Speech-to-text integration
6. **Add Multiple Languages**: Internationalization support
7. **Add Analytics**: Track chatbot usage and popular questions

## 📚 Additional Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [OpenAI Models Overview](https://platform.openai.com/docs/models)
- [React Documentation](https://react.dev)

---

**Note**: This chatbot uses OpenAI's API, which may incur costs based on usage. Monitor your usage at https://platform.openai.com/usage



