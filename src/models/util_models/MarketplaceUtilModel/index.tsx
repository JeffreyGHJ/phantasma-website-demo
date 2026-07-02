import MarketplaceType from './types/MarketplaceType';

class MarketplaceUtilModel {
	static MARKETPLACE_FILTER_KEY = 'marketplaces';

	static MARKETPLACE_TYPES = {
		LG_MARKETPLACE: 'littleGhosts' as MarketplaceType,
		PANCAKESWAP: 'pancakeswap' as MarketplaceType,
	};

	static ALL_MARKETPLACE_TYPES = Object.values(
		MarketplaceUtilModel.MARKETPLACE_TYPES
	);
}

export default MarketplaceUtilModel;
