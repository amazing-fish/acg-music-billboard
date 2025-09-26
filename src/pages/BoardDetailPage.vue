<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { storeToRefs } from "pinia";
import { useRankingStore } from "../stores/rankingStore";
import RankingBoardEntryFull from "../components/RankingBoardEntryFull.vue";

const route = useRoute();
const boardId = computed(() => route.params.id as string);

const rankingStore = useRankingStore();
const { loading, error } = storeToRefs(rankingStore);

onMounted(() => {
  if (!rankingStore.snapshot) {
    void rankingStore.loadSnapshot();
  }
});

const board = computed(() => (boardId.value ? rankingStore.boardById(boardId.value) : undefined));

const lastUpdated = computed(() => {
  const updatedAt = board.value?.updatedAt;
  if (!updatedAt) return "";
  return new Date(updatedAt).toLocaleString("zh-CN", { hour12: false });
});

const boardStats = computed(() => {
  if (!board.value) {
    return { totalMentions: 0, totalVotes: 0, avgPoints: 0, trendUp: 0 };
  }
  const totals = board.value.entries.reduce(
    (acc, entry) => {
      acc.totalMentions += entry.metrics.mentions;
      acc.totalVotes += entry.metrics.votes;
      acc.avgPoints += entry.metrics.points;
      if (entry.metrics.trend === "up") acc.trendUp += 1;
      return acc;
    },
    { totalMentions: 0, totalVotes: 0, avgPoints: 0, trendUp: 0 }
  );
  totals.avgPoints = Math.round(totals.avgPoints / board.value.entries.length);
  return totals;
});

const championEntry = computed(() => board.value?.entries[0]);
</script>

<template>
  <section class="flex flex-col gap-8">
    <div class="flex items-center justify-between gap-4">
      <RouterLink
        to="/"
        class="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300 transition hover:border-primary/50 hover:text-primary"
      >
        ← 返回首页
      </RouterLink>
      <p class="text-xs text-slate-500">当前查看：{{ boardId }}</p>
    </div>

    <section v-if="error" class="rounded-2xl border border-red-500/60 bg-red-500/10 p-6 text-sm text-red-200">
      {{ error }}
    </section>

    <section v-else-if="loading || !board" class="space-y-3">
      <div class="h-10 w-52 animate-pulse rounded-full bg-slate-800/70" />
      <div class="h-24 animate-pulse rounded-3xl bg-slate-800/60" />
      <div class="space-y-2">
        <div v-for="i in 5" :key="i" class="h-16 animate-pulse rounded-2xl bg-slate-800/70" />
      </div>
    </section>

    <section v-else class="space-y-8">
      <header class="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-6">
        <p class="text-xs uppercase tracking-[0.3em] text-slate-400">{{ board.period }}</p>
        <h1 class="text-3xl font-semibold text-primary">{{ board.name }}</h1>
        <p class="text-sm text-slate-300">{{ board.description }}</p>
        <p v-if="lastUpdated" class="text-xs text-slate-500">上次刷新：{{ lastUpdated }}</p>
      </header>

      <section v-if="championEntry" class="rounded-3xl border border-primary/40 bg-primary/10 p-6 shadow-lg shadow-primary/10">
        <p class="text-xs uppercase tracking-[0.35em] text-primary">冠军单曲</p>
        <h2 class="mt-2 text-2xl font-bold text-slate-100">{{ championEntry.track.title }}</h2>
        <p class="text-sm text-slate-200">
          {{ championEntry.track.gameTitle }}
          <template v-if="championEntry.track.character"> · {{ championEntry.track.character }}</template>
        </p>
        <dl class="mt-4 grid gap-3 text-xs text-slate-200 md:grid-cols-3">
          <div class="flex flex-col rounded-2xl border border-white/15 bg-slate-950/60 px-3 py-2">
            <dt class="uppercase tracking-[0.25em] text-slate-500">热度指数</dt>
            <dd class="text-lg font-semibold text-primary">{{ championEntry.metrics.points }}</dd>
          </div>
          <div class="flex flex-col rounded-2xl border border-white/15 bg-slate-950/60 px-3 py-2">
            <dt class="uppercase tracking-[0.25em] text-slate-500">玩家票数</dt>
            <dd class="text-lg font-semibold">{{ championEntry.metrics.votes.toLocaleString('zh-CN') }}</dd>
          </div>
          <div class="flex flex-col rounded-2xl border border-white/15 bg-slate-950/60 px-3 py-2">
            <dt class="uppercase tracking-[0.25em] text-slate-500">社群热议</dt>
            <dd class="text-lg font-semibold">{{ championEntry.metrics.mentions.toLocaleString('zh-CN') }}</dd>
          </div>
        </dl>
      </section>

      <section class="grid gap-4 md:grid-cols-3">
        <article class="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
          <p class="text-xs uppercase tracking-[0.25em] text-slate-500">总 Mentions</p>
          <p class="mt-2 text-2xl font-semibold text-slate-100">{{ boardStats.totalMentions.toLocaleString('zh-CN') }}</p>
          <p class="mt-1 text-xs text-slate-500">榜单内所有曲目社群提及总量</p>
        </article>
        <article class="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
          <p class="text-xs uppercase tracking-[0.25em] text-slate-500">总 Votes</p>
          <p class="mt-2 text-2xl font-semibold text-slate-100">{{ boardStats.totalVotes.toLocaleString('zh-CN') }}</p>
          <p class="mt-1 text-xs text-slate-500">统计投票与试听互动的总体热度</p>
        </article>
        <article class="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
          <p class="text-xs uppercase tracking-[0.25em] text-slate-500">平均热度指数</p>
          <p class="mt-2 text-2xl font-semibold text-slate-100">{{ boardStats.avgPoints }}</p>
          <p class="mt-1 text-xs text-slate-500">{{ boardStats.trendUp }} 首曲目热度上升</p>
        </article>
      </section>

      <ul class="space-y-4">
        <RankingBoardEntryFull
          v-for="entry in board.entries"
          :key="entry.track.id"
          :entry="entry"
          :highlight="entry.rank === 1"
        />
      </ul>
    </section>
  </section>
</template>
