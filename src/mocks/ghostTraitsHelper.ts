/**
 * ghostTraitsHelper.ts
 *
 * Provides a single function — getGhostTraits(tokenId) — that returns the
 * canonical trait object for any LittleGhost token, sourced directly from
 * src/constants/littleghostsTraits.json.
 *
 * Trait value strings are normalised by matching case-insensitively against
 * src/components/Marketplace/constants/littleGhostsFilters.ts, so that every
 * value returned exactly matches what the sidebar filter checkboxes emit.
 *
 * The lookup map is built once at module load; subsequent calls are O(1).
 */

import littleGhostsFilters from "../components/Marketplace/constants/littleGhostsFilters";

// Use require() to avoid TypeScript spending time type-checking a 10 000-entry
// JSON array. The TraitsData interface below describes the shape we need.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const traitsJson = require("../constants/littleghostsTraits.json") as TraitsData;

// ── Types ────────────────────────────────────────────────────────────────────

interface TraitsData {
  /** e.g. ["Background","Body","Eyes","Hat","Item","Mouth","Prop"] */
  traitTypes: string[];
  /** Parallel array of possible values per trait type */
  traitValues: string[][];
  imageBaseUrl: string;
  /**
   * One entry per token: [sortIndex, name, imageFilename, traitIndices]
   * The array is ordered by token ID (tokens[n] has image "little-ghosts-n.png").
   */
  tokens: Array<[string, string, string, number[]]>;
}

// ── Build the lookup map (runs once) ─────────────────────────────────────────

const { traitTypes, traitValues, tokens } = traitsJson;

/** tokenId → array of indices into traitValues */
const indicesByTokenId = new Map<number, number[]>();

for (const token of tokens) {
  const filename = token[2]; // e.g. "little-ghosts-42.png"
  const id = parseInt(filename.replace("little-ghosts-", "").replace(".png", ""), 10);
  if (!Number.isNaN(id)) {
    indicesByTokenId.set(id, token[3]);
  }
}

// Pre-index filter values by lower-case for fast normalisation
const filtersByType: Record<string, Map<string, string>> = {};
const filters = littleGhostsFilters as Record<string, string[]>;
for (const type of Object.keys(filters)) {
  const m = new Map<string, string>();
  for (const v of filters[type]) m.set(v.toLowerCase(), v);
  filtersByType[type] = m;
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns the trait object for a given LittleGhost token ID.
 *
 * Trait keys match the traitTypes array from the JSON
 * ("Background", "Body", "Eyes", "Hat", "Item", "Mouth", "Prop").
 *
 * Each value is normalised to the canonical casing used in littleGhostsFilters
 * so that filter comparisons always work.  If a value has no filter entry the
 * raw JSON string is returned as-is.
 *
 * Returns an empty object if the token ID is not found in the dataset.
 */
export function getGhostTraits(tokenId: number): Record<string, string> {
  const indices = indicesByTokenId.get(tokenId);
  if (!indices) return {};

  const result: Record<string, string> = {};
  for (let i = 0; i < traitTypes.length; i++) {
    const type = traitTypes[i];
    const raw = traitValues[i]?.[indices[i]] ?? "None";
    const lookup = filtersByType[type];
    result[type] = lookup ? (lookup.get(raw.toLowerCase()) ?? raw) : raw;
  }
  return result;
}

/**
 * Returns true if a token ID exists in the traits dataset.
 * Useful for guard-checking before calling getGhostTraits().
 */
export function ghostTokenExists(tokenId: number): boolean {
  return indicesByTokenId.has(tokenId);
}
