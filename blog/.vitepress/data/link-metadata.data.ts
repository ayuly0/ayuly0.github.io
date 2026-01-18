import { createContentLoader } from 'vitepress'
import ogs from 'open-graph-scraper'
import fs from 'node:fs'
import path from 'node:path'

interface LinkMetadata {
    url: string
    title: string
    description?: string
    image?: string
    icon?: string
}

// Map to cache results to avoid fetching same URL multiple times during build
const cache = new Map<string, LinkMetadata>()

export declare const data: Record<string, LinkMetadata>

export default createContentLoader('posts/**/*.md', {
    includeSrc: true, // Need the raw content to parse regex
    async transform(rawData) {
        const linkRegex = /<LinkPreview\s+[^>]*url=["']([^"']+)["'][^>]*>/g
        const urlsToFetch = new Set<string>()

        // 1. Extract all URLs from all posts
        for (const page of rawData) {
            if (!page.src) continue
            let match
            while ((match = linkRegex.exec(page.src)) !== null) {
                urlsToFetch.add(match[1])
            }
        }

        const results: Record<string, LinkMetadata> = {}

        // 2. Fetch Metadata
        for (const url of urlsToFetch) {
            if (cache.has(url)) {
                results[url] = cache.get(url)!
                continue
            }

            try {
                // Use a timeout to prevent hanging builds
                const { result } = await ogs({ url, timeout: 5000 })

                const metadata: LinkMetadata = {
                    url,
                    title: result.ogTitle || result.twitterTitle || url,
                    description: result.ogDescription || result.twitterDescription,
                    image: result.ogImage?.[0]?.url || result.twitterImage?.[0]?.url,
                    icon: result.favicon ? (result.favicon.startsWith('http') ? result.favicon : new URL(result.favicon, url).toString()) : undefined
                }

                cache.set(url, metadata)
                results[url] = metadata
            } catch (e) {
                console.warn(`[LinkPreview] Failed to fetch metadata for ${url}:`, e)
                // Fallback
                results[url] = { url, title: url }
            }
        }

        return results
    }
})
