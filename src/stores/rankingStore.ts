import { defineStore } from "pinia";
import type { BillboardSnapshot, RankingBoard, RankingPeriod } from "../types/music";
import { fetchBillboardSnapshot } from "../services/rankingService";

export type BoardFilter = "all" | RankingPeriod;

interface RankingState {
  snapshot: BillboardSnapshot | null;
  loading: boolean;
  error: string | null;
  selectedPeriod: BoardFilter;
}

export const useRankingStore = defineStore("ranking", {
  state: (): RankingState => ({
    snapshot: null,
    loading: false,
    error: null,
    selectedPeriod: "all",
  }),
  getters: {
    boards: (state): RankingBoard[] => state.snapshot?.boards ?? [],
    filteredBoards(): RankingBoard[] {
      if (this.selectedPeriod === "all") return this.boards;
      return this.boards.filter((board) => board.period === this.selectedPeriod);
    },
    periodOptions(): Array<{ value: BoardFilter; label: string }> {
      return [
        { value: "all", label: "全部榜单" },
        { value: "weekly", label: "周榜" },
        { value: "monthly", label: "月榜" },
        { value: "event", label: "活动榜" },
      ];
    },
    upcomingActivities: (state) => state.snapshot?.upcomingActivities ?? [],
    boardById: (state) => (id: string): RankingBoard | undefined =>
      state.snapshot?.boards.find((board) => board.id === id),
  },
  actions: {
    async loadSnapshot(force = false) {
      if (this.loading) return;
      if (this.snapshot && !force) return;

      this.loading = true;
      this.error = null;
      try {
        this.snapshot = await fetchBillboardSnapshot();
      } catch (error) {
        this.error = error instanceof Error ? error.message : "未知错误";
        this.snapshot = null;
      } finally {
        this.loading = false;
      }
    },
    setPeriod(period: BoardFilter) {
      this.selectedPeriod = period;
    },
  },
});
