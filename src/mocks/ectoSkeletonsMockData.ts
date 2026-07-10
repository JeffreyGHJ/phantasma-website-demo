/**
 * ectoSkeletonsMockData.ts
 *
 * 38 EctoSkeleton listings for the demo marketplace.
 *
 * Only token IDs and optional listing details are stored here.
 * Trait data (Body, Eyes, Mouth, Hat, Top, Item, Background) and image URLs
 * are looked up at runtime from src/constants/ectoskeletonsTraits.json via
 * ectoTraitsHelper, which also normalises casing to match the sidebar filters.
 *
 * Collection size: 2500 tokens (IDs 0–2499).
 * To add or swap tokens: edit the `raw` array — IDs only.
 */

import { getEctoTraits, getEctoImageUrl, getEctoRarityRank } from './ectoTraitsHelper';

const ECTO_ADDR = '0x0fA48F20dDdcf6eD724a36381F66c3e905Fe7988';
const LG_MP    = 'littleGhosts';
const PCS_MP   = 'pancakeswap';
const S1 = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
const S2 = '0x8894e0a0c962Cb723C1976A4421c95944Be379d8';
const S3 = '0x1F5b7E9f7f24dEAb2c8C7c5f4EeA7C60B5B5A8f3';
const S4 = '0x3D4b5C6e7F8a9B0C1d2e3F4A5B6C7D8E9F0A1B2c';

function img(id: number) {
  return { image_gif: '', image_png: getEctoImageUrl(id) };
}

type Raw = {
  id: number;
  price?: string;
  marketplace?: string;
  seller?: string;
};

function makeEcto(r: Raw) {
  return {
    address: ECTO_ADDR,
    id: r.id,
    token_id: r.id,
    name: 'EctoSkeletons',
    collection_total: 2500,
    token_image_ext: 'png',
    rankable: 1,
    image_3d: '',
    ...img(r.id),
    rank: getEctoRarityRank(r.id),
    trait_type_value: getEctoTraits(r.id),
    ...(r.price ? { price: r.price, seller: r.seller, marketplace: r.marketplace } : {}),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Token list — add/remove IDs here.  Traits and images are filled in automatically.
// All IDs must be in range 0–2499 (collection size = 2500).
// ─────────────────────────────────────────────────────────────────────────────
const raw: Raw[] = [
  // ── Page 1 ────────────────────────────────────────────────────────────────
  { id:    1, price: '280000000000000000',  marketplace: LG_MP,  seller: S1 },
  { id:    5, price: '160000000000000000',  marketplace: PCS_MP, seller: S2 },
  { id:   10, price: '210000000000000000',  marketplace: LG_MP,  seller: S3 },
  { id:   42, price: '1500000000000000000', marketplace: PCS_MP, seller: S4 },
  { id:   50, price: '420000000000000000',  marketplace: LG_MP,  seller: S1 },
  { id:  100, price: '3200000000000000000', marketplace: PCS_MP, seller: S2 },
  { id:  150, price: '580000000000000000',  marketplace: LG_MP,  seller: S3 },
  { id:  200 },
  { id:  250, price: '2100000000000000000', marketplace: PCS_MP, seller: S4 },
  { id:  300, price: '195000000000000000',  marketplace: LG_MP,  seller: S1 },
  { id:  350, price: '890000000000000000',  marketplace: PCS_MP, seller: S2 },
  { id:  400, price: '340000000000000000',  marketplace: LG_MP,  seller: S3 },
  { id:  500, price: '255000000000000000',  marketplace: PCS_MP, seller: S4 },
  { id:  600, price: '2500000000000000000', marketplace: LG_MP,  seller: S1 },
  { id:  777, price: '750000000000000000',  marketplace: PCS_MP, seller: S2 },
  { id: 1000, price: '1200000000000000000', marketplace: LG_MP,  seller: S3 },
  // ── Page 2 ────────────────────────────────────────────────────────────────
  { id: 1100, price: '310000000000000000',  marketplace: PCS_MP, seller: S4 },
  { id: 1200, price: '185000000000000000',  marketplace: LG_MP,  seller: S1 },
  { id: 1300, price: '1600000000000000000', marketplace: PCS_MP, seller: S2 },
  { id: 1400, price: '220000000000000000',  marketplace: LG_MP,  seller: S3 },
  { id: 1500 },
  { id: 1600, price: '950000000000000000',  marketplace: PCS_MP, seller: S4 },
  { id: 1700, price: '430000000000000000',  marketplace: LG_MP,  seller: S1 },
  { id: 1800, price: '1900000000000000000', marketplace: PCS_MP, seller: S2 },
  { id: 1900, price: '270000000000000000',  marketplace: LG_MP,  seller: S3 },
  { id: 2000, price: '190000000000000000',  marketplace: PCS_MP, seller: S4 },
  { id: 2100, price: '2800000000000000000', marketplace: LG_MP,  seller: S1 },
  { id: 2200, price: '360000000000000000',  marketplace: PCS_MP, seller: S2 },
  { id: 2300, price: '480000000000000000',  marketplace: LG_MP,  seller: S3 },
  { id: 2400, price: '4200000000000000000', marketplace: PCS_MP, seller: S4 },
  // IDs below replace the original 2500–4500 range which exceeded collection size
  { id:  700 },
  { id:  800, price: '670000000000000000',  marketplace: PCS_MP, seller: S2 },
  { id:  900, price: '310000000000000000',  marketplace: LG_MP,  seller: S3 },
  { id: 1050, price: '5000000000000000000', marketplace: PCS_MP, seller: S4 },
  { id: 1150, price: '245000000000000000',  marketplace: LG_MP,  seller: S1 },
  { id: 1250, price: '1300000000000000000', marketplace: PCS_MP, seller: S2 },
  { id: 1350, price: '175000000000000000',  marketplace: LG_MP,  seller: S3 },
  { id: 1450, price: '200000000000000000',  marketplace: PCS_MP, seller: S4 },
];

const ectoSkeletonsMockData = raw.map(makeEcto);
export default ectoSkeletonsMockData;
