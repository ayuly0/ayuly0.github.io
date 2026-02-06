// https://vitepress.dev/guide/custom-theme

import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import "./style.css";
import 'virtual:uno.css'

import PostLayout from "./components/PostLayout.vue";
import Tags from "./components/Tags.vue";
import Confetti from "./components/misc/Confetti.vue";
import LinkPreview from "./components/LinkPreview.vue";
import FileDownload from "./components/FileDownload.vue";
import Categories from "./components/Categories.vue";

import ProtectedPost from "./components/ProtectedPost.vue";

export default {
  extends: DefaultTheme,
  Layout: PostLayout,
  enhanceApp({ app, router, siteData }) {
    app.component("Tags", Tags);
    app.component("Confetti", Confetti);
    app.component("LinkPreview", LinkPreview);
    app.component("FileDownload", FileDownload);
    app.component("Categories", Categories);
    app.component("ProtectedPost", ProtectedPost);
  },
} satisfies Theme;
