// 48 LittleGhosts CollectionItems with real Pinata IPFS image URLs
// Token images fetched from https://littleghosts.s3.us-east-2.amazonaws.com/metadata/{id}.json
// token_image_ext = "gif" → primary display image is image_gif

const G = 'https://gateway.pinata.cloud/ipfs/';
const LG_ADDR = '0x98f606a4cdde68b9f68732d21fb9ba8b5510ee48';
const LG_MP = 'littleGhosts';
const PCS_MP = 'pancakeswap';
const S1 = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
const S2 = '0x8894e0a0c962Cb723C1976A4421c95944Be379d8';
const S3 = '0x1F5b7E9f7f24dEAb2c8C7c5f4EeA7C60B5B5A8f3';
const S4 = '0x3D4b5C6e7F8a9B0C1d2e3F4A5B6C7D8E9F0A1B2c';

// [gifHash, pngHash] — 24 real tokens, re-used for page 2
const IMGS: [string, string][] = [
  ['QmR3Pkwajz7vbzxoEqRNWziV4NF7GS3rHDvdVdxhUe8jzh', 'QmR45shkR9BR5mvFo68u8gQ9VUbMWybyjcJqqqVY58VoWg'],   // token 1
  ['QmcfcNtiQ5f81CHDX3SjiG8AoP8GJBUJPhV5obmuybuJA3', 'QmdxSJbmZZoFwm7cxTuRSeEogX6nTY8V1jfRrf87xfHtRk'],   // token 5
  ['QmNWY7tAEShnHyJe5CYjVZZiXV1ntKakjdxtqB6ufcdjr6', 'QmR87vjj1uomn9VFz8EPat4wQVPM5DHhLWD2eeqgv7LApb'],   // token 10
  ['QmXukwC5SPCSUZVsqkLedN754G1Xhqz961KR9HaorNYdRu', 'QmZaX6wxkkiXmh5z5fHNhdn5HJuR2A7Yc1oWQc7UV8H9Wq'],   // token 20
  ['QmXGHXNWRwYH7VZzRaoGyeHeqmbLkiPjeobZSWASQC5BED', 'Qmeeb6Vq7Njxe3orNJ1UdXiYdrfAdwvg1HiCCPb6vEaFYD'],   // token 42
  ['Qme2VkNpHufEnaoVCfzW3NUyJbGLSVKe3myNvn7r4VToyV', 'QmXGSfhfJwKH3Yq35MtQsyvavqPaCMD5v2dBF6dtaS3Mqa'],   // token 50
  ['QmNLr3MQXhPrCzTaLGnGJG63wAFjtA4oDpMYhx244RCzwF', 'QmbGrD8zRAi8EB8kdpMbZcPzFwc2k8Y7Yiu5ZmpDeTfXft'],   // token 75
  ['QmXMWTScwiZckyuvytWqy6UqqEfJ3gmsjo2tvu3LURhqad', 'QmWoVDiCsrPa7G5io92opEVf2MPGN2mYsvMFjGCY34mvtP'],   // token 100
  ['QmbAtWn3xVv49pHKe1GnYKKuEsFxri3jDaaLgygxa1rF23', 'QmVHN4otZjmb6pCcFdJZVUwyoeKCx2mwjP7J5P8TNCQxkF'],   // token 150
  ['QmSq4ejbBvqhrciZM6Ysue2ujDWaYpJNeEVQznH7sFsShY', 'QmY5DhyCPLeocsvemgSMy25xj5uogofdkDWorgGztt5vh2'],   // token 200
  ['QmY5mXXG2F9V8pPyc75XNQ7G4Y7bvSfxuLNz3LZtLmSu61', 'QmQsAGqdL6DfbfzjrvLRWJDMYULMeJZpWssFpGKPyjR7XN'],   // token 250
  ['QmeNB4bXBqCj34R6Z6QVp9gf4sEakGicDdg4ZMSng3onFM', 'QmXCkZ6ogQzZewB27fRppizEY8C5r5xwApJGTTXGbGZDw5'],   // token 300
  ['QmbMwiqZhdzPYmTHXQCWzMS4g3HuvRUZT5Atsf2HQTR3eB', 'QmRfGzEEb9BfLCihjYUbmWf4XGdxc2eHnNs5Nt5yYrVqaf'],   // token 350
  ['QmQXjDM7FAeanQXEMeStLcJDbTjtYBMZnepEFPVKccHiGa', 'Qmf5nrK9QhWShMcYwRr6jc7QJHnP1qAtmwhckYPkDAvx7J'],   // token 400
  ['QmTBWmFuSCA146LWo5ssJ9GxjYnRippLBwCDWZ5aDYVQKG', 'QmQZmamKHN3gxBcS5hWjQQXPcSVo9VSUomAUciok8fT98X'],   // token 500
  ['QmTUaaZNYnFjdsCMp3fia5AydwkuCzdCQtFHG7o17LacAe', 'QmPxj3H16SPkSinVE7NyWBYM1cE1yQCgrA21jDQLNuvxKF'],   // token 600
  ['QmU3QrjpyTFo9MS4j6YdaPJM6rKqEgg3XWPNytP8MXnSdC', 'QmSXLNzFqrmvD2oYkppmEXAcMz5YNyquL6Cy5oLCLuCGQX'],   // token 700
  ['Qmcfs592teoxBdzXZN7mWBBSygeeUBefwU43dAnzxRTmTY', 'Qmci91XrgX4DvFC4kY8ewck7ofcP1Yws2fHri7im6RCFrv'],   // token 777
  ['QmNMAKa3N3Jz51v5oaNN5YjttUMyn7qxaG499WDSatF1ke', 'QmVSt3vnuPkPPE8nTiiA2ic7hRPM67veFFN9RYpxbKHJuw'],   // token 800
  ['QmQLEJtmFUGmXecYou94ZoMBkaHtaRWwQpMEz29c6d2FyX', 'Qmd7Wd1BPRwykhMYBGtJ9seuNRJFFESYzVarRgprRr4391'],   // token 900
  ['QmYWejm1ZE7m24GfrnzSuN7UVkEqyJZngBsaU4Y6StDK8g', 'QmZ1jT5PLhjqPvkPskaau3c3S2Dzz7gERe64gTff3kDgPa'],   // token 1000
  ['QmbxqjSMdd5woUM4ijzcz3dpB3uN2tyiQr5h3Hift3aigv', 'QmY9YSrozyN55oR8dVGQPym76CTuBtoQ9aML1on6wqTncp'],   // token 2500
  ['QmSprABgBgvk2TDFJAfEBYw8dbfBkuxtvoJLgnP4GHZe1F', 'QmYMfcKsGydjBvsN4RY2QuyddPWfM2FB14MvxRCKso8o9J'],   // token 5000
  ['QmYRDJY6SenhumDWnQ2ZWZx63cDkYWYZLm8BYR9Z4CBmgd', 'QmUqnnT56JAp4S7xghWPf7xyswhHR7yi5g9p9jyu5Hx2hV'],   // token 7777
];

function img(i: number) { return { image_gif: `${G}${IMGS[i % 24][0]}`, image_png: `${G}${IMGS[i % 24][1]}` }; }

type Raw = {
  id: number; rank: number;
  Background: string; Body: string; Eyes: string; Mouth: string;
  Hat: string; Prop: string; Item: string; Buffs?: string;
  price?: string; marketplace?: string; seller?: string;
  imgIdx: number;
};

function makeGhost(r: Raw) {
  const tv: Record<string, string> = {
    Background: r.Background, Body: r.Body, Eyes: r.Eyes, Mouth: r.Mouth,
    Hat: r.Hat, Prop: r.Prop, Item: r.Item,
  };
  if (r.Buffs) tv['Buffs'] = r.Buffs;
  return {
    address: LG_ADDR, id: r.id, token_id: r.id, name: 'LittleGhosts',
    collection_total: 10000, token_image_ext: 'gif', rankable: 1,
    image_3d: '', ...img(r.imgIdx), rank: r.rank, trait_type_value: tv,
    ...(r.price ? { price: r.price, seller: r.seller, marketplace: r.marketplace } : {}),
  };
}

const raw: Raw[] = [
  // ── Page 1 (real token data) ──────────────────────────────────────────
  { id: 5,    rank: 3821, Background: 'Silk Blue',      Body: 'Lime Green Ghost', Eyes: 'Anime Black Eyes', Mouth: 'Face Mask',       Hat: 'None',              Prop: 'None',          Item: 'None',             price: '180000000000000000',  marketplace: LG_MP,  seller: S1, imgIdx: 1 },
  { id: 10,   rank: 5103, Background: 'Haunted Plum',   Body: 'White Ghost',      Eyes: 'Stoned Eyes',      Mouth: 'Smirk',            Hat: 'Green Backwards Hat', Prop: 'Earrings',    Item: 'None',             price: '250000000000000000',  marketplace: PCS_MP, seller: S2, imgIdx: 2 },
  { id: 20,   rank: 4467, Background: 'Razzmic Berry',  Body: 'Grey Ghost',       Eyes: 'Girly Eyes',       Mouth: 'Wiggle Mouth',     Hat: 'Santa Hat',           Prop: 'Sunglasses',  Item: 'None',             price: '320000000000000000',  marketplace: LG_MP,  seller: S3, imgIdx: 3 },
  { id: 42,   rank: 2945, Background: 'Cyan',           Body: 'White Ghost',      Eyes: 'Happy Eyes',       Mouth: 'Big Smile',        Hat: 'Black Baseball Cap',  Prop: 'None',        Item: 'None',             price: '500000000000000000',  marketplace: LG_MP,  seller: S1, imgIdx: 4 },
  { id: 50,   rank: 6234, Background: 'Emperor',        Body: 'Blue Ghost',       Eyes: 'Anime Black Eyes', Mouth: 'Wiggle Mouth',     Hat: 'Purple Wizard Hat',   Prop: 'None',        Item: 'None',             price: '150000000000000000',  marketplace: PCS_MP, seller: S4, imgIdx: 5 },
  { id: 75,   rank: 1877, Background: 'Moss Green',     Body: 'White Ghost',      Eyes: 'Heart Eyes',       Mouth: 'Big Smile',        Hat: 'Teal Beanie',         Prop: 'Blue Lasers', Item: 'None',             Buffs: '+5 Every Bonus', price: '850000000000000000', marketplace: LG_MP, seller: S2, imgIdx: 6 },
  { id: 100,  rank: 3612, Background: 'Moss Green',     Body: 'Purple Ghost',     Eyes: 'Right Look',       Mouth: 'Smirk',            Hat: 'Red Backwards Hat',   Prop: 'Eye Patch',   Item: 'None',             price: '420000000000000000',  marketplace: PCS_MP, seller: S3, imgIdx: 7 },
  { id: 150,  rank: 7088, Background: 'Midnight Blue',  Body: 'Black Ghost',      Eyes: 'Cross Eyes',       Mouth: 'Cigarette',        Hat: 'None',                Prop: 'None',        Item: 'Knife',                                                                              imgIdx: 8 },
  { id: 200,  rank: 2103, Background: 'Silk Bulk',      Body: 'Purple Ghost',     Eyes: 'Cross Eyes',       Mouth: 'Wiggle Mouth',     Hat: 'Teal Beanie',         Prop: 'Red Lasers',  Item: 'None',             Buffs: '+6 Every Bonus', price: '1200000000000000000', marketplace: LG_MP, seller: S1, imgIdx: 9 },
  { id: 250,  rank: 5560, Background: 'Slate Blue',     Body: 'Red Ghost',        Eyes: 'Stoned Eyes',      Mouth: 'Cigarette Smoke',  Hat: 'None',                Prop: 'Sunglasses',  Item: 'None',             price: '290000000000000000',  marketplace: PCS_MP, seller: S2, imgIdx: 10 },
  { id: 300,  rank: 4892, Background: 'Ghost Green',    Body: 'Alien Ghost',      Eyes: 'Alien Eyes',       Mouth: 'Alien Mouth',      Hat: 'None',                Prop: 'None',        Item: 'None',             price: '380000000000000000',  marketplace: LG_MP,  seller: S4, imgIdx: 11 },
  { id: 350,  rank: 3244, Background: 'Silk Bulk',      Body: 'Lime Green Ghost', Eyes: 'Anime Red Eyes',   Mouth: 'Big Smile',        Hat: 'Black Backwards Hat', Prop: 'None',        Item: 'None',             price: '460000000000000000',  marketplace: PCS_MP, seller: S1, imgIdx: 12 },
  { id: 400,  rank: 1456, Background: 'Asagi',          Body: 'Dark Purple Ghost',Eyes: 'Stare Eyes',       Mouth: 'Smirk',            Hat: 'Black Baseball Cap',  Prop: 'Red Lasers',  Item: 'None',             price: '1500000000000000000', marketplace: LG_MP,  seller: S3, imgIdx: 13 },
  { id: 500,  rank: 6701, Background: 'Dark Mustard',   Body: 'Shiba Ghost',      Eyes: 'Money Sign Eyes',  Mouth: 'Grill',            Hat: 'None',                Prop: 'Gold Chain',  Item: 'Money',            price: '210000000000000000',  marketplace: PCS_MP, seller: S2, imgIdx: 14 },
  { id: 600,  rank: 897,  Background: 'Razzmic Berry',  Body: 'Grey Ghost',       Eyes: 'Heart Eyes',       Mouth: 'Straight',         Hat: 'Black Baseball Cap',  Prop: 'Silver Chain',Item: 'None',             Buffs: '+8 Every Bonus', price: '3000000000000000000', marketplace: LG_MP, seller: S4, imgIdx: 15 },
  { id: 700,  rank: 4320, Background: 'Razzmic Berry',  Body: 'White Ghost',      Eyes: 'Anime Red Eyes',   Mouth: 'Frown',            Hat: 'Black Hoodie',        Prop: 'Earrings',    Item: 'None',             price: '330000000000000000',  marketplace: PCS_MP, seller: S1, imgIdx: 16 },
  { id: 777,  rank: 2568, Background: 'Slate Blue',     Body: 'Purple Ghost',     Eyes: 'Evil Eyes',        Mouth: 'None',             Hat: 'Purple Baseball Cap', Prop: 'Halo',        Item: 'None',             price: '750000000000000000',  marketplace: LG_MP,  seller: S3, imgIdx: 17 },
  { id: 800,  rank: 5944, Background: 'Midnight Green', Body: 'White Ghost',      Eyes: 'Anime Black Eyes', Mouth: 'Grill',            Hat: 'Orange Beanie',       Prop: 'Horns',       Item: 'None',                                                                               imgIdx: 18 },
  { id: 900,  rank: 7312, Background: 'Pale Berry',     Body: 'Doge Ghost',       Eyes: 'Uninterested Look',Mouth: 'Frown',            Hat: 'Red Baseball Cap',    Prop: 'None',        Item: 'None',             price: '190000000000000000',  marketplace: PCS_MP, seller: S2, imgIdx: 19 },
  { id: 1,    rank: 4188, Background: 'Lava Red',       Body: 'Scary Ghost',      Eyes: 'Scary Eyes',       Mouth: 'Scary Mouth',      Hat: 'None',                Prop: 'None',        Item: 'None',             price: '270000000000000000',  marketplace: LG_MP,  seller: S4, imgIdx: 0 },
  { id: 1000, rank: 2831, Background: 'Midnight Blue',  Body: 'Green Glowing Ghost', Eyes: 'Ghost Sith Eyes', Mouth: 'Ghost Sith Smile', Hat: 'Ghost Sith Hoodie', Prop: 'None',       Item: 'None',             price: '920000000000000000',  marketplace: PCS_MP, seller: S1, imgIdx: 20 },
  { id: 2500, rank: 3455, Background: 'Foggy Grey',     Body: 'Ghostface Ghost',  Eyes: 'Ghostface Eyes',   Mouth: 'Ghostface Mouth',  Hat: 'Ghostface Hoodie',    Prop: 'None',        Item: 'None',             price: '410000000000000000',  marketplace: LG_MP,  seller: S2, imgIdx: 21 },
  { id: 5000, rank: 6890, Background: 'Pumpkin Orange', Body: 'Pancake Ghost',    Eyes: 'Pancake Eyes',     Mouth: 'None',             Hat: 'Pancake Ears',        Prop: 'None',        Item: 'None',                                                                               imgIdx: 22 },
  { id: 7777, rank: 1234, Background: 'Cool Magenta',   Body: 'Friendly Ghost',   Eyes: 'Friendly Eyes',   Mouth: 'Friendly Mouth',   Hat: 'None',                Prop: 'None',        Item: 'None',             Buffs: '+4 Every Bonus', price: '2200000000000000000', marketplace: LG_MP, seller: S3, imgIdx: 23 },
  // ── Page 2 (new token IDs, reused images) ────────────────────────────
  { id: 1100, rank: 4055, Background: 'Epic Blue',      Body: 'Grey Ghost',       Eyes: 'Happy Eyes',       Mouth: 'Smirk',            Hat: 'Blue Wizard Hat',     Prop: '3D Glasses',  Item: 'None',             price: '260000000000000000',  marketplace: LG_MP,  seller: S4, imgIdx: 0 },
  { id: 1200, rank: 5782, Background: 'Punk Blue',      Body: 'Blue Ghost',       Eyes: 'Vampire Eyes',     Mouth: 'Vampire Teeth',    Hat: 'None',                Prop: 'Silver Chain',Item: 'Blue Lightsaber',  price: '390000000000000000',  marketplace: PCS_MP, seller: S1, imgIdx: 1 },
  { id: 1300, rank: 6120, Background: 'Silk Bulk',      Body: 'Purple Ghost',     Eyes: 'Bubble Eyes',      Mouth: 'Cigarette Smoke',  Hat: 'Black Beanie',        Prop: 'Cigarette',   Item: 'None',             Buffs: '+4 Every Bonus', price: '175000000000000000', marketplace: LG_MP, seller: S2, imgIdx: 2 },
  { id: 1400, rank: 7455, Background: 'Maximum Yellow', Body: 'White Ghost',      Eyes: 'Jawa Eyes',        Mouth: 'None',             Hat: 'Jawa Hoodie',         Prop: 'None',        Item: 'Jawa Gun',         price: '310000000000000000',  marketplace: PCS_MP, seller: S3, imgIdx: 3 },
  { id: 1500, rank: 3299, Background: 'Ghost Green',    Body: 'Red Ghost',        Eyes: 'Scary Eyes',       Mouth: 'Scary Mouth',      Hat: 'None',                Prop: 'Horns',       Item: 'Knife',            Buffs: '+4 Every Bonus', price: '475000000000000000', marketplace: LG_MP, seller: S4, imgIdx: 4 },
  { id: 1600, rank: 5011, Background: 'Pale Orange',    Body: 'Alien Ghost',      Eyes: 'Alien Eyes',       Mouth: 'Alien Mouth',      Hat: 'None',                Prop: 'None',        Item: 'None',             price: '220000000000000000',  marketplace: PCS_MP, seller: S1, imgIdx: 5 },
  { id: 1700, rank: 2677, Background: 'Pale Berry',     Body: 'Ghost Rick',       Eyes: 'Rick Eyes',        Mouth: 'Rick Mouth',       Hat: 'Rick Hair',           Prop: 'None',        Item: 'Ricks Laser Gun',  price: '1800000000000000000', marketplace: LG_MP,  seller: S2, imgIdx: 6 },
  { id: 1800, rank: 4433, Background: 'Gravel Grey',    Body: 'Beetle Ghost',     Eyes: 'Beetle Eyes',      Mouth: 'Beetle Mouth',     Hat: 'Beetle Hair',         Prop: 'None',        Item: 'None',             price: '540000000000000000',  marketplace: PCS_MP, seller: S3, imgIdx: 7 },
  { id: 1900, rank: 5367, Background: 'Emperor',        Body: 'Dark Purple Ghost',Eyes: 'Evil Eyes',        Mouth: 'None',             Hat: 'Purple Beanie',       Prop: 'Sunglasses',  Item: 'None',                                                                               imgIdx: 8 },
  { id: 2000, rank: 6890, Background: 'Epic Blue',      Body: 'Baby Ghost Alien', Eyes: 'Baby Ghost Alien Eyes', Mouth: 'Baby Ghost Alien Mouth', Hat: 'Baby Ghost Alien Hoodie', Prop: 'None', Item: 'None', price: '195000000000000000',  marketplace: PCS_MP, seller: S4, imgIdx: 9 },
  { id: 2100, rank: 3001, Background: 'Ghost Green',    Body: 'Grey Ghost',       Eyes: 'Squint Eyes',      Mouth: 'Face Mask',        Hat: 'Hoodie',              Prop: 'Eye Patch',   Item: 'ERTH',             Buffs: '+5 Every Bonus', price: '680000000000000000', marketplace: LG_MP, seller: S1, imgIdx: 10 },
  { id: 2200, rank: 7988, Background: 'Silk Blue',      Body: 'Transparent Ghost',Eyes: 'Bubble Eyes',      Mouth: 'None',             Hat: 'None',                Prop: 'Halo',        Item: 'Money',                                                                              imgIdx: 11 },
  { id: 2300, rank: 1890, Background: 'Midnight Blue',  Body: 'Black Ghost',      Eyes: 'Evil Eyes',        Mouth: 'Stiches',          Hat: 'Top Hat',             Prop: 'Underworld Robe', Item: 'None',          price: '2800000000000000000', marketplace: LG_MP,  seller: S2, imgIdx: 12 },
  { id: 2400, rank: 5204, Background: 'Pale Orange',    Body: 'Blue Ghost',       Eyes: 'Cross Eyes',       Mouth: 'Big Smile',        Hat: 'Green Beanie',        Prop: 'None',        Item: 'Bnb Coin',         price: '285000000000000000',  marketplace: PCS_MP, seller: S3, imgIdx: 13 },
  { id: 2600, rank: 788,  Background: 'Dark Mustard',   Body: 'Hades',            Eyes: 'Hades',            Mouth: 'Hades',            Hat: 'None',                Prop: 'Horns',       Item: 'None',             Buffs: '+8 Every Bonus', price: '5000000000000000000', marketplace: LG_MP, seller: S4, imgIdx: 14 },
  { id: 2700, rank: 4712, Background: 'Silk Bulk',      Body: 'White Ghost',      Eyes: 'Girly Eyes',       Mouth: 'Wiggle Mouth',     Hat: 'Purple Beanie',       Prop: 'Earrings',    Item: 'None',             price: '230000000000000000',  marketplace: PCS_MP, seller: S1, imgIdx: 15 },
  { id: 2800, rank: 2234, Background: 'Lava Red',       Body: 'Red Ghost',        Eyes: 'Stare Eyes',       Mouth: 'Smirk',            Hat: 'Red Backwards Hat',   Prop: 'Red Lasers',  Item: 'Red Lightsaber',   price: '1100000000000000000', marketplace: LG_MP,  seller: S2, imgIdx: 16 },
  { id: 3000, rank: 3788, Background: 'Wageningen Green',Body: 'Blue Alien Ghost',Eyes: 'Anime Red Eyes',   Mouth: 'Big Smile',        Hat: 'None',                Prop: 'Green Lasers',Item: 'Green Lightsaber', price: '440000000000000000',  marketplace: PCS_MP, seller: S3, imgIdx: 17 },
  { id: 3500, rank: 8012, Background: 'Foggy Grey',     Body: 'Super Shy Ghost',  Eyes: 'Super Shy Eyes',   Mouth: 'Super Shy Mouth',  Hat: 'Super Shy Hoodie',    Prop: 'None',        Item: 'None',                                                                               imgIdx: 18 },
  { id: 4000, rank: 2455, Background: 'Maximum Yellow', Body: 'Ghostie Wan',      Eyes: 'Ghostie Wan Eyes', Mouth: 'Ghostie Wan Mouth',Hat: 'Ghostie Wan Hoodie',  Prop: 'None',        Item: 'None',             price: '1400000000000000000', marketplace: LG_MP,  seller: S4, imgIdx: 19 },
  { id: 4500, rank: 3120, Background: 'Emperor',        Body: 'Ghostdu',          Eyes: 'Ghostdu Eyes',     Mouth: 'Ghostdu Mouth',    Hat: 'Ghostdu Hoodie',      Prop: 'None',        Item: 'None',             price: '560000000000000000',  marketplace: PCS_MP, seller: S1, imgIdx: 20 },
  { id: 5500, rank: 2001, Background: 'Haunted Plum',   Body: 'Purple Ghost',     Eyes: 'Stoned Eyes',      Mouth: 'Straight',         Hat: 'Purple Baseball Cap', Prop: 'Sunglasses',  Item: 'None',             Buffs: '+6 Every Bonus', price: '1700000000000000000', marketplace: LG_MP, seller: S2, imgIdx: 21 },
  { id: 6000, rank: 6334, Background: 'Pale Berry',     Body: 'White Ghost',      Eyes: 'Heart Eyes',       Mouth: 'Big Smile',        Hat: 'None',                Prop: 'Heart Bubble',Item: 'None',                                                                               imgIdx: 22 },
  { id: 8000, rank: 4899, Background: 'Asagi',          Body: 'Grey Ghost',       Eyes: 'Right Look',       Mouth: 'Cigarette',        Hat: 'Construction Hat',    Prop: 'None',        Item: 'Hanging Chain',    price: '355000000000000000',  marketplace: PCS_MP, seller: S3, imgIdx: 23 },
];

const ghostsMockData = raw.map(makeGhost);
export default ghostsMockData;
