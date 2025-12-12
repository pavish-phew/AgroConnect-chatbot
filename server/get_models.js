require('dotenv').config();

async function getAvailableModels() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error('❌ No API key found');
        return;
    }

    try {
        console.log('Fetching available models from Gemini API...\n');

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
        );

        if (!response.ok) {
            console.error('❌ Failed to fetch models');
            const text = await response.text();
            console.error('Response:', text);
            return;
        }

        const data = await response.json();

        if (!data.models || data.models.length === 0) {
            console.error('❌ No models found');
            return;
        }

        console.log(`✅ Found ${data.models.length} total models\n`);

        const contentModels = data.models.filter(m =>
            m.supportedGenerationMethods &&
            m.supportedGenerationMethods.includes('generateContent')
        );

        console.log(`✅ ${contentModels.length} models support generateContent:\n`);

        const modelNames = [];

        contentModels.forEach((model, index) => {
            const fullName = model.name;
            const shortName = fullName.replace('models/', '');
            modelNames.push(shortName);

            console.log(`${index + 1}. ${fullName}`);
            console.log(`   Display: ${model.displayName || 'N/A'}`);
            console.log(`   Description: ${model.description?.substring(0, 80) || 'N/A'}...`);
            console.log('');
        });

        console.log('='.repeat(60));
        console.log('📋 COPY THESE MODEL NAMES FOR YOUR CODE:');
        console.log('='.repeat(60));
        console.log('const modelsToTry = [');
        modelNames.forEach(name => {
            console.log(`  "${name}",`);
        });
        console.log('];');
        console.log('='.repeat(60));

        // Also save to file
        const fs = require('fs');
        const modelList = modelNames.map(name => `  "${name}",`).join('\n');
        const fileContent = `// Available Gemini models for your API key\n// Generated: ${new Date().toISOString()}\n\nconst modelsToTry = [\n${modelList}\n];\n\nmodule.exports = { modelsToTry };`;

        fs.writeFileSync('available_models.js', fileContent);
        console.log('\n✅ Model list saved to: available_models.js');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

getAvailableModels();
