/**
 * @deprecated check saleTypes.ts
 */
export const forSales = {
	ALL: 0,
	FOR_SALE: 1,
	NOT_FOR_SALE: 2,
	RECENTLY_SOLD: 3,
	AUCTION: 4,
};

/**
 * @deprecated
 */
export const forSaleMap = {
	[forSales.ALL]: 'all',
	[forSales.FOR_SALE]: 'for_sale',
	[forSales.NOT_FOR_SALE]: 'not_for_sale',
	[forSales.RECENTLY_SOLD]: 'recently_sold',
	[forSales.AUCTION]: 'auction',
};

/**
 * @deprecated
 */
export const getForSaleString = (id: number) => {
	return forSaleMap[id] || '';
};
