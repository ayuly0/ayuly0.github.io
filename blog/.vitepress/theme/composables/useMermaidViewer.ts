import { ref } from 'vue';

export const isViewerOpen = ref(false);
export const viewerSvgContent = ref('');

export function openViewer(svg: string) {
  viewerSvgContent.value = svg;
  isViewerOpen.value = true;
}

export function closeViewer() {
  isViewerOpen.value = false;
  viewerSvgContent.value = '';
}
