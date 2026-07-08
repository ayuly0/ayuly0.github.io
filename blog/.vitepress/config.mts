import { defineConfigWithTheme } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";
import { getPosts, generateSidebar } from "./theme/utils";
import { BlogliorelliTheme } from "./theme/types";
import UnoCSS from 'unocss/vite'
import { genFeed } from "./genFeed";


import { markdownProtectionPlugin } from "./markdown-protection";

// https://vitepress.dev/reference/site-config
export default withMermaid(
  defineConfigWithTheme<BlogliorelliTheme>({
  lang: "en-US",
  title: "Ayuly's Blog",
  description: "Ayuly's blog",
  cleanUrls: true,
  lastUpdated: true,
  sitemap: {
    hostname: "https://ayuly0.github.io",
  },
  vite: {
    plugins: [UnoCSS()],
    ssr: {
      noExternal: ['@panzoom/panzoom']
    }
  },
  markdown: {
    config: (md) => {
      md.use(markdownProtectionPlugin);
    }
  },
  themeConfig: {
    cursorOffset: 10,
    posts: await getPosts(),
    sidebar: await generateSidebar(),
    rounded: '2px',
    outline: { level: [2, 6] },

    logo: "/logo.png",
    nav: [
      { text: 'Category', link: "/category", activeMatch: "/category" },
      { text: 'Tags', link: "/tags", activeMatch: "/tags" },
      { text: 'About', link: "/about", activeMatch: "/about" },
    ],

    search: {
      provider: "local",
      options: { detailedView: true, disableQueryPersistence: true },
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/ayuly0" }
    ],
    footer: {
      message: 'Released under the MIT License. <a href="/sitemap.xml">Sitemap</a> | <a href="/feed.rss">RSS</a>',
      copyright: "Copyright © 2026-present Ayuly",
    },
  },
  buildEnd: genFeed,
  head: [
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        href: "/logo.png",
      },
    ],
    [
      "meta",
      {
        name: "author",
        content: "Ayuly",
      },
    ],
    [
      "link",
      {
        rel: "alternate",
        type: "application/rss+xml",
        href: "/feed.rss",
        title: "Ayuly's Security Journal"
      }
    ],
  ],
  })
);
