<template>
  <ul class="post-tags">
    <li class="post-tag" v-for="tag in page.frontmatter.tags" :key="tag">
      <a :href="`/tags?tag=${tag}`">{{ tag }}</a>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useData } from "vitepress";
const { page } = useData();
</script>

<style lang="css" scoped>
.post-tags {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.post-tag a {
  display: inline-block;
  padding: 0.125rem 0.625rem;
  border-radius: 10px;
  font-size: 0.75rem;
  line-height: 1rem;
  color: white;
  background-color: var(--vp-c-brand-3);
  text-decoration: none;
  transition: background-color 0.2s;
}

.post-tag a:hover {
  background-color: var(--vp-c-brand-1);
}
</style>
