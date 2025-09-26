<template>
  <article class="rounded-3xl border border-white/10 bg-white/5 p-6">
    <div class="h-5 w-32 animate-pulse rounded-full bg-slate-800/70" />
    <div class="mt-4 h-8 w-48 animate-pulse rounded-full bg-slate-800/70" />
    <div class="mt-6 space-y-3">
      <div v-for="i in 3" :key="i" class="h-14 animate-pulse rounded-2xl bg-slate-800/70" />
    </div>
  </article>
</template>
