/**
 * ectoTraitsHelper.ts
 *
 * Provides lookup functions for EctoSkeleton token traits and image URLs,
 * sourced directly from src/constants/ectoskeletonsTraits.json.
 *
 * Trait values are normalised by matching case-insensitively against
 * src/components/Marketplace/constants/ectoSkeletonsFilters.ts so that
 * every value returned exactly matches what the sidebar filter checkboxes emit.
 *
 * The lookup map is built once at module load; subsequent calls are O(1).
 *
 * Image URLs use the public Pinata gateway — the branded gateway
 * (spookyskeletons.mypinata.cloud) stored in the JSON is defunct.
 */

import ectoSkeletonsFilters from "../components/Marketplace/constants/ectoSkeletonsFilters";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const traitsJson = require("../constants/ectoskeletonsTraits.json") as TraitsData;

const PUBLIC_PINATA = "https://gateway.pinata.cloud/ipfs/";

// ── Types ────────────────────────────────────────────────────────────────────

interface TraitsData {
  /** e.g. ["Body","Eyes","Mouth","Hat","Top","Item","Background"] */
  traitTypes: string[];
  /** Parallel array of possible values per trait type */
  traitValues: string[][];
  imageBaseUrl: string;
  /**
   * Sorted by rarity (rarest first).
   * Each entry: [tokenId, name, imageUrl, traitIndices]
   * The image URL uses the branded Pinata subdomain; we swap it to the public gateway.
   */
  tokens: Array<[number, string, string, number[]]>;
  missingMetadata: number[];
}

// ── Build the lookup map (runs once) ─────────────────────────────────────────

const { traitTypes, traitValues, tokens } = traitsJson;

interface TokenData {
  rarityRank: number; // 1 = rarest
  cid: string; // IPFS CID
  indices: number[]; // indices into traitValues
}

const byTokenId = new Map<number, TokenData>();

tokens.forEach((token, position) => {
  const id = token[0];
  const url = token[2];
  // URL format: "https://spookyskeletons.mypinata.cloud/ipfs/<CID>"
  const cid = url.split("/ipfs/")[1] ?? "";
  byTokenId.set(id, { rarityRank: position + 1, cid, indices: token[3] });
});

// Pre-index filter values by lower-case key for fast normalisation
const filtersByType: Record<string, Map<string, string>> = {};
const filters = ectoSkeletonsFilters as Record<string, string[]>;
for (const type of Object.keys(filters)) {
  const m = new Map<string, string>();
  for (const v of filters[type]) m.set(v.toLowerCase(), v);
  filtersByType[type] = m;
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns the trait object for a given EctoSkeleton token ID.
 * Keys: Body, Eyes, Mouth, Hat, Top, Item, Background (matching ectoSkeletonsFilters).
 * Values are normalised to the canonical casing used in ectoSkeletonsFilters.
 * Returns an empty object if the token ID is not in the dataset.
 */
export function getEctoTraits(tokenId: number): Record<string, string> {
  const data = byTokenId.get(tokenId);
  if (!data) return {};

  const result: Record<string, string> = {};
  for (let i = 0; i < traitTypes.length; i++) {
    const type = traitTypes[i];
    const raw = traitValues[i]?.[data.indices[i]] ?? "None";
    const lookup = filtersByType[type];
    result[type] = lookup ? (lookup.get(raw.toLowerCase()) ?? raw) : raw;
  }
  return result;
}

/**
 * Returns the public Pinata gateway image URL for a given EctoSkeleton token.
 * Falls back to an empty string if the token ID is not in the dataset.
 */
export function getEctoImageUrl(tokenId: number): string {
  const data = byTokenId.get(tokenId);
  return data?.cid ? `${PUBLIC_PINATA}${data.cid}` : "";
}

/**
 * Returns the rarity rank (1 = rarest) for a given EctoSkeleton token.
 * Falls back to the token ID itself if not found.
 */
export function getEctoRarityRank(tokenId: number): number {
  return byTokenId.get(tokenId)?.rarityRank ?? tokenId;
}

/**
 * Returns true if a token ID exists in the traits dataset.
 */
export function ectoTokenExists(tokenId: number): boolean {
  return byTokenId.has(tokenId);
}
