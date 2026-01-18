import fs from 'node:fs'
import path from 'node:path'
import { globby } from 'globby'

export declare const data: Record<string, string>

export default {
    async load() {
        const cwd = process.cwd()
        const sizes: Record<string, string> = {}

        // 1. Scan public directory (e.g. blog/public)
        const publicDir = path.resolve(cwd, 'blog/public')
        if (fs.existsSync(publicDir)) {
            const publicFiles = await globby(['**/*'], { cwd: publicDir })
            for (const file of publicFiles) {
                try {
                    const stats = fs.statSync(path.join(publicDir, file))
                    sizes['/' + file] = formatBytes(stats.size)
                } catch (e) { }
            }
        }

        // 2. Scan source directory (blog/) for assets in posts, excluding markdown and system files
        const srcDir = path.resolve(cwd, 'blog')
        if (fs.existsSync(srcDir)) {
            // Exclude markdown, vitepress config/theme, and public dir (already scanned)
            const srcFiles = await globby(['**/*'], {
                cwd: srcDir,
                ignore: [
                    '**/*.md',
                    '.vitepress/**/*',
                    'public/**/*',
                    'node_modules/**/*'
                ]
            })

            for (const file of srcFiles) {
                try {
                    const stats = fs.statSync(path.join(srcDir, file))
                    // VitePress serves assets in root relative to base
                    // e.g. blog/posts/img.png -> /posts/img.png
                    sizes['/' + file] = formatBytes(stats.size)
                } catch (e) { }
            }
        }

        return sizes
    }
}

function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
