<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{ loading: boolean }>();
const emit = defineEmits<{ refresh: [] }>();

const isAnimating = ref(false);

const trigger = () => {
  if (props.loading) return;
  emit('refresh');
  isAnimating.value = true;
  setTimeout(() => {
    isAnimating.value = false;
  }, 1200);
};
</script>

<template>
  <button
    type="button"
    class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 transition hover:-translate-y-0.5 hover:border-primary/60 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
    :disabled="loading"
    @click="trigger"
  >
    <svg
      class="h-3 w-3"
      :class="[loading || isAnimating ? 'animate-spin text-primary' : 'text-slate-400']"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      viewBox="0 0 24 24"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582M20 20v-5h-.581m.581 5a9 9 0 0 1-16-5m16 5a9 9 0 0 0-16-5" />
    </svg>
    <span>{{ loading ? '刷新中…' : '刷新榜单' }}</span>
  </button>
</template>
