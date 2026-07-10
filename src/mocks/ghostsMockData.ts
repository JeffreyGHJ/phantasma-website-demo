/**
 * ghostsMockData.ts
 *
 * 48 LittleGhost listings for the demo marketplace.
 *
 * Only token IDs and optional listing details are stored here.
 * Trait data (Background, Body, Eyes, Mouth, Hat, Prop, Item) is looked up
 * at runtime from src/constants/littleghostsTraits.json via ghostTraitsHelper,
 * which also normalises casing to match the sidebar filters automatically.
 *
 * To add or swap tokens: edit the `raw` array below — IDs only.
 * To change which tokens are listed for sale: add price / marketplace / seller.
 */

import { getGhostTraits } from './ghostTraitsHelper';

const LG_CDN      = 'https://static-nft.pancakeswap.com/mainnet/0x98F606A4cdDE68b9f68732D21fb9bA8B5510eE48';
// Rareboard proxies the official S3 bucket — used as onError fallback in NftImage
const LG_FALLBACK = 'https://image.rareboard.com/api?url=https%3A%2F%2Flittleghosts.s3.us-east-2.amazonaws.com%2Ffinal_images%2F';
const LG_ADDR = '0x98f606a4cdde68b9f68732d21fb9ba8b5510ee48';
const LG_MP   = 'littleGhosts';
const PCS_MP  = 'pancakeswap';
const S1 = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
const S2 = '0x8894e0a0c962Cb723C1976A4421c95944Be379d8';
const S3 = '0x1F5b7E9f7f24dEAb2c8C7c5f4EeA7C60B5B5A8f3';
const S4 = '0x3D4b5C6e7F8a9B0C1d2e3F4A5B6C7D8E9F0A1B2c';

function img(id: number) {
  return {
    image_gif: `${LG_CDN}/little-ghosts-${id}.png`,
    image_png: `${LG_FALLBACK}${id}.png&quality=70&size=400`,
  };
}

type Raw = {
  id: number;
  /** Rarity rank (1 = rarest). Omit to use token ID as a neutral default. */
  rank?: number;
  price?: string;
  marketplace?: string;
  seller?: string;
};

function makeGhost(r: Raw) {
  return {
    address: LG_ADDR,
    id: r.id,
    token_id: r.id,
    name: 'LittleGhosts',
    collection_total: 10000,
    token_image_ext: 'gif',
    rankable: 1,
    image_3d: '',
    ...img(r.id),
    rank: r.rank ?? r.id,
    trait_type_value: getGhostTraits(r.id),
    ...(r.price ? { price: r.price, seller: r.seller, marketplace: r.marketplace } : {}),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Token list — add/remove IDs here.  Traits are filled in automatically.
// ─────────────────────────────────────────────────────────────────────────────
const raw: Raw[] = [
  // ── Page 1 ────────────────────────────────────────────────────────────────
  { id:    1, rank:  892, price: '180000000000000000',  marketplace: LG_MP,  seller: S1 },
  { id:    5, rank: 3821, price: '250000000000000000',  marketplace: PCS_MP, seller: S2 },
  { id:   10, rank: 5103, price: '320000000000000000',  marketplace: LG_MP,  seller: S3 },
  { id:   20, rank: 4467, price: '500000000000000000',  marketplace: LG_MP,  seller: S1 },
  { id:   42, rank: 2945, price: '150000000000000000',  marketplace: PCS_MP, seller: S4 },
  { id:   50, rank: 6234, price: '850000000000000000',  marketplace: LG_MP,  seller: S2 },
  { id:   75, rank: 1877, price: '420000000000000000',  marketplace: PCS_MP, seller: S3 },
  { id:  100, rank: 3612 },
  { id:  150, rank: 7088, price: '1200000000000000000', marketplace: LG_MP,  seller: S1 },
  { id:  200, rank: 2103, price: '290000000000000000',  marketplace: PCS_MP, seller: S2 },
  { id:  250, rank: 5560, price: '380000000000000000',  marketplace: LG_MP,  seller: S4 },
  { id:  300, rank: 4892, price: '460000000000000000',  marketplace: PCS_MP, seller: S1 },
  { id:  350, rank: 3244, price: '1500000000000000000', marketplace: LG_MP,  seller: S3 },
  { id:  400, rank: 1456, price: '210000000000000000',  marketplace: PCS_MP, seller: S2 },
  { id:  500, rank: 6701, price: '3000000000000000000', marketplace: LG_MP,  seller: S4 },
  { id:  600, rank:  897, price: '330000000000000000',  marketplace: PCS_MP, seller: S1 },
  { id:  700, rank: 4320, price: '750000000000000000',  marketplace: LG_MP,  seller: S3 },
  { id:  777, rank: 2568 },
  { id:  800, rank: 5944, price: '190000000000000000',  marketplace: PCS_MP, seller: S2 },
  { id:  900, rank: 7312, price: '270000000000000000',  marketplace: LG_MP,  seller: S4 },
  { id: 1000, rank: 2831, price: '920000000000000000',  marketplace: PCS_MP, seller: S1 },
  { id: 2500, rank: 3455, price: '410000000000000000',  marketplace: LG_MP,  seller: S2 },
  { id: 5000, rank: 6890 },
  { id: 7777, rank: 1234, price: '2200000000000000000', marketplace: LG_MP,  seller: S3 },
  // ── Page 2 ────────────────────────────────────────────────────────────────
  { id: 1100, rank: 4055, price: '260000000000000000',  marketplace: LG_MP,  seller: S4 },
  { id: 1200, rank: 5782, price: '390000000000000000',  marketplace: PCS_MP, seller: S1 },
  { id: 1300, rank: 6120, price: '175000000000000000',  marketplace: LG_MP,  seller: S2 },
  { id: 1400, rank: 7455, price: '310000000000000000',  marketplace: PCS_MP, seller: S3 },
  { id: 1500, rank: 3299, price: '475000000000000000',  marketplace: LG_MP,  seller: S4 },
  { id: 1600, rank: 5011, price: '220000000000000000',  marketplace: PCS_MP, seller: S1 },
  { id: 1700, rank: 2677, price: '1800000000000000000', marketplace: LG_MP,  seller: S2 },
  { id: 1800, rank: 4433, price: '540000000000000000',  marketplace: PCS_MP, seller: S3 },
  { id: 1900, rank: 5367 },
  { id: 2000, rank: 6890, price: '195000000000000000',  marketplace: PCS_MP, seller: S4 },
  { id: 2100, rank: 3001, price: '680000000000000000',  marketplace: LG_MP,  seller: S1 },
  { id: 2200, rank: 7988 },
  { id: 2300, rank: 1890, price: '2800000000000000000', marketplace: LG_MP,  seller: S2 },
  { id: 2400, rank: 5204, price: '285000000000000000',  marketplace: PCS_MP, seller: S3 },
  { id: 2600, rank:  788, price: '5000000000000000000', marketplace: LG_MP,  seller: S4 },
  { id: 2700, rank: 4712, price: '230000000000000000',  marketplace: PCS_MP, seller: S1 },
  { id: 2800, rank: 2234, price: '1100000000000000000', marketplace: LG_MP,  seller: S2 },
  { id: 3000, rank: 3788, price: '440000000000000000',  marketplace: PCS_MP, seller: S3 },
  { id: 3500, rank: 8012 },
  { id: 4000, rank: 2455, price: '1400000000000000000', marketplace: LG_MP,  seller: S4 },
  { id: 4500, rank: 3120, price: '560000000000000000',  marketplace: PCS_MP, seller: S1 },
  { id: 5500, rank: 2001, price: '1700000000000000000', marketplace: LG_MP,  seller: S2 },
  { id: 6000, rank: 6334 },
  { id: 8000, rank: 4899, price: '355000000000000000',  marketplace: PCS_MP, seller: S3 },
];

const ghostsMockData = raw.map(makeGhost);
export default ghostsMockData;
