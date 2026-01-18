<template>
  <div class="file-browser">
    <div class="browser-header">
      <h2 class="path">
        <span class="root-icon i-ri-hard-drive-2-line"></span>
        <span class="path-segment" @click="selectedCategory = null">/ root</span>
        <span v-if="selectedCategory" class="path-segment">/ {{ selectedCategory }}</span>
      </h2>
    </div>

    <!-- ROOT VIEW: FOLDERS -->
    <div v-if="!selectedCategory" class="folder-grid">
      <div 
        v-for="category in categoriesArray" 
        :key="category" 
        class="folder-item list-view"
        @click="selectCategory(category)"
      >
        <div class="icon-wrapper">
          <div class="i-ri-folder-3-line text-2xl text-[var(--vp-c-text-1)]"></div>
        </div>
        <div class="folder-details">
          <div class="folder-name">{{ category }}</div>
          <div class="folder-meta">{{ categoriesMap.get(category)?.length }} items</div>
        </div>
        <div class="i-ri-arrow-right-s-line ml-auto text-gray-500"></div>
      </div>
      
      <!-- Empty State -->
      <div v-if="categoriesArray.length === 0" class="empty-state">
        <span class="i-ri-folder-unknow-line text-4xl mb-2"></span>
        No categories found.
      </div>
    </div>

    <!-- FOLDER VIEW: FILES -->
    <div v-else class="file-list-view">
      <div class="file-item back-button" @click="selectedCategory = null">
        <div class="i-ri-arrow-go-back-line text-2xl text-[var(--vp-c-text-1)]"></div>
        <span class="filename">..</span>
      </div>

      <div 
        v-for="post in filteredPosts" 
        :key="post.regularPath" 
        class="file-item"
        @click="navigateToPost(post.regularPath)"
      >
        <div class="i-ri-file-text-line text-2xl text-[var(--vp-c-text-1)]"></div>
        <div class="file-info">
          <span class="filename">{{ post.data.title }}</span>
          <span class="filemeta">{{ formatDate(post.data.date) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCategories } from "../utils/categories";
import { useData, withBase, useRouter } from "vitepress";
import { ref, computed } from "vue";
import { Post } from "../types";
import dayjs from "dayjs";

const { theme } = useData();
const router = useRouter();
const categoriesMap = getCategories(theme.value.posts);
const categoriesArray = Array.from(categoriesMap.keys());
const selectedCategory = ref<string | null>(null);

const filteredPosts = computed(() => {
  if (!selectedCategory.value) return [];
  return categoriesMap.get(selectedCategory.value) || [];
});

function selectCategory(category: string) {
  selectedCategory.value = category;
}

function navigateToPost(path: string) {
  router.go(withBase(path));
}

function formatDate(date: string) {
  return dayjs(date).format("MMM D, YYYY");
}
</script>

<style lang="css" scoped>
.file-browser {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: monospace, ui-monospace, SFMono-Regular; /* Terminal vibe */
  min-height: 50vh;
}

.browser-header {
  border-bottom: 2px solid var(--vp-c-divider);
  padding-bottom: 1rem;
  margin-bottom: 2rem;
}

.path {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  margin: 0;
  color: var(--vp-c-text-1);
}

.path-segment {
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
}

.path-segment:hover {
  background-color: var(--vp-c-bg-soft);
}

/* FOLDER LIST */
.folder-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.folder-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: left;
  cursor: pointer;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  background-color: transparent;
  border: 1px solid transparent;
  transition: all 0.2s;
  gap: 1rem;
}

.folder-item:hover {
  background-color: var(--vp-c-bg-soft);
  border-color: var(--vp-c-divider);
}

.folder-details {
  display: flex;
  flex-direction: column;
}

.folder-name {
  margin-top: 0;
  font-weight: 500;
  font-size: 1rem;
}

.folder-meta {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  margin-top: 0;
}

/* FILE LIST */
.file-list-view {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  border: 1px solid transparent;
}

.file-item:hover {
  background-color: var(--vp-c-bg-soft);
  border-color: var(--vp-c-divider);
}

.file-item .icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.file-info {
  display: flex;
  flex-direction: column;
}

.file-item.back-button .icon {
  color: var(--vp-c-brand-1);
}

.filemeta {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}

.empty-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--vp-c-text-2);
  padding: 3rem;
}
</style>
