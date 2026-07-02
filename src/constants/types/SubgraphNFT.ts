import SubgraphCollection from './SubgraphCollection';

type SubgraphNft = {
	id: string;
	tokenId?: string;
	collection?: SubgraphCollection;
	metadataUrl?: string;
	updatedAt?: string;
	currentAskPrice?: string;
	currentSeller?: string;
	latestTradedPriceInBNB?: string;
	tradeVolumeBNB?: string;
	totalTrades?: string;
	transactionHistory?: any;
	askHistory?: any;
	isTradable?: boolean;
};

export default SubgraphNft;
