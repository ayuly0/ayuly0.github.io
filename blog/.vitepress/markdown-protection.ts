/**
 * Markdown Protection Plugin for VitePress
 * 
 * Encrypts content inside ::: protection blocks at build time.
 * Syntax: ::: protection :: password
 * 
 * The content is encrypted with AES-256-CBC using PBKDF2 key derivation.
 */

import Container from 'markdown-it-container';
import CryptoJS from 'crypto-js';
import type MarkdownIt from 'markdown-it';
import type Token from 'markdown-it/lib/token.mjs';

const MAGIC_PREFIX = 'PROTECTED_CONTENT_V1:';
const PBKDF2_ITERATIONS = 100000; // Higher iterations for better security

export function markdownProtectionPlugin(md: MarkdownIt) {
    md.use(Container, 'protection', {
        validate: (params: string) => {
            return /^protection\s*::/.test(params.trim());
        },
        render: () => '' // Handled by core rule
    });

    md.core.ruler.push('protection_processor', (state) => {
        const tokens = state.tokens;
        const result: Token[] = [];
        let i = 0;

        while (i < tokens.length) {
            const token = tokens[i];

            if (token.type !== 'container_protection_open') {
                result.push(token);
                i++;
                continue;
            }

            // Parse: ::: protection :: password
            const params = token.info.trim();
            const match = params.match(/^protection\s*::\s*(.+)$/);

            if (!match) {
                const errorToken = new state.Token('html_block', '', 0);
                errorToken.content = '<div class="protection-error">Invalid syntax. Use: ::: protection :: password</div>';
                result.push(errorToken);
                i++;
                continue;
            }

            const password = match[1].trim();

            // Collect tokens until closing tag
            const innerTokens: Token[] = [];
            let depth = 1;
            let closeIdx = -1;

            for (let j = i + 1; j < tokens.length; j++) {
                const t = tokens[j];
                if (t.type === 'container_protection_open') {
                    depth++;
                    innerTokens.push(t);
                } else if (t.type === 'container_protection_close') {
                    depth--;
                    if (depth === 0) {
                        closeIdx = j;
                        break;
                    }
                    innerTokens.push(t);
                } else {
                    innerTokens.push(t);
                }
            }

            if (closeIdx === -1) {
                const errorToken = new state.Token('html_block', '', 0);
                errorToken.content = '<div class="protection-error">Missing closing :::</div>';
                result.push(errorToken);
                i++;
                continue;
            }

            // Render inner content to HTML
            const htmlContent = md.renderer.render(innerTokens, md.options, state.env);

            // Encrypt
            const plaintext = MAGIC_PREFIX + htmlContent;
            const salt = CryptoJS.lib.WordArray.random(16);
            const iv = CryptoJS.lib.WordArray.random(16);

            const key = CryptoJS.PBKDF2(password, salt, {
                keySize: 256 / 32,
                iterations: PBKDF2_ITERATIONS,
                hasher: CryptoJS.algo.SHA256
            });

            const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });

            // Pack as Base64: salt(32) + iv(32) + ciphertext
            const packed = salt.toString() + iv.toString() + encrypted.ciphertext.toString();
            const packedBase64 = Buffer.from(packed, 'hex').toString('base64');

            // Create component
            const componentToken = new state.Token('html_block', '', 0);
            componentToken.content = `<ProtectedPost data="${packedBase64}" />`;
            result.push(componentToken);

            i = closeIdx + 1;
        }

        state.tokens = result;
    });
}

export default markdownProtectionPlugin;
