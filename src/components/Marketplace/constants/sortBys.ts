export const sortBys = {
	LOWEST_PRICE: 1,
	HIGHEST_PRICE: 2,
	LOWEST_ID: 3,
	HIGHEST_ID: 4,
	LOWEST_RANK: 5,
	HIGHEST_RANK: 6,
	LATEST: 7,
	LOWEST_BID: 8,
	HIGHEST_BID: 9,
	EXPIRE_DESC: 10,
	EXPIRE_ASC: 11,
};

export const sortByMap = {
	[sortBys.LOWEST_PRICE]: 'lowest_price',
	[sortBys.HIGHEST_PRICE]: 'highest_price',
	[sortBys.LOWEST_ID]: 'lowest_id',
	[sortBys.HIGHEST_ID]: 'highest_id',
	[sortBys.LOWEST_RANK]: 'lowest_rank',
	[sortBys.HIGHEST_RANK]: 'highest_rank',
	[sortBys.LATEST]: 'latest',
};

export const sortByInverseMap = {
	lowest_price: sortBys.LOWEST_PRICE,
	highest_price: sortBys.HIGHEST_PRICE,
	lowest_id: sortBys.LOWEST_ID,
	highest_id: sortBys.HIGHEST_ID,
	lowest_rank: sortBys.LOWEST_RANK,
	highest_rank: sortBys.HIGHEST_RANK,
	latest: sortBys.LATEST,
};

export const getSortByString = (id: number) => {
	return sortByMap[id] || '';
};
