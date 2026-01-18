<script setup lang="ts">
import { computed } from 'vue'
import { data as fileData } from '../../data/file-metadata.data'

const props = defineProps<{
  file: string // Path relative to public (e.g., "/downloads/myfile.zip")
  name?: string
  size?: string
}>()

const fileName = computed(() => props.name || props.file.split('/').pop() || props.file)

// Auto-lookup size or fallback to prop
const fileSize = computed(() => {
  if (props.size) return props.size
  // Remove leading slash for matching if needed, or keep it. 
  // The loader keys are like "/foo.png" or "foo.png"? Loader adds leading slash.
  return fileData[props.file] || 'Unknown Size'
})
</script>

<template>
  <div class="my-4 border rounded-[var(--vp-radius)] w-full h-auto border-[var(--vp-c-divider)] bg-[var(--vp-c-bg-soft)] overflow-hidden relative group hover:border-[var(--vp-c-brand-1)] transition-all">
    <a :href="file" download class="flex justify-between items-center px-4 py-3 gap-3 no-underline">
      
      <!-- Left: Icon + Size + Name -->
      <div class="flex items-center gap-4">
        <div class="flex flex-col items-center pr-4 border-r border-[var(--vp-c-divider)]">
           <!-- Green Download Icon -->
           <span class="text-[var(--vp-c-brand-1)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" x2="12" y1="15" y2="3"/>
            </svg>
           </span>
           <span class="text-[10px] text-[var(--vp-c-text-2)] font-mono mt-0.5 whitespace-nowrap">
             {{ fileSize }}
           </span>
        </div>
        
        <span class="text-sm font-medium text-[var(--vp-c-text-1)] group-hover:text-[var(--vp-c-brand-1)] transition-colors">
          {{ fileName }}
        </span>
      </div>

    </a>
  </div>
</template>

<style scoped>
.no-underline {
  text-decoration: none !important;
}
</style>
