<script setup lang="ts">
import { computed } from 'vue'
import { data as linkData } from '../../data/link-metadata.data'

const props = defineProps<{
  url: string
  title?: string
  description?: string
  icon?: string
}>()

const metadata = computed(() => {
  // If manual props are provided, prioritize them
  if (props.title) {
    return {
      title: props.title,
      description: props.description,
      icon: props.icon,
      url: props.url
    }
  }
  // Otherwise, fallback to the auto-fetched data
  return linkData[props.url] || { url: props.url, title: props.url }
})

const displayDomain = computed(() => {
  try {
    return new URL(props.url).hostname
  } catch {
    return ''
  }
})
</script>

<template>
  <div class="my-4 border rounded-[var(--vp-radius)] w-full h-auto border-[var(--vp-c-divider)] bg-[var(--vp-c-bg-soft)] overflow-hidden transition-all hover:border-[var(--vp-c-brand-1)]">
    <a :href="url" target="_blank" rel="noopener noreferrer" class="flex items-center p-4 gap-4 group no-underline">
      <!-- Icon/Image -->
      <div v-if="metadata.icon || metadata.image" class="flex-shrink-0">
        <img 
          :src="metadata.icon || metadata.image" 
          alt="" 
          class="w-10 h-10 object-contain rounded-sm"
          @error="$event.target.style.display='none'"
        />
      </div>
      
      <!-- Content -->
      <div class="flex-grow min-w-0 flex flex-col gap-1">
        <span class="font-medium text-[var(--vp-c-text-1)] truncate group-hover:text-[var(--vp-c-brand-1)] transition-colors">
          {{ metadata.title }}
        </span>
        <span v-if="metadata.description" class="text-sm text-[var(--vp-c-text-2)] line-clamp-2 leading-snug">
          {{ metadata.description }}
        </span>
        <span v-else class="text-xs text-[var(--vp-c-text-3)]">
          {{ displayDomain }}
        </span>
      </div>

      <!-- Arrow Icon -->
      <div class="text-[var(--vp-c-text-3)] group-hover:text-[var(--vp-c-brand-1)] transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </div>
    </a>
  </div>
</template>

<style scoped>
.no-underline {
  text-decoration: none !important;
}
</style>
