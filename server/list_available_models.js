require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error('No GEMINI_API_KEY found in .env');
            return;
        }

        console.log('API Key present, length:', apiKey.length);
        console.log('\nFetching available models...\n');

        const genAI = new GoogleGenerativeAI(apiKey);

        // Try to list models using the SDK
        // Note: The SDK might not have a direct listModels method, so we'll try a different approach

        // Let's try using fetch directly
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
        );

        if (!response.ok) {
            console.error('Error fetching models:', response.status, response.statusText);
            const text = await response.text();
            console.error('Response:', text);
            return;
        }

        const data = await response.json();

        if (data.models) {
            console.log('=== AVAILABLE MODELS ===\n');

            const contentModels = data.models.filter(m =>
                m.supportedGenerationMethods &&
                m.supportedGenerationMethods.includes('generateContent')
            );

            console.log(`Found ${contentModels.length} models that support generateContent:\n`);

            contentModels.forEach(model => {
                console.log(`✓ ${model.name}`);
                console.log(`  Display Name: ${model.displayName || 'N/A'}`);
                console.log(`  Methods: ${model.supportedGenerationMethods.join(', ')}`);
                console.log('');
            });

            console.log('========================\n');

            // Extract just the model names for easy copying
            console.log('Model names to use in code:');
            contentModels.forEach(model => {
                // Extract the model name after "models/"
                const modelName = model.name.replace('models/', '');
                console.log(`  "${modelName}",`);
            });

        } else {
            console.log('No models found in response');
            console.log('Response:', JSON.stringify(data, null, 2));
        }

    } catch (error) {
        console.error('Error:', error.message);
        console.error('Full error:', error);
    }
}

listModels();
