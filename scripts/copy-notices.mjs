import { copyFile } from 'node:fs/promises';

await copyFile(new URL('../THIRD-PARTY-NOTICES.md', import.meta.url), new URL('../dist/THIRD-PARTY-NOTICES.md', import.meta.url));
await copyFile(new URL('../LICENSE', import.meta.url), new URL('../dist/LICENSE', import.meta.url));
