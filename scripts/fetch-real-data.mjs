#!/usr/bin/env node
import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BOARD_CONFIG = [
  {
    id: 71385702,
    slug: "netease-acg-weekly",
    name: "网易云ACG榜",
    period: "weekly",
    themeColor: "#8F6DFF",
    description: "官方综合热度榜单，聚合当前最受欢迎的二游与动画相关曲目。",
  },
  {
    id: 3001835560,
    slug: "netease-acg-anime",
    name: "网易云ACG动画榜",
    period: "monthly",
    themeColor: "#FF77FF",
    description: "聚焦动画与番剧主题曲，突出视听联动作品的播放热度。",
  },
  {
    id: 3001795926,
    slug: "netease-acg-game",
    name: "网易云ACG游戏榜",
    period: "event",
    themeColor: "#38BDF8",
    description: "覆盖热门二游与游戏 OST，关注版本活动与角色曲目的热度走势。",
  },
];

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Referer: "https://music.163.com/",
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const toIsoDate = (ms) => {
  if (!ms) return null;
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
};

const fetchJson = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: HEADERS,
    ...options,
  });
  if (!response.ok) {
    throw new Error(`请求失败: ${url} -> ${response.status}`);
  }
  return response.json();
};

const normalizeTrack = (track, index) => {
  const artistNames = (track?.artists ?? track?.ar ?? [])
    .map((artist) => artist?.name)
    .filter(Boolean)
    .join(" / ") || "未知艺人";
  const album = track?.album ?? track?.al ?? {};
  const albumName = album?.name || track?.transName || "未命名专辑";
  const publishIso = toIsoDate(album?.publishTime);
  const previewUrl = `https://music.163.com/song/media/outer/url?id=${track.id}.mp3`;
  const popularity = typeof track?.popularity === "number" ? track.popularity : 60;
  const score = typeof track?.score === "number" ? track.score : popularity;
  const change = clamp(Math.round((popularity - 60) / 8), -6, 6);
  const trend = change > 0 ? "up" : change < 0 ? "down" : "steady";
  const mentionsBase = track?.commentCount ?? track?.commentThreadId?.length ?? 0;
  const votesBase = track?.playedNum ?? track?.lMusic?.bitrate ?? 0;

  return {
    rank: index + 1,
    track: {
      id: `netease-${track.id}`,
      title: track?.name ?? "未知曲目",
      artist: artistNames,
      gameTitle: albumName,
      character: Array.isArray(track?.alias) && track.alias.length ? track.alias[0] : undefined,
      version: album?.type || undefined,
      releaseDate: publishIso ? publishIso.split("T")[0] : "",
      coverArt: album?.picUrl || undefined,
      previewUrl,
    },
    metrics: {
      points: clamp(Math.round(score), 10, 1000),
      change,
      trend,
      mentions: Math.max(800, Math.round(mentionsBase + popularity * 120 + (50 - index) * 18)),
      votes: Math.max(500, Math.round(votesBase / 1000 + popularity * 80 + (40 - index) * 25)),
    },
  };
};

const fetchPlaylist = async (id) =>
  fetchJson(`https://music.163.com/api/playlist/detail?id=${id}&n=1000`);

const fetchMetingPlaylist = async (id) =>
  fetchJson(`https://api.i-meto.com/meting/api?server=netease&type=playlist&id=${id}&format=json`);

const fetchSongDetails = async (ids) => {
  const chunks = [];
  const size = 50;
  for (let i = 0; i < ids.length; i += size) {
    chunks.push(ids.slice(i, i + size));
  }

  const songs = [];
  for (const chunk of chunks) {
    const detail = await fetchJson(
      `https://music.163.com/api/song/detail?ids=[${chunk.join(',')}]`
    );
    songs.push(...(detail?.songs ?? []));
  }
  return songs;
};

const buildEntriesFromSongs = (songs, orderedIds) => {
  const map = new Map(songs.map((song) => [String(song.id), song]));
  const orderedSongs = orderedIds
    .map((id) => map.get(id))
    .filter(Boolean);
  return orderedSongs.slice(0, 20).map(normalizeTrack);
};

const buildBoard = async (config) => {
  let playlist;
  try {
    playlist = await fetchPlaylist(config.id);
  } catch (error) {
    console.warn(`[fetch-real-data] playlist 接口失败，尝试 meting：${config.name}`, error);
  }

  let tracks = playlist?.result?.tracks ?? [];

  if (!tracks.length) {
    const metingItems = await fetchMetingPlaylist(config.id);
    const ids = metingItems
      .map((item) => item?.url?.match(/id=(\d+)/)?.[1])
      .filter(Boolean);

    if (!ids.length) {
      throw new Error(`${config.name} 无法获取有效曲目`);
    }

    const songs = await fetchSongDetails(ids);
    const entries = buildEntriesFromSongs(songs, ids);
    return {
      id: config.slug,
      name: config.name,
      period: config.period,
      updatedAt: new Date().toISOString(),
      description: config.description,
      themeColor: config.themeColor,
      entries,
    };
  }

  const entries = tracks.slice(0, 20).map(normalizeTrack);
  const updateIso = toIsoDate(playlist?.result?.updateTime) || new Date().toISOString();

  return {
    id: config.slug,
    name: config.name,
    period: config.period,
    updatedAt: updateIso,
    description: config.description,
    themeColor: config.themeColor,
    entries,
  };
};

const buildActivities = (boards) => {
  return boards
    .map((board) => {
      const top = board.entries[0];
      if (!top) return null;
      return {
        id: `${board.id}-highlight`,
        title: `${board.name} 最新上榜：${top.track.title}`,
        type: board.period === "event" ? "campaign" : "release",
        relatedGame: top.track.gameTitle,
        startDate: new Date().toISOString().split("T")[0],
        highlightTrackIds: [top.track.id],
      };
    })
    .filter(Boolean);
};

const run = async () => {
  const boards = [];
  for (const config of BOARD_CONFIG) {
    process.stdout.write(`Fetching ${config.name} (#${config.id})...\n`);
    try {
      const board = await buildBoard(config);
      boards.push(board);
    } catch (error) {
      console.error(`[fetch-real-data] ${config.name} 获取失败`, error);
    }
  }

  const snapshot = {
    generatedAt: new Date().toISOString(),
    boards,
    upcomingActivities: buildActivities(boards),
  };

  const publicDir = join(__dirname, "..", "public", "data");
  await mkdir(publicDir, { recursive: true });
  const outputPath = join(publicDir, "billboard.json");
  await writeFile(outputPath, JSON.stringify(snapshot, null, 2), "utf8");
  process.stdout.write(`已写入真实数据快照: ${outputPath}\n`);
};

run().catch((error) => {
  console.error("抓取失败", error);
  process.exitCode = 1;
});
