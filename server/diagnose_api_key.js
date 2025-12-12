require('dotenv').config();

async function diagnoseAPIKey() {
    const apiKey = process.env.GEMINI_API_KEY;

    console.log('=== API KEY DIAGNOSIS ===\n');

    if (!apiKey) {
        console.error('❌ GEMINI_API_KEY is not set in .env file');
        return;
    }

    console.log('✓ API Key found');
    console.log('  Length:', apiKey.length);
    console.log('  First 10 chars:', apiKey.substring(0, 10) + '...');
    console.log('  Last 5 chars:', '...' + apiKey.substring(apiKey.length - 5));

    // Check for common issues
    if (apiKey.includes(' ')) {
        console.warn('⚠️  WARNING: API key contains spaces');
    }
    if (apiKey.includes('"') || apiKey.includes("'")) {
        console.warn('⚠️  WARNING: API key contains quotes');
    }
    if (apiKey.startsWith('AIza') === false) {
        console.warn('⚠️  WARNING: Gemini API keys typically start with "AIza"');
    }

    console.log('\n=== TESTING API KEY ===\n');

    // Test with direct fetch
    try {
        console.log('Testing API key by listing models...');
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
        );

        console.log('Response status:', response.status, response.statusText);

        if (!response.ok) {
            const text = await response.text();
            console.error('\n❌ API Request Failed:');
            console.error('Status:', response.status);
            console.error('Response:', text);

            if (response.status === 400) {
                console.error('\n💡 This usually means:');
                console.error('   - Invalid API key format');
                console.error('   - API key contains extra characters or quotes');
            } else if (response.status === 403) {
                console.error('\n💡 This usually means:');
                console.error('   - API key is valid but doesn\'t have permission');
                console.error('   - Gemini API is not enabled for this project');
                console.error('   - Billing is not set up');
            } else if (response.status === 429) {
                console.error('\n💡 This usually means:');
                console.error('   - Rate limit exceeded');
                console.error('   - Quota exceeded');
            }

            return;
        }

        const data = await response.json();

        if (data.models && data.models.length > 0) {
            console.log('\n✅ API KEY IS VALID!\n');
            console.log(`Found ${data.models.length} available models:\n`);

            const contentModels = data.models.filter(m =>
                m.supportedGenerationMethods &&
                m.supportedGenerationMethods.includes('generateContent')
            );

            console.log('Models that support generateContent:');
            contentModels.forEach(model => {
                const modelName = model.name.replace('models/', '');
                console.log(`  ✓ ${modelName}`);
            });

            if (contentModels.length > 0) {
                const firstModel = contentModels[0].name.replace('models/', '');
                console.log(`\n💡 Recommended model to use: "${firstModel}"`);
            }
        } else {
            console.log('⚠️  No models found in response');
            console.log('Response:', JSON.stringify(data, null, 2));
        }

    } catch (error) {
        console.error('\n❌ Error testing API key:');
        console.error(error.message);
        console.error('\nFull error:', error);
    }
}

diagnoseAPIKey();
