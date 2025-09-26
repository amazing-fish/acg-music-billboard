import type { BillboardSnapshot } from "../types/music";
import { mockBillboardSnapshot } from "../mocks/rankings";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const DATA_ENDPOINT = import.meta.env.VITE_DATA_ENDPOINT ?? "/data/billboard.json";

const parseBooleanFlag = (value: unknown): boolean | undefined => {
  if (value === undefined || value === null) return undefined;
  const normalized = String(value).trim().toLowerCase();
  if (["true", "1", "yes", "y"].includes(normalized)) return true;
  if (["false", "0", "no", "n"].includes(normalized)) return false;
  return undefined;
};

const shouldUseMock = parseBooleanFlag(import.meta.env.VITE_USE_MOCK) ?? false;

const cloneSnapshot = (snapshot: BillboardSnapshot): BillboardSnapshot =>
  JSON.parse(JSON.stringify(snapshot));

const resolveEndpoint = () => {
  if (API_BASE_URL) {
    return `${API_BASE_URL.replace(/\/$/, "")}/billboard/snapshot`;
  }
  return DATA_ENDPOINT;
};

export const fetchBillboardSnapshot = async (): Promise<BillboardSnapshot> => {
  if (shouldUseMock) {
    return cloneSnapshot(mockBillboardSnapshot);
  }

  const endpoint = resolveEndpoint();

  try {
    const response = await fetch(endpoint, {
      headers: { Accept: "application/json" },
      cache: "no-cache",
    });

    if (!response.ok) {
      throw new Error(`请求失败 (${response.status})`);
    }

    const data = (await response.json()) as BillboardSnapshot;
    if (!data?.boards?.length) {
      throw new Error("返回数据为空");
    }

    return data;
  } catch (error) {
    if (!API_BASE_URL) {
      if (import.meta.env.DEV) {
        console.warn("[rankingService] 加载真实数据失败，回退至 mock", error);
      }
      return cloneSnapshot(mockBillboardSnapshot);
    }

    throw new Error(error instanceof Error ? error.message : "未能获取榜单数据");
  }
};
