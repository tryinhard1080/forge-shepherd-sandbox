// Fails when any source file contains a console.log call.
import { readdirSync, readFileSync } from 'node:fs';
const bad = readdirSync('src').filter(f => readFileSync(`src/${f}`, 'utf8').includes('console.log'));
if (bad.length) { console.error(`lint error: console.log in ${bad.join(', ')}`); process.exit(1); }
