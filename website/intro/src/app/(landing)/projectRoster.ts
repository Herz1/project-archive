import type { Character } from "@/lib/api";
import projects from "@/data/projects.json";
// Thin data adapter: the original spectrum, lights and motion models stay intact.
export const projectRoster: Character[] = projects.projects.map((p, index) => ({
  id: p.name, name: p.displayName, intro: p.summary, color: p.color,
  idol_id: index + 1, unit: p.category, unit_order: projects.categories.indexOf(p.category),
  avatar_url: null, scsp_avatar_url: null, birthday: "", background_url: null,
  stand: null, short_name: p.displayName, name_zh: p.displayName, name_kana: null, name_romaji: p.name,
  unit_reading: null, greeting: { ja: p.name, subtitle: p.summary, audio_url: null },
  call_opener: null, call_poster_url: null, voxels_url: null,
}));
