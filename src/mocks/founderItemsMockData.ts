// Mock items for Founder's Armory and Founder's Supply tabs
// Uses foundersItemsContractAddress and lootboxContractAddress
// Images are intentionally left empty → will show the default-token.png placeholder

const FI_ADDR = '0x0e1dd95fb252542e9a18730914c209194be9fa8e';
const LB_ADDR = '0xaa34fd88eec8c667433b064806e479b1eb2d316c';
const LG_MP = 'littleGhosts';
const S1 = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
const S2 = '0x8894e0a0c962Cb723C1976A4421c95944Be379d8';

// Armory items: Founder's Belt, Shield, Sword, Helmet — 3 of each = 12
const armoryBase = [
  { type: "Founder's Armory", name: "Founder's Sword",   rank: 120, price: '500000000000000000',  seller: S1, marketplace: LG_MP },
  { type: "Founder's Armory", name: "Founder's Helmet",  rank: 150, price: '450000000000000000',  seller: S2, marketplace: LG_MP },
  { type: "Founder's Armory", name: "Founder's Shield",  rank: 180, price: '380000000000000000',  seller: S1, marketplace: LG_MP },
  { type: "Founder's Armory", name: "Founder's Belt",    rank: 200, price: '320000000000000000',  seller: S2, marketplace: LG_MP },
  { type: "Founder's Armory", name: "Founder's Sword",   rank: 122, price: '490000000000000000',  seller: S1, marketplace: LG_MP },
  { type: "Founder's Armory", name: "Founder's Helmet",  rank: 155, price: '460000000000000000',  seller: S2, marketplace: LG_MP },
  { type: "Founder's Armory", name: "Founder's Shield",  rank: 185, price: '370000000000000000',  seller: S1, marketplace: LG_MP },
  { type: "Founder's Armory", name: "Founder's Belt",    rank: 210, price: '310000000000000000',  seller: S2, marketplace: LG_MP },
  { type: "Founder's Armory", name: "Founder's Sword",   rank: 125, },
  { type: "Founder's Armory", name: "Founder's Helmet",  rank: 158, },
  { type: "Founder's Armory", name: "Founder's Shield",  rank: 190, },
  { type: "Founder's Armory", name: "Founder's Belt",    rank: 220, },
];

// Supply items: gems and potions — generic collectible items
const supplyBase = [
  { type: 'Gem',     name: 'Sapphire',        rank: 50,  price: '200000000000000000',  seller: S1, marketplace: LG_MP },
  { type: 'Gem',     name: 'Topaz',           rank: 80,  price: '150000000000000000',  seller: S2, marketplace: LG_MP },
  { type: 'Gem',     name: 'Emerald',         rank: 60,  price: '250000000000000000',  seller: S1, marketplace: LG_MP },
  { type: 'Gem',     name: 'Amethyst',        rank: 70,  price: '180000000000000000',  seller: S2, marketplace: LG_MP },
  { type: 'Gem',     name: 'Ruby',            rank: 40,  price: '350000000000000000',  seller: S1, marketplace: LG_MP },
  { type: 'Potion',  name: 'Dreams Potion',   rank: 30,  price: '420000000000000000',  seller: S2, marketplace: LG_MP },
  { type: 'Potion',  name: 'Despair Potion',  rank: 35,  price: '390000000000000000',  seller: S1, marketplace: LG_MP },
  { type: 'Gem',     name: 'Sapphire',        rank: 52,  },
  { type: 'Gem',     name: 'Topaz',           rank: 82,  },
  { type: 'Gem',     name: 'Emerald',         rank: 62,  },
  { type: 'Potion',  name: 'Dreams Potion',   rank: 32,  },
  { type: 'Potion',  name: 'Despair Potion',  rank: 37,  },
];

// Lootbox items
const lootboxBase = [
  { type: 'Lootbox', name: "Founder's Lootbox", rank: 1, price: '800000000000000000',  seller: S1, marketplace: LG_MP },
  { type: 'Lootbox', name: "Founder's Lootbox", rank: 2, price: '790000000000000000',  seller: S2, marketplace: LG_MP },
  { type: 'Lootbox', name: "Founder's Lootbox", rank: 3, price: '810000000000000000',  seller: S1, marketplace: LG_MP },
  { type: 'Lootbox', name: "Founder's Lootbox", rank: 4, price: '780000000000000000',  seller: S2, marketplace: LG_MP },
  { type: 'Lootbox', name: "Founder's Lootbox", rank: 5, },
  { type: 'Lootbox', name: "Founder's Lootbox", rank: 6, },
];

function makeFounderItem(item: any, index: number, address: string) {
  return {
    address,
    id: index + 1,
    token_id: index + 1,
    name: item.name,
    collection_total: address === LB_ADDR ? 500 : 2000,
    token_image_ext: 'png',
    rankable: 1,
    image_gif: '',
    image_png: '',
    image_3d: '',
    rank: item.rank,
    trait_type_value: { "Founder's Armory": item.name } as Record<string, string>,
    ...(item.price ? { price: item.price, seller: item.seller, marketplace: item.marketplace } : {}),
  };
}

export const founderItemsMockData = armoryBase
  .concat(supplyBase)
  .map((item, i) => makeFounderItem(item, i, FI_ADDR));

export const lootboxMockData = lootboxBase
  .map((item, i) => makeFounderItem(item, i, LB_ADDR));

// Combined export for the mock service to use
const founderItemsAllMockData = [...founderItemsMockData, ...lootboxMockData];
export default founderItemsAllMockData;
