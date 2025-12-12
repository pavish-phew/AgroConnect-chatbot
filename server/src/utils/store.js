const fs = require('fs').promises;
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');

const ensureDir = async () => {
  await fs.mkdir(dataDir, { recursive: true });
};

const readJson = async (file, fallback) => {
  await ensureDir();
  const fullPath = path.join(dataDir, file);
  try {
    const raw = await fs.readFile(fullPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') {
      await writeJson(file, fallback);
      return fallback;
    }
    throw err;
  }
};

const writeJson = async (file, data) => {
  await ensureDir();
  const fullPath = path.join(dataDir, file);
  await fs.writeFile(fullPath, JSON.stringify(data, null, 2));
};

module.exports = {
  readJson,
  writeJson,
};

