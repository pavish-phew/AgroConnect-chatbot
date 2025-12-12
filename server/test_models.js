require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('No API key found');
        return;
    }

    console.log('Testing different model name formats...\n');

    const genAI = new GoogleGenerativeAI(apiKey);

    const modelsToTest = [
        "gemini-1.5-flash-latest",
        "gemini-1.5-flash",
        "gemini-1.5-pro-latest",
        "gemini-1.5-pro",
        "gemini-pro",
        "gemini-1.0-pro-latest",
        "gemini-1.0-pro",
        "models/gemini-1.5-flash-latest",
        "models/gemini-1.5-flash",
        "models/gemini-1.5-pro-latest",
        "models/gemini-1.5-pro",
        "models/gemini-pro",
        "models/gemini-1.0-pro-latest",
        "models/gemini-1.0-pro"
    ];

    for (const modelName of modelsToTest) {
        try {
            console.log(`Testing: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Say 'Hello' in one word");
            const response = await result.response;
            const text = response.text();
            console.log(`  ✓ SUCCESS! Response: ${text.trim()}`);
            console.log(`  >>> USE THIS MODEL: "${modelName}"\n`);
            break; // Stop after first success
        } catch (error) {
            console.log(`  ✗ Failed: ${error.message.substring(0, 100)}...\n`);
        }
    }
}

testModels();
