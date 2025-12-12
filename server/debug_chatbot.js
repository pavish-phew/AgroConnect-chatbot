require('dotenv').config();
const { chatWithAI } = require('./src/services/chatbotService');

async function testChatbot() {
    console.log('=== Testing Chatbot Service ===');

    try {
        // Test with a simple message
        const messages = [
            {
                role: 'user',
                content: 'Hello, can you help me?'
            }
        ];

        console.log('Sending message to chatbot...');
        const response = await chatWithAI(messages);
        console.log('SUCCESS! Response:', response);
    } catch (error) {
        console.error('ERROR:', error.message);
        console.error('Full error:', error);
    }
}

testChatbot();
