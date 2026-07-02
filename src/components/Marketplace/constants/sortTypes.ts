export const sortTypes = {
	LOWEST_PRICE: 'lowestPrice',
	HIGHEST_PRICE: 'highestPrice',
	LOWEST_ID: 'lowestID',
	HIGHEST_ID: 'highestID',
	LOWEST_RANK: 'lowestRank',
	HIGHEST_RANK: 'highestRank',
	LOWEST_BID: 'lowestBid',
	HIGHEST_BID: 'highestBid',
	EXPIRE_DESC: 'expireDesc',
	EXPIRE_ASC: 'expireAsc',
	LATEST: 'latest',
};

export const saleSortTypes = {
	LOWEST_PRICE: sortTypes.LOWEST_PRICE,
	HIGHEST_PRICE: sortTypes.HIGHEST_PRICE,
	LOWEST_ID: sortTypes.LOWEST_ID,
	HIGHEST_ID: sortTypes.HIGHEST_ID,
	LOWEST_RANK: sortTypes.LOWEST_RANK,
	HIGHEST_RANK: sortTypes.HIGHEST_RANK,
};

export const auctionSortTypes = {
	LOWEST_BID: sortTypes.LOWEST_BID,
	HIGHEST_BID: sortTypes.HIGHEST_BID,
	EXPIRE_DESC: sortTypes.EXPIRE_DESC,
	EXPIRE_ASC: sortTypes.EXPIRE_ASC,
	LOWEST_ID: sortTypes.LOWEST_ID,
	HIGHEST_ID: sortTypes.HIGHEST_ID,
	LOWEST_RANK: sortTypes.LOWEST_RANK,
	HIGHEST_RANK: sortTypes.HIGHEST_RANK,
	LATEST: sortTypes.LATEST,
};

export const allSaleSortTypes = Object.values(saleSortTypes);
export const allAuctionSortTypes = Object.values(auctionSortTypes);
export const sharedSortTypes = allSaleSortTypes.filter((type) => {
	return allAuctionSortTypes.includes(type);
});
export const allSortTypes = Object.values(sortTypes);
