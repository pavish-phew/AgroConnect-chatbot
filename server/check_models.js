const { execSync } = require('child_process');
require('dotenv').config();

try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error("No GEMINI_API_KEY found in .env");
        process.exit(1);
    }

    console.log("Fetching models via curl...");
    const cmd = `curl "https://generativelanguage.googleapis.com/v1beta/models?key=${key}"`;
    const output = execSync(cmd).toString();

    const data = JSON.parse(output);
    if (data.models) {
        console.log("\n=== AVAILABLE MODELS ===");
        data.models.forEach(m => {
            if (m.supportedGenerationMethods.includes("generateContent")) {
                console.log(`- ${m.name}`);
            }
        });
        console.log("========================\n");
    } else {
        console.log("Raw output:", output);
    }
} catch (error) {
    console.error("Error running curl:", error.message);
}
