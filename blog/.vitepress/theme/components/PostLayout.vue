<template>
  <Layout>
    <template #doc-before>
      <div v-if="frontmatter.image" class="post-banner">
        <img :src="frontmatter.image" alt="Banner" />
      </div>
      <PostTitle />
      <PostTags />
    </template>

    <template #doc-footer-before>
      <ShareButtons />
      <BackToTop />
    </template>

    <template #doc-after>
      <!-- <Comments /> -->
    </template>

    <template #home-hero-before>
      <Home />
    </template>
    
    <template #layout-bottom>
      <MermaidViewer />
    </template>
  </Layout>
</template>

<script setup lang="ts">
import { computed, watchEffect, onMounted, watch, nextTick } from 'vue';
import { useData, withBase, useRoute } from "vitepress";
import mediumZoom from 'medium-zoom';
import Home from "./Home.vue";
import PostTitle from "./post/PostTitle.vue";
import PostTags from "./post/PostTags.vue";
import BackToTop from "./misc/BackToTop.vue";
import ShareButtons from "./post/ShareButtons.vue";
import MermaidViewer from "./misc/MermaidViewer.vue";
import { openViewer } from "../composables/useMermaidViewer";

import DefaultTheme from "vitepress/theme";
const { Layout } = DefaultTheme;

const { theme, page, frontmatter } = useData();

watchEffect(() => {
  if (typeof document !== 'undefined') {
    const radius = theme.value.rounded || '8px';
    document.documentElement.style.setProperty('--vp-radius', radius);
  }

});

// Image Zoom
const route = useRoute();
const initZoom = () => {
  // Use nextTick to ensure DOM is ready
  nextTick(() => {
    mediumZoom('.vp-doc img', { background: 'var(--vp-c-bg)' });
  });
};

onMounted(() => {
  initZoom();
  
  // Delegate clicks on mermaid diagrams
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const mermaidDiv = target.closest('.mermaid');
    // Only open if click happened inside vp-doc to prevent misfires
    if (mermaidDiv && target.closest('.vp-doc')) {
      openViewer(mermaidDiv.innerHTML);
    }
  });
});

watch(
  () => route.path,
  () => initZoom()
);

const posts = computed(() => theme.value.posts || []);

// Find current post index
const currentPostIndex = computed(() => {
  // page.value.relativePath is like "posts/foo.md"
  // post.regularPath is like "/posts/foo"
  const currentPath = `/${page.value.relativePath.replace(/\.md$/, '')}`;
  return posts.value.findIndex((p: any) => p.regularPath === currentPath);
});

// Calculate Previous (Newer) and Next (Older) posts
const prevPost = computed(() => {
  if (currentPostIndex.value > 0) {
    return posts.value[currentPostIndex.value - 1];
  }
  return null;
});

const nextPost = computed(() => {
  if (currentPostIndex.value >= 0 && currentPostIndex.value < posts.value.length - 1) {
    return posts.value[currentPostIndex.value + 1];
  }
  return null;
});

function back() {
  window.history.back();
}
</script>

<style lang="css" scoped>
button {
  padding: 0.5rem 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s;
  margin-bottom: 2rem;
}

button:hover {
  background-color: var(--vp-c-bg-strong);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-white);
}

.next-prev-nav {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
}

.nav-btn {
  display: flex;
  flex-direction: column;
  flex: 1;
  max-width: 48%;
  padding: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  background-color: transparent;
  transition: all 0.25s;
}

.nav-btn:hover {
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg-soft);
}

.nav-btn.prev {
  align-items: flex-start;
  text-align: left;
}

.nav-btn.next {
  align-items: flex-end;
  text-align: right;
}

.nav-label {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.25rem;
}

.nav-title {
  font-size: 1rem;
  font-weight: 500;
  color: var(--vp-c-brand-1);
}

.nav-spacer {
  flex: 1;
  max-width: 48%;
}

.post-banner {
  position: relative;
  width: 100vw;
  height: 400px;
  margin-left: calc(-50vw + 50%);
  margin-top: -80px; /* Pull up behind the header */

  margin-bottom: 2rem;
  overflow: hidden;
  z-index: 10;
}

.post-banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
