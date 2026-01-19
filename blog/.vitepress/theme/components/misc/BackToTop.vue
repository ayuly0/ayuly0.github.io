<template>
  <transition name="fade">
    <button
      v-if="show"
      class="back-to-top"
      @click="scrollToTop"
      aria-label="Back to top"
    >
      <div class="i-ri-arrow-up-line text-xl"></div>
    </button>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const show = ref(false)
const threshold = 300
let lastScrollY = 0

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function checkScroll() {
  const currentScrollY = window.scrollY
  const isScrollingUp = currentScrollY < lastScrollY
  const isAtTop = currentScrollY < threshold
  // Check if close to bottom (within 50px)
  const isAtBottom = (window.innerHeight + currentScrollY) >= (document.documentElement.scrollHeight - 50)

  if (isAtTop || isAtBottom) {
    show.value = false
  } else {
    // Show only if scrolling up
    show.value = isScrollingUp
  }

  lastScrollY = currentScrollY
}

onMounted(() => {
  window.addEventListener('scroll', checkScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
})
</script>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: var(--vp-c-brand-3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: none;
  z-index: 100;
  transition: all 0.3s ease;
}

.back-to-top:hover {
  background-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
