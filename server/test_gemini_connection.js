const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const logFile = path.join(__dirname, 'test_gemini_output.txt');

function log(message) {
    console.log(message);
    fs.appendFileSync(logFile, message + '\n');
}

async function testConnection() {
    fs.writeFileSync(logFile, ''); // Clear file
    try {
        const key = process.env.GEMINI_API_KEY;
        log("Checking API Key availability...");
        if (!key) {
            log("ERROR: GEMINI_API_KEY is missing in .env");
            return;
        }
        log("API Key present (length: " + key.length + ")");

        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        log("Sending test prompt to gemini-1.5-flash...");
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        const text = response.text();

        log("SUCCESS! Response received:");
        log(text);

    } catch (error) {
        log("FAILED to connect or generate content.");
        log("Error details: " + JSON.stringify(error, Object.getOwnPropertyNames(error)));
    }
}

testConnection();
