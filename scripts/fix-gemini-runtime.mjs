import fs from 'node:fs';
import path from 'node:path';

const file = path.join(process.cwd(), 'server.ts');
let server = fs.readFileSync(file, 'utf8');

// Gemini 3.7+ deprecates sampling controls such as temperature.
server = server.replace("model: 'gemini-3.7-flash'", "model: 'gemini-3.8-flash'");
server = server.replace("              temperature: 0.7,\n", "");

fs.writeFileSync(file, server, 'utf8');
console.log('✅ Gemini runtime compatibility patch applied.');
