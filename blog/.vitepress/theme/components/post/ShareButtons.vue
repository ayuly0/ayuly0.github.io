<template>
  <div class="share-buttons">
    <span class="share-label">Share:</span>
    
    <button @click="copyLink" class="share-btn copy" title="Copy Link">
      <div class="i-ri-link"></div>
    </button>
    
    <a :href="twitterUrl" target="_blank" rel="noopener noreferrer" class="share-btn twitter" title="Share on X">
      <div class="i-ri-twitter-x-fill"></div>
    </a>
    
    <a :href="linkedinUrl" target="_blank" rel="noopener noreferrer" class="share-btn linkedin" title="Share on LinkedIn">
      <div class="i-ri-linkedin-fill"></div>
    </a>

    <a :href="facebookUrl" target="_blank" rel="noopener noreferrer" class="share-btn facebook" title="Share on Facebook">
      <div class="i-ri-facebook-fill"></div>
    </a>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';

const { page } = useData();

const currentUrl = computed(() => {
  if (typeof window !== 'undefined') {
    return window.location.href;
  }
  return '';
});

const title = computed(() => page.value.title);

const twitterUrl = computed(() => 
  `https://twitter.com/intent/tweet?text=${encodeURIComponent(title.value)}&url=${encodeURIComponent(currentUrl.value)}`
);

const linkedinUrl = computed(() => 
  `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl.value)}`
);

const facebookUrl = computed(() => 
  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl.value)}`
);

function copyLink() {
  navigator.clipboard.writeText(currentUrl.value).then(() => {
    alert('Link copied to clipboard!');
  });
}
</script>

<style scoped>
.share-buttons {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
}

.share-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.share-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  transition: all 0.2s;
  cursor: pointer;
  border: none;
  text-decoration: none; /* For <a> tags */
  font-size: 1.1rem;
}

.share-btn:hover {
  background-color: var(--vp-c-brand-3);
  color: white;
  transform: translateY(-2px);
}

.share-btn.copy:hover { background-color: var(--vp-c-gray-1); }
.share-btn.twitter:hover { background-color: #000; }
.share-btn.linkedin:hover { background-color: #0077b5; }
.share-btn.facebook:hover { background-color: #1877f2; }
</style>
