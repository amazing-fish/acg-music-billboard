<script setup lang="ts">
import { computed } from 'vue';
import type { RankingEntry } from '../types/music';

interface Props {
  entry: RankingEntry;
}

const props = defineProps<Props>();

const trendClass = computed(() => {
  const trend = props.entry.metrics.trend;
  if (trend === 'up') return 'text-emerald-400';
  if (trend === 'down') return 'text-red-400';
  return 'text-slate-400';
});

const trendSymbol = computed(() => {
  const trend = props.entry.metrics.trend;
  if (trend === 'up') return '↑';
  if (trend === 'down') return '↓';
  return '→';
});
</script>

<template>
  <li class="flex items-center justify-between rounded-2xl bg-slate-900/60 px-4 py-3">
    <div class="flex flex-col">
      <span class="text-sm font-semibold text-slate-100">#{{ entry.rank }} · {{ entry.track.title }}</span>
      <span class="text-xs text-slate-400">
        {{ entry.track.gameTitle }}
        <template v-if="entry.track.character"> · {{ entry.track.character }}</template>
      </span>
    </div>
    <div class="text-right text-xs text-slate-400">
      <p class="font-semibold text-slate-200">热度 {{ entry.metrics.points }}</p>
      <p :class="trendClass">{{ trendSymbol }} {{ entry.metrics.change }}</p>
    </div>
  </li>
</template>
