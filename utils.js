import { fileURLToPath } from 'url';
import path from 'node:path';

export function getCurrentModulePath(moduleUrl) {
    const __filename = fileURLToPath(moduleUrl);
    const __dirname = path.dirname(__filename);
    return __dirname;
}