// Central mock service — applies pagination, filtering, and sorting to static mock arrays.
// Used by web.api.ts when REACT_APP_API is not set.

import ghostsMockData from './ghostsMockData';
import ectoSkeletonsMockData from './ectoSkeletonsMockData';
import recentlySoldMockData from './recentlySoldMockData';
import founderItemsMockData, { lootboxMockData } from './founderItemsMockData';

const LG_ADDR   = '0x98f606a4cdde68b9f68732d21fb9ba8b5510ee48';
const ECTO_ADDR  = '0x0fa48f20dddcf6ed724a36381f66c3e905fe7988';
const FI_ADDR    = '0x0e1dd95fb252542e9a18730914c209194be9fa8e';
const LB_ADDR    = '0xaa34fd88eec8c667433b064806e479b1eb2d316c';
const LG_MARKET  = '0x12492e327c49bc2f7df86d1d96752b9af1dfe2e1';
const PCS_MARKET = '0x17539cca21c7933df5c980172d22659b8c345c5a';

function collectionMockData(collection: string): any[] {
  const addr = collection.toLowerCase();
  if (addr === LG_ADDR)   return ghostsMockData;
  if (addr === ECTO_ADDR)  return ectoSkeletonsMockData;
  if (addr === FI_ADDR)    return founderItemsMockData;
  if (addr === LB_ADDR)    return lootboxMockData;
  return [];
}

export type CollectionItemsParams = {
  limit?:      number;
  offset?:     number;
  saleType?:   string;
  sortType?:   string;
  filters?:    Record<string, string[]>;
};

export function getMockCollectionItems(
  marketplace: string,
  collection: string,
  params: CollectionItemsParams = {},
) {
  const { limit = 24, offset = 0, saleType, sortType, filters } = params;
  let items = [...collectionMockData(collection)];

  // Marketplace filter
  if (marketplace && marketplace !== 'all') {
    items = items.filter(item => {
      if (!item.marketplace) return true; // unlisted — visible in all/notForSale
      return item.marketplace.toLowerCase() === marketplace.toLowerCase();
    });
  }

  // Sale-type filter
  if (saleType === 'forSale') {
    items = items.filter(item => !!item.price);
  } else if (saleType === 'notForSale') {
    items = items.filter(item => !item.price);
  } else if (saleType === 'auction') {
    items = items.filter(item => item.auctionID != null);
  }
  // 'all' → no filter

  // Trait filters — each key must match if any values are selected
  if (filters) {
    const activeFilters = Object.entries(filters).filter(([, vals]) => vals && vals.length > 0);
    if (activeFilters.length > 0) {
      items = items.filter(item =>
        activeFilters.every(([key, values]) => {
          const traitVal = item.trait_type_value?.[key];
          return traitVal != null && values.includes(traitVal);
        }),
      );
    }
  }

  // Sort
  if (sortType === 'lowestPrice') {
    items.sort((a, b) => {
      const pa = a.price ? BigInt(a.price) : BigInt('999999999999999999999');
      const pb = b.price ? BigInt(b.price) : BigInt('999999999999999999999');
      return pa < pb ? -1 : pa > pb ? 1 : 0;
    });
  } else if (sortType === 'highestPrice') {
    items.sort((a, b) => {
      const pa = a.price ? BigInt(a.price) : BigInt(0);
      const pb = b.price ? BigInt(b.price) : BigInt(0);
      return pa > pb ? -1 : pa < pb ? 1 : 0;
    });
  } else if (sortType === 'highestRank' || sortType === 'lowestRank') {
    // "highestRank" in UI means lowest numeric rank number (rarer)
    items.sort((a, b) => sortType === 'highestRank' ? a.rank - b.rank : b.rank - a.rank);
  } else if (sortType === 'lowestID') {
    items.sort((a, b) => a.id - b.id);
  } else if (sortType === 'highestID') {
    items.sort((a, b) => b.id - a.id);
  }

  const total_rows = items.length;
  const pages = Math.max(1, Math.ceil(total_rows / limit));
  const data = items.slice(offset, offset + limit);

  return { data, total_rows, pages };
}

export type RecentlySoldParams = {
  limit?:  number;
  offset?: number;
};

export function getMockRecentlySold(
  marketplace: string,
  collection: string,
  params: RecentlySoldParams = {},
) {
  const { limit = 24, offset = 0 } = params;
  const addr = collection.toLowerCase();

  let items = recentlySoldMockData.filter(
    item => item.collection_address.toLowerCase() === addr,
  );

  // marketplace filter for recently sold uses lowercase 'littleghosts'/'pancakeswap'/'all'
  if (marketplace && marketplace !== 'all') {
    const isLg  = marketplace === 'littleghosts';
    items = items.filter(item => {
      const isSoldOnLg = item.marketplace_address.toLowerCase() === LG_MARKET;
      return isLg ? isSoldOnLg : !isSoldOnLg;
    });
  }

  const total_rows = items.length;
  const pages = Math.max(1, Math.ceil(total_rows / limit));
  const data = items.slice(offset, offset + limit);

  return { data, total_rows, pages };
}
