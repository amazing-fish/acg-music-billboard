<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRankingStore, type BoardFilter } from '../stores/rankingStore';
import RankingFilterBar from '../components/RankingFilterBar.vue';
import RankingBoardCard from '../components/RankingBoardCard.vue';
import RankingBoardSkeleton from '../components/RankingBoardSkeleton.vue';
import UpcomingActivityList from '../components/UpcomingActivityList.vue';
import RefreshButton from '../components/RefreshButton.vue';
import DataSourceBadge from '../components/DataSourceBadge.vue';

const rankingStore = useRankingStore();
const {
  filteredBoards,
  periodOptions,
  selectedPeriod,
  upcomingActivities,
  loading,
  error,
  snapshot,
} = storeToRefs(rankingStore);

const isMockMode = computed(() => rankingStore.snapshot === null && rankingStore.error === null);

const generatedAt = computed(() => {
  if (!snapshot.value?.generatedAt) return '';
  return new Date(snapshot.value.generatedAt).toLocaleString('zh-CN', {
    hour12: false,
  });
});

const handleFilterChange = (value: string) => {
  const allowed: BoardFilter[] = ['all', 'weekly', 'monthly', 'event'];
  if (allowed.includes(value as BoardFilter)) {
    rankingStore.setPeriod(value as BoardFilter);
  }
};

const refresh = (force = false) => {
  void rankingStore.loadSnapshot(force);
};

onMounted(() => {
  refresh();
});
</script>

<template>
  <section class="flex flex-col gap-12">
    <header class="flex flex-col gap-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="text-sm uppercase tracking-[0.35em] text-accent">二游节奏榜</p>
          <h1 class="text-4xl font-bold text-primary md:text-5xl">ACG Music Billboard</h1>
        </div>
        <div class="flex items-center gap-2">
          <RefreshButton :loading="loading" @refresh="() => refresh(true)" />
          <DataSourceBadge v-if="!loading && !error" />
        </div>
      </div>
      <p class="max-w-3xl text-base leading-relaxed text-slate-300">
        聚焦二次元手游音乐的榜单站点，持续更新热门主题曲、角色专辑与官方 OST 活动，帮助玩家一站式追踪最新声轨动态。
      </p>
      <p v-if="generatedAt" class="text-sm text-slate-400">
        数据抓取时间：
        <span class="font-medium text-slate-200">{{ generatedAt }}</span>
      </p>
      <p v-if="isMockMode" class="text-xs text-yellow-400">
        当前处于 mock 模式，可通过 `.env.local` 调整 `VITE_USE_MOCK=false` 切换到真实数据。
      </p>
    </header>

    <RankingFilterBar
      :options="periodOptions"
      :selected="selectedPeriod"
      @change="handleFilterChange"
    />

    <section v-if="error" class="rounded-2xl border border-red-500/60 bg-red-500/10 p-6">
      <p class="text-sm font-medium text-red-200">{{ error }}</p>
      <button
        class="mt-4 inline-flex items-center justify-center rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white"
        @click="refresh(true)"
      >
        重试加载
      </button>
    </section>

    <section v-else class="grid gap-6 md:grid-cols-2">
      <template v-if="loading && !filteredBoards.length">
        <RankingBoardSkeleton v-for="n in 2" :key="`placeholder-${n}`" />
      </template>
      <template v-else-if="filteredBoards.length">
        <RankingBoardCard v-for="board in filteredBoards" :key="board.id" :board="board" />
      </template>
      <template v-else>
        <article class="md:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-sm text-slate-400">
          当前筛选暂无榜单，敬请期待后续更新。
        </article>
      </template>
    </section>

    <UpcomingActivityList :activities="upcomingActivities" />
  </section>
</template>
