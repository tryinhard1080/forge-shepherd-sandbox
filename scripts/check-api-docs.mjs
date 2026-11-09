// Fails when a function exported from src/ is not listed in docs/API.md.
import { readdirSync, readFileSync } from 'node:fs';
const docs = readFileSync('docs/API.md', 'utf8');
const missing = [];
for (const file of readdirSync('src')) {
  for (const m of readFileSync(`src/${file}`, 'utf8').matchAll(/^export (?:async )?(?:function|const) (\w+)/gm)) {
    if (!docs.includes('`' + m[1] + '(')) missing.push(`${m[1]} (src/${file})`);
  }
}
if (missing.length) { console.error(`docs error: not listed in docs/API.md: ${missing.join(', ')}`); process.exit(1); }
