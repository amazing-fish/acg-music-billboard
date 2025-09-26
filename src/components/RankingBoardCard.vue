<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
type RankingBoard = import('../types/music').RankingBoard;
type RankingPeriod = import('../types/music').RankingPeriod;
import RankingBoardEntry from './RankingBoardEntry.vue';

interface Props {
  board: RankingBoard;
  showSource?: boolean;
}

const props = defineProps<Props>();

const periodLabelMap: Record<RankingPeriod, string> = {
  weekly: '周榜',
  monthly: '月榜',
  event: '活动榜',
};

const periodLabel = computed(() => periodLabelMap[props.board.period] ?? props.board.period);
const formattedUpdatedAt = computed(() => {
  if (!props.board.updatedAt) return '';
  return new Date(props.board.updatedAt).toLocaleString('zh-CN', { hour12: false });
});
</script>

<template>
  <article
    class="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur transition hover:-translate-y-1 hover:border-primary/60 hover:shadow-primary/40"
    :style="{ borderColor: props.board.themeColor ?? 'rgba(148, 163, 184, 0.35)' }"
  >
    <div class="flex flex-col gap-4">
      <header class="flex flex-col gap-2">
        <p class="text-xs uppercase tracking-[0.3em] text-slate-400">{{ periodLabel }}</p>
        <h2 class="text-xl font-semibold text-slate-100">{{ props.board.name }}</h2>
        <p class="text-sm text-slate-300">{{ props.board.description }}</p>
        <p v-if="formattedUpdatedAt" class="text-xs text-slate-500">更新时间：{{ formattedUpdatedAt }}</p>
      </header>
      <ul class="space-y-3">
        <RankingBoardEntry
          v-for="entry in props.board.entries.slice(0, 3)"
          :key="entry.track.id"
          :entry="entry"
        />
      </ul>
    </div>
    <RouterLink
      :to="{ name: 'board-detail', params: { id: props.board.id } }"
      class="mt-6 inline-flex items-center justify-center rounded-full border border-primary/50 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/20"
    >
      查看完整榜单
    </RouterLink>
  </article>
</template>
