<script setup lang="ts">
import { computed } from 'vue';
import type { RankingEntry } from '../types/music';

interface Props {
  entry: RankingEntry;
  highlight?: boolean;
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
  <li
    class="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/60 p-5 transition"
    :class="highlight ? 'border-primary/60 bg-primary/10 shadow-lg shadow-primary/10' : ''"
  >
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p class="text-xs uppercase tracking-[0.3em] text-slate-400">第 {{ entry.rank }} 名</p>
        <h3 class="mt-1 text-lg font-semibold text-slate-100">{{ entry.track.title }}</h3>
        <p class="text-sm text-slate-300">
          {{ entry.track.gameTitle }}
          <template v-if="entry.track.character"> · {{ entry.track.character }}</template>
        </p>
      </div>
      <div class="text-right text-sm text-slate-300">
        <p class="font-semibold text-slate-100">热度 {{ entry.metrics.points }}</p>
        <p :class="trendClass">{{ trendSymbol }} {{ entry.metrics.change }}</p>
      </div>
    </div>
    <dl class="grid gap-4 text-xs text-slate-300 md:grid-cols-3">
      <div class="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-2">
        <dt class="uppercase tracking-[0.2em] text-slate-500">Mentions</dt>
        <dd class="font-semibold text-slate-100">{{ entry.metrics.mentions.toLocaleString('zh-CN') }}</dd>
      </div>
      <div class="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-2">
        <dt class="uppercase tracking-[0.2em] text-slate-500">Votes</dt>
        <dd class="font-semibold text-slate-100">{{ entry.metrics.votes.toLocaleString('zh-CN') }}</dd>
      </div>
      <div class="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-2">
        <dt class="uppercase tracking-[0.2em] text-slate-500">Release</dt>
        <dd class="font-medium text-slate-200">
          {{ entry.track.releaseDate ? new Date(entry.track.releaseDate).toLocaleDateString('zh-CN') : '待补充' }}
        </dd>
      </div>
    </dl>
  </li>
</template>
