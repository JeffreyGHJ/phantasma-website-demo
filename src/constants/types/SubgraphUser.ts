type SubgraphUser = {
	id: string;
	numberTokensListed?: string;
	numberTokensPurchased?: string;
	numberTokensSold?: string;
	totalVolumeInBNBTokensSold?: string;
	totalFeesCollectedInBNB?: string;
	averageTokenPriceInBNBPurchased?: string;
	averageTokenPriceInBNBSold?: string;
	buyTradeHistory?: any;
	sellTradeHistory?: any;
	askOrderHistory?: any;
};

export default SubgraphUser;
