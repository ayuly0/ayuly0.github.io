<template>
  <li class="blog-post">
    <a :href="regularPath">
      <div v-if="image" class="blog-post-image">
        <img :src="image" :alt="title" />
      </div>
      <div class="blog-post-content">
        <div class="blog-post-header">
          <div class="blog-post-title">{{ title }}</div>
          <div class="blog-post-date">{{ getFormattedDate(date) }}</div>
        </div>
        <div v-if="description" class="blog-post-description">
          {{ description }}
        </div>
        <div v-if="tags && tags.length" class="blog-post-tags">
          <span v-for="tag in tags" :key="tag" class="blog-post-tag">#{{ tag }}</span>
        </div>
      </div>
    </a>
  </li>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

interface Props {
  regularPath: string;
  title: string;
  date: string;
  image?: string;
  description?: string;
  tags?: string[];
}

defineProps<Props>();

function getFormattedDate(date: string) {
  return dayjs(date).format("MMM D, YYYY");
}
</script>

<style lang="css" scoped>
.blog-post {
  width: 100%;
  border-radius: 8px;
  transition: background-color 0.25s;
}

.blog-post:hover {
  background-color: var(--vp-c-bg-soft);
}

.blog-post a {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  padding: 1rem;
  text-decoration: none;
  color: var(--vp-c-text-1);
}

.blog-post-image {
  flex-shrink: 0;
  width: 120px;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
  margin-top: 4px; 
}

.blog-post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.blog-post-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 0.5rem;
}

.blog-post-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.blog-post-title {
  font-weight: 600;
  font-size: 1.1rem;
  line-height: 1.3;
}

.blog-post-date {
  color: var(--vp-c-text-2);
  font-size: 0.85em;
  white-space: nowrap;
}

.blog-post-description {
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.blog-post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.blog-post-tag {
  font-size: 0.75rem;
  color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg-soft);
  padding: 2px 6px;
  border-radius: 4px;
}

@media (max-width: 640px) {
  .blog-post a {
    flex-direction: column;
    gap: 1rem;
  }
  
  .blog-post-image {
    width: 100%;
    height: 160px;
  }

  .blog-post-header {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>
