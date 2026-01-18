import path from 'path'
import { writeFileSync } from 'fs'
import { Feed } from 'feed'
import { createContentLoader, type SiteConfig } from 'vitepress'

const baseUrl = `https://ayuly0.github.io`

export async function genFeed(config: SiteConfig) {
    const feed = new Feed({
        title: "Ayuly's Security Journal",
        description: "Documenting my journey in Offensive Security, Malware Development, CTF, and Pentesting.",
        id: baseUrl,
        link: baseUrl,
        language: 'en',
        image: `${baseUrl}/logo.png`,
        favicon: `${baseUrl}/favicon.ico`,
        copyright: 'Copyright (c) 2026-present Ayuly'
    })

    const posts = await createContentLoader('posts/*.md', {
        render: true,
        excerpt: true
    }).load()

    posts.sort(
        (a, b) =>
            +new Date(b.frontmatter.date as string) -
            +new Date(a.frontmatter.date as string)
    )

    for (const { url, frontmatter, html } of posts) {
        feed.addItem({
            title: frontmatter.title,
            id: `${baseUrl}${url}`,
            link: `${baseUrl}${url}`,
            description: frontmatter.description,
            content: html,
            author: [
                {
                    name: 'Ayuly',
                    email: 'null@unknown.com',
                    link: 'https://github.com/ayuly0'
                }
            ],
            date: frontmatter.date
        })
    }

    writeFileSync(path.join(config.outDir, 'feed.rss'), feed.rss2())
    writeFileSync(path.join(config.outDir, 'feed.atom'), feed.atom1())
    writeFileSync(path.join(config.outDir, 'feed.json'), feed.json1())
}
