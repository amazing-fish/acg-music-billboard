<script setup lang="ts">
import type { ActivitySchedule } from '../types/music';

interface Props {
  activities: ActivitySchedule[];
}

defineProps<Props>();
</script>

<template>
  <section class="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h2 class="text-lg font-semibold text-slate-100">即将到来的音乐活动</h2>
      <span class="text-xs text-slate-400">Mock 数据 · 稍后接入真实接口</span>
    </div>
    <ul class="mt-4 grid gap-4 md:grid-cols-2">
      <li
        v-for="activity in activities"
        :key="activity.id"
        class="rounded-2xl border border-white/10 bg-slate-900/60 p-4"
      >
        <p class="text-xs uppercase tracking-[0.25em] text-accent">{{ activity.type }}</p>
        <h3 class="mt-2 text-lg font-semibold text-slate-100">{{ activity.title }}</h3>
        <p class="text-sm text-slate-400">关联游戏：{{ activity.relatedGame }}</p>
        <p class="text-sm text-slate-300">开始日期：{{ new Date(activity.startDate).toLocaleDateString('zh-CN') }}</p>
      </li>
    </ul>
  </section>
</template>
