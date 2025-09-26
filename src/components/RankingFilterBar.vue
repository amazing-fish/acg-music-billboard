<script setup lang="ts">
interface FilterOption {
  value: string;
  label: string;
}

interface Props {
  options: FilterOption[];
  selected: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  change: [value: string];
}>();

const handleClick = (value: string) => {
  if (value === props.selected) return;
  emit('change', value);
};
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="rounded-full border px-4 py-2 text-sm transition"
      :class="[
        option.value === selected
          ? 'border-primary bg-primary/20 text-primary shadow-sm'
          : 'border-white/10 text-slate-300 hover:border-primary/50 hover:text-primary'
      ]"
      @click="handleClick(option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>
