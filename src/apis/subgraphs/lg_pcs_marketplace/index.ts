// The Graph API (api.thegraph.com) is no longer accessible.
// All subgraph functions return static mock data from subgraphMockData.ts.

import {
    mock24hTransactions,
    mockCollectionData,
    mockDayData,
} from '../../../mocks/subgraphMockData';

type Marketplace = 'littleghosts' | 'pancakeswap';

export const fetchCollectionData = async ({
    marketplace,
    collectionAddress,
}: {
    collectionAddress: string;
    marketplace: Marketplace;
}) => {
    const addr = collectionAddress.toLowerCase();
    const data = mockCollectionData[marketplace]?.[addr] ?? null;
    return data;
};

export const fetchCollectionDayData = async ({
    marketplace,
    collectionAddress,
    from,
    to,
}: {
    collectionAddress: string;
    marketplace: Marketplace;
    from: number;
    to: number;
}) => {
    const addr   = collectionAddress.toLowerCase();
    const source = mockDayData[marketplace]?.[addr];
    if (!source) return [];
    const daysRange = to - from;
    // Return 7-day data for ≤7-day windows, 30-day otherwise
    return daysRange <= 7 * 86400 + 3600 ? source.days7 : source.days30;
};

export const fetchTransactionData = async ({
    marketplace,
    collectionAddress,
    from,
    to,
}: {
    collectionAddress: string;
    marketplace: Marketplace;
    from: number;
    to: number;
}) => {
    const addr = collectionAddress.toLowerCase();
    return mock24hTransactions[marketplace]?.[addr] ?? [];
};
