# Chatbot Quick Start Guide

## ✅ What's Been Added

### Backend
- ✅ Route: `POST /api/chat`
- ✅ Service: `server/src/services/chatbotService.js`
- ✅ Route Handler: `server/src/routes/chatbot.js`

### Frontend
- ✅ Component: `client/src/components/Chatbot.jsx`
- ✅ Styles: `client/src/components/Chatbot.css`
- ✅ Integrated into `App.jsx`

## 🚀 Quick Setup (3 Steps)

### 1. Add OpenAI API Key

Create or edit `server/.env`:

```env
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL=gpt-3.5-turbo
```

Get your API key: https://platform.openai.com/api-keys

### 2. Start Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### 3. Test It!

1. Open http://localhost:5173
2. Click the chat bubble (bottom-right)
3. Type a message and press Enter

## 📍 File Locations

```
maamey/
├── server/
│   ├── src/
│   │   ├── routes/
│   │   │   └── chatbot.js          ← NEW: Chat route handler
│   │   ├── services/
│   │   │   └── chatbotService.js   ← NEW: OpenAI integration
│   │   └── app.js                   ← MODIFIED: Added route
│   └── .env                         ← ADD: Your API key here
│
└── client/
    └── src/
        ├── components/
        │   ├── Chatbot.jsx          ← NEW: Chat UI component
        │   └── Chatbot.css          ← NEW: Chat styles
        └── App.jsx                   ← MODIFIED: Added Chatbot
```

## 🔍 API Endpoint

**POST** `/api/chat`

**Request:**
```json
{
  "message": "What products do you have?",
  "conversationHistory": []
}
```

**Response:**
```json
{
  "response": "We have a variety of farm products...",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## 🎨 Features

- ✅ Floating chat bubble
- ✅ Chat window with message history
- ✅ Typing indicator
- ✅ Auto-scroll
- ✅ Responsive design
- ✅ Keyboard shortcuts (Enter to send)
- ✅ Error handling

## 🐛 Troubleshooting

**"OpenAI API key is not configured"**
→ Add `OPENAI_API_KEY` to `server/.env` and restart server

**Chatbot not showing**
→ Check browser console for errors
→ Verify Chatbot is imported in `App.jsx`

**No response from AI**
→ Check server logs
→ Verify API key is valid
→ Check OpenAI account has credits

---

For detailed documentation, see `CHATBOT_SETUP.md`



