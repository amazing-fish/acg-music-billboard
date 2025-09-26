import { readFile } from "node:fs/promises";

const content = await readFile(new URL('../public/data/billboard.json', import.meta.url), 'utf8');
const data = JSON.parse(content);
console.log('boards count:', data.boards?.length);
for (const board of data.boards ?? []) {
  console.log(`\n- ${board.name} (${board.period}) entries: ${board.entries?.length}`);
  const top = board.entries?.[0];
  if (top) {
    console.log(`  #1 ${top.track.title} | artist: ${top.track.artist}`);
    console.log(`  release: ${top.track.releaseDate}, points: ${top.metrics.points}`);
  }
}
