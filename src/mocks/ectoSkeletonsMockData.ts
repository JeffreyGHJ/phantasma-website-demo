// 48 EctoSkeletons CollectionItems with real Pinata IPFS image URLs
// Token images fetched from https://spookyskeletons.s3.us-west-1.amazonaws.com/metadata/{id}.json
// token_image_ext = "png" → primary display image is image_png (no gif for ectos)

const E = 'https://gateway.pinata.cloud/ipfs/';
const ECTO_ADDR = '0x0fA48F20dDdcf6eD724a36381F66c3e905Fe7988';
const LG_MP = 'littleGhosts';
const PCS_MP = 'pancakeswap';
const S1 = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
const S2 = '0x8894e0a0c962Cb723C1976A4421c95944Be379d8';
const S3 = '0x1F5b7E9f7f24dEAb2c8C7c5f4EeA7C60B5B5A8f3';
const S4 = '0x3D4b5C6e7F8a9B0C1d2e3F4A5B6C7D8E9F0A1B2c';

// pngHash — 16 real tokens, cycled for page 2 and beyond
const IMGS: string[] = [
  'QmSbPTRYuU5fdvSv5kz69dDLw3mPiR519HM9SGPT57xWv1',  // token 1
  'QmeeN9vt7TzzPvCqznVEG8vyxrzczHuUXL3Abn7rrcjaoY',  // token 5
  'QmVwheXXrKwYdyBfjEWSBSTeQxPiY3KRWEAiehRVCTWMwG',  // token 10
  'QmTTHtaFHJfG2qNAZJG4j5theUiqvZjjHhufxXSJf1zmrx',  // token 42
  'QmQrzSyNXb4ZfQeGaKcJHFdghFZHQyN79Ybaac8JxvPW2p',  // token 50
  'QmRxepjhymtXyLn2AA8Bv6MBm5rW3xPEVwGdYLeJ2APq2B',  // token 100
  'QmcYJUc3ziZqsEETd6Yy7QjGzetgrnoaU9pZZU8wDGizu7',  // token 150
  'QmfH2P6qWAUqaXFCqwsqJa5aF8XecDzVTZNPSoUXizq86R',  // token 200
  'QmW6UVmzK5HSZpT4r38yVGNK1VfF3axyVfGwaNHQjD3LKt',  // token 250
  'QmPfeQUhuDwwEPPaKt1YhqxpiDkJjyde7hFJKRaWiVnh79',  // token 300
  'QmZdLMyHU9pvQca79EAD5Pz8xpwxKHn1GZjzFu7iVT8hVc',  // token 350
  'QmayPKFRAgFXcdY2QzcmZESBv4DUD7v6BYoPrRzsTbgRsj',  // token 400
  'QmYGBUBkvUW2aERjRiBWsuRFdcpF71VT9AFnhAzNzSk6js',  // token 500
  'QmSvDVfJfKTuinsgWzKUukDPffkwR52RUieifntxhbfECs',  // token 600
  'QmbWKy8Wdmbtsc6WfJKUMJBzMaQa6HLKKMQh2H3NgjmUgn',  // token 777
  'QmTAQGdGfCFSoj32wZRp9wYnGPqGWbuSm2857BR4t2LUEG',  // token 1000
];

function img(i: number) { return { image_gif: '', image_png: `${E}${IMGS[i % 16]}` }; }

type Raw = {
  id: number; rank: number;
  Background: string; Body: string; Eyes: string; Mouth: string;
  Hat: string; Top: string; Item: string; Buffs?: string;
  price?: string; marketplace?: string; seller?: string;
  imgIdx: number;
};

function makeEcto(r: Raw) {
  const tv: Record<string, string> = {
    Background: r.Background, Body: r.Body, Eyes: r.Eyes, Mouth: r.Mouth,
    Hat: r.Hat, Top: r.Top, Item: r.Item,
  };
  if (r.Buffs) tv['Buffs'] = r.Buffs;
  return {
    address: ECTO_ADDR, id: r.id, token_id: r.id, name: 'EctoSkeletons',
    collection_total: 5000, token_image_ext: 'png', rankable: 1,
    image_3d: '', ...img(r.imgIdx), rank: r.rank, trait_type_value: tv,
    ...(r.price ? { price: r.price, seller: r.seller, marketplace: r.marketplace } : {}),
  };
}

const raw: Raw[] = [
  // ── Page 1 (real token data) ──────────────────────────────────────────
  { id: 1,    rank: 2341, Background: 'Pisco sour',    Body: 'Tan Skeleton',    Eyes: 'Normal Gold Jewel Eyes',     Mouth: 'Shocked Mouth Tongue',          Hat: 'Beanie',           Top: 'None',                Item: 'Blue Balloon',   price: '280000000000000000',  marketplace: LG_MP,  seller: S1, imgIdx: 0 },
  { id: 5,    rank: 4567, Background: 'Nebulous',      Body: 'Red Skeleton',    Eyes: 'Angry Hallow Eyes',          Mouth: 'Sad Mouth',                     Hat: 'Fish Bowel',       Top: 'None',                Item: 'None',           price: '160000000000000000',  marketplace: PCS_MP, seller: S2, imgIdx: 1 },
  { id: 10,   rank: 3890, Background: 'Muted green',   Body: 'Tan Skeleton',    Eyes: 'Normal Green Jewel Eyes',    Mouth: 'Slightly Open Mouth',           Hat: 'Fish Bowel',       Top: 'None',                Item: 'None',           price: '210000000000000000',  marketplace: LG_MP,  seller: S3, imgIdx: 2 },
  { id: 42,   rank: 1233, Background: 'Nebulous',      Body: 'Purple Skeleton', Eyes: 'Normal Red Jewel Eyes',      Mouth: 'Normal Mouth',                  Hat: 'Gold Crown',       Top: 'None',                Item: 'None',           Buffs: 'HP % (Tier II)',   price: '1500000000000000000', marketplace: PCS_MP, seller: S4, imgIdx: 3 },
  { id: 50,   rank: 3102, Background: 'Pisco sour',    Body: 'White Skeleton',  Eyes: 'Normal Gold Jewel Eyes',     Mouth: 'Laughing Rainbow Grill Mouth',  Hat: 'Beanie',           Top: 'None',                Item: 'None',           price: '420000000000000000',  marketplace: LG_MP,  seller: S1, imgIdx: 4 },
  { id: 100,  rank: 988,  Background: 'Lagoon',        Body: 'Purple Skeleton', Eyes: 'Angry Purple Jewel Eyes',    Mouth: 'Laughing Mouth',                Hat: 'Blue Flaming Head',Top: 'None',                Item: 'None',           Buffs: 'Melee Attack % (Tier III)', price: '3200000000000000000', marketplace: PCS_MP, seller: S2, imgIdx: 5 },
  { id: 150,  rank: 2788, Background: 'Nautical',      Body: 'Red Skeleton',    Eyes: 'Angry Gold Jewel Eyes',      Mouth: 'Normal Mouth',                  Hat: 'Grey Cap',         Top: 'None',                Item: 'Glock',          price: '580000000000000000',  marketplace: LG_MP,  seller: S3, imgIdx: 6 },
  { id: 200,  rank: 4210, Background: 'Lagoon',        Body: 'Tan Skeleton',    Eyes: 'Normal Eyes',                Mouth: 'Laughing Rainbow Grill Mouth',  Hat: 'Green Cap',        Top: 'None',                Item: 'None',                                                                                 imgIdx: 7 },
  { id: 250,  rank: 1678, Background: 'Pink floyd',    Body: 'Red Skeleton',    Eyes: 'Normal Gold Jewel Eyes',     Mouth: 'Laughing Gold Grill Mouth',     Hat: 'Jewel Crown',      Top: 'None',                Item: 'Blunt',          Buffs: 'Magic Attack % (Tier II)', price: '2100000000000000000', marketplace: PCS_MP, seller: S4, imgIdx: 8 },
  { id: 300,  rank: 3445, Background: 'Jade',          Body: 'Red Skeleton',    Eyes: 'Normal Red Jewel Eyes',      Mouth: 'Slightly Open Mouth',           Hat: 'None',             Top: 'None',                Item: 'None',           price: '195000000000000000',  marketplace: LG_MP,  seller: S1, imgIdx: 9 },
  { id: 350,  rank: 2012, Background: 'Vanilla',       Body: 'Red Skeleton',    Eyes: 'Angry Blue Jewel Eyes',      Mouth: 'Laughing Mouth',                Hat: 'Blue Flaming Head',Top: 'None',                Item: 'Rose',           price: '890000000000000000',  marketplace: PCS_MP, seller: S2, imgIdx: 10 },
  { id: 400,  rank: 4788, Background: 'Neon blue',     Body: 'Tan Skeleton',    Eyes: 'Normal Red Jewel Eyes',      Mouth: 'Sad Mouth',                     Hat: 'Jewel Crown',      Top: 'None',                Item: 'None',           price: '340000000000000000',  marketplace: LG_MP,  seller: S3, imgIdx: 11 },
  { id: 500,  rank: 3999, Background: 'Nebulous',      Body: 'Tan Skeleton',    Eyes: 'Normal Purple Jewel Eyes',   Mouth: 'Normal Mouth',                  Hat: 'Fish Bowel',       Top: 'None',                Item: 'None',           price: '255000000000000000',  marketplace: PCS_MP, seller: S4, imgIdx: 12 },
  { id: 600,  rank: 1455, Background: 'Vanilla',       Body: 'White Skeleton',  Eyes: 'Angry Purple Jewel Eyes',    Mouth: 'Laughing Gold Grill Mouth',     Hat: 'Jewel Crown',      Top: 'None',                Item: 'Knife',          Buffs: 'HP % (Tier I)',    price: '2500000000000000000', marketplace: LG_MP, seller: S1, imgIdx: 13 },
  { id: 777,  rank: 2234, Background: 'Ghost Blue',    Body: 'Green Skeleton',  Eyes: 'Normal Blue Jewel Eyes',     Mouth: 'Shocked Mouth',                 Hat: 'Halo',             Top: 'Grey Hoodie Up',      Item: 'None',           price: '750000000000000000',  marketplace: PCS_MP, seller: S2, imgIdx: 14 },
  { id: 1000, rank: 3567, Background: 'Moonscape',     Body: 'Ice King Skeleton',Eyes: 'Normal Green Jewel Eyes',   Mouth: 'Laughing Green Grill Mouth',    Hat: 'Silver Crown',     Top: 'White Shirt',         Item: 'None',           Buffs: 'Archery Attack % (Tier I)', price: '1200000000000000000', marketplace: LG_MP, seller: S3, imgIdx: 15 },
  // ── Page 2 (new token IDs, reused images) ────────────────────────────
  { id: 1100, rank: 4233, Background: 'Cotton Candy',  Body: 'Purple Skeleton', Eyes: 'Normal Purple Jewel Eyes',   Mouth: 'Shocked Mouth Tongue',          Hat: 'Santa Hat',        Top: 'Pink Hoodie',         Item: 'Blue Balloon',   price: '310000000000000000',  marketplace: PCS_MP, seller: S4, imgIdx: 0 },
  { id: 1200, rank: 3012, Background: 'Broomstick Brown', Body: 'White Skeleton', Eyes: 'Sad Eyes',                Mouth: 'Sad Mouth',                     Hat: 'Cowboy Hat',       Top: 'Black T-shirt',       Item: 'None',           price: '185000000000000000',  marketplace: LG_MP,  seller: S1, imgIdx: 1 },
  { id: 1300, rank: 1889, Background: 'Cold Ice',      Body: 'Ice King Skeleton',Eyes: 'Angry Ice Jewel Eyes',      Mouth: 'Laughing Mouth',                Hat: 'Blue Flaming Head',Top: 'None',                Item: 'None',           Buffs: 'Magic Defense % (Tier II)', price: '1600000000000000000', marketplace: PCS_MP, seller: S2, imgIdx: 2 },
  { id: 1400, rank: 4678, Background: 'Hydra gray',    Body: 'Green Skeleton',  Eyes: 'Normal Eyes',                Mouth: 'Normal Mouth',                  Hat: 'Black Cap',        Top: 'Grey T-shirt',        Item: 'Bubble Stick',   price: '220000000000000000',  marketplace: LG_MP,  seller: S3, imgIdx: 3 },
  { id: 1500, rank: 2567, Background: 'Bunny Cloud',   Body: 'White Skeleton',  Eyes: 'Angry Hallow Eyes',          Mouth: 'Shocked Mouth',                 Hat: 'Bunny Ears',       Top: 'None',                Item: 'None',                                                                                 imgIdx: 4 },
  { id: 1600, rank: 3890, Background: 'Luxor gold',    Body: 'Tan Skeleton',    Eyes: 'Angry Gold Jewel Eyes',      Mouth: 'Laughing Rainbow Grill Mouth',  Hat: 'Gold Crown',       Top: 'Gold Chain',          Item: 'Rose',           price: '950000000000000000',  marketplace: PCS_MP, seller: S4, imgIdx: 5 },
  { id: 1700, rank: 4123, Background: 'Wicked green',  Body: 'Green Skeleton',  Eyes: 'Regular Hallow Eyes',        Mouth: 'Slightly Open Mouth',           Hat: 'Evil Horns',       Top: 'None',                Item: 'Scythe',         price: '430000000000000000',  marketplace: LG_MP,  seller: S1, imgIdx: 6 },
  { id: 1800, rank: 2899, Background: 'Gravestone Grey', Body: 'Purple Skeleton', Eyes: 'Angry Purple Jewel Mascara Eyes', Mouth: 'Laughing Gold Grill Mouth', Hat: 'Diamond Mask', Top: 'Reaper Black Hoodie Up', Item: 'None',          Buffs: 'Melee Defense % (Tier I)', price: '1900000000000000000', marketplace: PCS_MP, seller: S2, imgIdx: 7 },
  { id: 1900, rank: 3344, Background: 'Pastel red',    Body: 'Red Skeleton',    Eyes: 'Sad Hallow Eyes',            Mouth: 'Sad Mouth',                     Hat: 'Skii Mask',        Top: 'Black Hoodie Down',   Item: 'Cigarette',      price: '270000000000000000',  marketplace: LG_MP,  seller: S3, imgIdx: 8 },
  { id: 2000, rank: 4501, Background: 'Peach fury',    Body: 'Tan Skeleton',    Eyes: 'Normal Blue Jewel Eyes',     Mouth: 'Laughing Green Grill Mouth',    Hat: 'Beanie',           Top: 'None',                Item: 'Yellow Balloon', price: '190000000000000000',  marketplace: PCS_MP, seller: S4, imgIdx: 9 },
  { id: 2100, rank: 2123, Background: 'Midnight Magic', Body: 'White Skeleton', Eyes: 'Angry Red Jewel Eyes',       Mouth: 'Laughing Mouth',                Hat: 'Clown',            Top: 'Jack Suit',           Item: 'None',           Buffs: 'HP % (Tier III)', price: '2800000000000000000', marketplace: LG_MP, seller: S1, imgIdx: 10 },
  { id: 2200, rank: 3678, Background: 'Phantom ship',  Body: 'Ice King Skeleton',Eyes: 'Angry Blue Retro Sunglasses', Mouth: 'Normal Mouth',                Hat: 'Fish Bowel',       Top: 'Black Hoodie Up',     Item: 'None',           price: '360000000000000000',  marketplace: PCS_MP, seller: S2, imgIdx: 11 },
  { id: 2300, rank: 4890, Background: 'Purple Potion', Body: 'Green Skeleton',  Eyes: 'Normal Green Jewel Eyes',    Mouth: 'Shocked Mouth Tongue',          Hat: 'Green Flaming Head', Top: 'None',              Item: 'Slendy Tentacles', price: '480000000000000000', marketplace: LG_MP,  seller: S3, imgIdx: 12 },
  { id: 2400, rank: 1788, Background: 'Whales tale',   Body: 'Purple Skeleton', Eyes: 'Angry Purple Jewel Eyes',    Mouth: 'Laughing Rainbow Grill Mouth',  Hat: 'Jewel Crown',      Top: 'Black Hoodie Up Red Tie', Item: 'Ye Mic',       Buffs: 'Special Regeneration (Tier II)', price: '4200000000000000000', marketplace: PCS_MP, seller: S4, imgIdx: 13 },
  { id: 2500, rank: 3234, Background: 'Vineyard',      Body: 'Tan Skeleton',    Eyes: 'Normal Red Jewel Eyes',      Mouth: 'Slightly Open Mouth',           Hat: 'Red Cap',          Top: 'None',                Item: 'Green Balloon',  price: '200000000000000000',  marketplace: LG_MP,  seller: S1, imgIdx: 14 },
  { id: 2600, rank: 4012, Background: 'Ghastly Grey',  Body: 'Red Skeleton',    Eyes: 'Sad Eyes',                   Mouth: 'Sad Mouth',                     Hat: 'Grey Cap',         Top: 'Grey Hoodie Down',    Item: 'None',                                                                                 imgIdx: 15 },
  { id: 2700, rank: 2567, Background: 'Lagoon',        Body: 'White Skeleton',  Eyes: 'Normal Gold Jewel Eyes',     Mouth: 'Laughing Gold Grill Mouth',     Hat: 'Silver Crown',     Top: 'White Shirt',         Item: 'None',           price: '670000000000000000',  marketplace: PCS_MP, seller: S2, imgIdx: 0 },
  { id: 2800, rank: 3789, Background: 'Nautical',      Body: 'Green Skeleton',  Eyes: 'Angry Green Jewel Eyes',     Mouth: 'Laughing Mouth',                Hat: 'Bucket Hat Black', Top: 'Black T-shirt',       Item: 'Knife',          price: '310000000000000000',  marketplace: LG_MP,  seller: S3, imgIdx: 1 },
  { id: 3000, rank: 1345, Background: 'Jade',          Body: 'Purple Skeleton', Eyes: 'Normal Purple Jewel Eyes',   Mouth: 'Shocked Mouth',                 Hat: 'Evil Beetle Wig',  Top: 'Evil Beetle Suit',    Item: 'None',           Buffs: 'Archery Defense % (Tier III)', price: '5000000000000000000', marketplace: PCS_MP, seller: S4, imgIdx: 2 },
  { id: 3500, rank: 4456, Background: 'Neon blue',     Body: 'Tan Skeleton',    Eyes: 'Angry Blue Retro Sunglasses', Mouth: 'Slightly Open Mouth',          Hat: 'Bucket Hat Grey',  Top: 'None',                Item: 'Purple Balloon', price: '245000000000000000',  marketplace: LG_MP,  seller: S1, imgIdx: 3 },
  { id: 4000, rank: 2890, Background: 'Moonscape',     Body: 'Ice King Skeleton',Eyes: 'Angry Ice Jewel Eyes',      Mouth: 'Laughing Rainbow Grill Mouth',  Hat: 'Silver Crown',     Top: 'Gold Chain on Pink Hoodie', Item: 'None',        Buffs: 'Energy % (Tier II)', price: '1300000000000000000', marketplace: PCS_MP, seller: S2, imgIdx: 4 },
  { id: 4500, rank: 3567, Background: 'Ghost Blue',    Body: 'White Skeleton',  Eyes: 'Normal Eyes',                Mouth: 'Normal Mouth',                  Hat: 'Halo',             Top: 'None',                Item: 'Red Balloon',    price: '175000000000000000',  marketplace: LG_MP,  seller: S3, imgIdx: 5 },
];

const ectoSkeletonsMockData = raw.map(makeEcto);
export default ectoSkeletonsMockData;
