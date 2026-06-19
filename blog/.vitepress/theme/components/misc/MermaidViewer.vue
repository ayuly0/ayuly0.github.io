<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isViewerOpen" class="mermaid-viewer-overlay" @click.self="closeViewer">
        <div class="viewer-toolbar">
          <button @click="resetZoom" class="toolbar-btn" title="Reset Zoom">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          </button>
          <button @click="closeViewer" class="toolbar-btn close-btn" title="Close">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <div class="viewer-canvas-container" ref="canvasContainer" @click.self="closeViewer">
          <div class="viewer-canvas" ref="canvas" v-html="viewerSvgContent"></div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onUnmounted } from 'vue';
import { isViewerOpen, viewerSvgContent, closeViewer } from '../../composables/useMermaidViewer';
import Panzoom, { PanzoomObject } from '@panzoom/panzoom';
import { onKeyStroke } from '@vueuse/core';

const canvasContainer = ref<HTMLElement | null>(null);
const canvas = ref<HTMLElement | null>(null);
let panzoomInstance: PanzoomObject | null = null;

onKeyStroke('Escape', (e) => {
  if (isViewerOpen.value) {
    e.preventDefault();
    closeViewer();
  }
});

watch(isViewerOpen, async (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
    await nextTick();
    
    if (canvas.value && canvasContainer.value) {
      panzoomInstance = Panzoom(canvas.value, {
        maxScale: 10,
        minScale: 0.1,
        step: 0.5
      });
      
      canvasContainer.value.addEventListener('wheel', panzoomInstance.zoomWithWheel, { passive: false });
    }
  } else {
    document.body.style.overflow = '';
    if (panzoomInstance) {
      panzoomInstance.destroy();
      panzoomInstance = null;
    }
  }
});

onUnmounted(() => {
  document.body.style.overflow = '';
});

const resetZoom = () => {
  if (panzoomInstance) {
    panzoomInstance.reset();
  }
};
</script>

<style scoped>
.mermaid-viewer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 2147483647; /* Highest possible to go over navbars */
  background-color: var(--vp-c-bg); /* Use theme bg so it looks native */
  display: flex;
  flex-direction: column;
}

.viewer-toolbar {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  z-index: 10;
}

.toolbar-btn {
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  width: 44px;
  height: 44px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.toolbar-btn:hover {
  background-color: var(--vp-c-bg-strong);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.viewer-canvas-container {
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
}

.viewer-canvas-container:active {
  cursor: grabbing;
}

.viewer-canvas :deep(svg) {
  /* Prevent SVG from forcing width/height that breaks panzoom */
  width: 100% !important;
  height: 100% !important;
  max-width: 100%;
  max-height: 100%;
}

.viewer-canvas {
  display: flex;
  align-items: center;
  justify-content: center;
  transform-origin: center center;
  width: 80vw;
  height: 80vh;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
