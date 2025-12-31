const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '..', 'data', 'ai-logs');
const outputPath = path.join(__dirname, '..', 'api', 'ai-usage.json');

function loadAllLogs() {
    if (!fs.existsSync(logDir)) return [];

    return fs.readdirSync(logDir)
        .filter(file => file.endsWith('.json'))
        .map(file => {
            try {
                return JSON.parse(fs.readFileSync(path.join(logDir, file), 'utf-8'));
            } catch (err) {
                console.error(`Failed to parse log: ${file}`, err);
                return null;
            }
        })
        .filter(log => log !== null)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

const logs = loadAllLogs();
const apiDir = path.dirname(outputPath);
if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(logs, null, 2), 'utf-8');
console.log(`Generated ai-usage.json with ${logs.length} entries`);
