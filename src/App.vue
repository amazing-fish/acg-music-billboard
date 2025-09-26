<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <main class="min-h-screen bg-slate-950 text-slate-100">
    <div class="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10">
      <nav class="flex items-center justify-between gap-6 border-b border-white/10 pb-6">
        <RouterLink class="text-lg font-semibold text-primary" to="/">二游节奏榜</RouterLink>
        <div class="flex items-center gap-4 text-sm text-slate-400">
          <RouterLink
            class="rounded-full border border-transparent px-3 py-1 transition hover:border-primary/60 hover:text-primary"
            to="/"
          >首页</RouterLink>
          <span class="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-500">
            榜单详情入口将随真实数据开放
          </span>
        </div>
      </nav>

      <section class="flex-1 py-10">
        <RouterView />
      </section>

      <footer class="border-t border-white/10 py-6 text-xs text-slate-500">
        © {{ new Date().getFullYear() }} 二游节奏榜 · 当前使用 mock 数据进行演示
      </footer>
    </div>
  </main>
</template>
