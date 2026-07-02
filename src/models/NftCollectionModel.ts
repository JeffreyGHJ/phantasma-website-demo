import BaseModel from './BaseModel';
import RouteUtilModel from './util_models/RouteUtilModel';

class NftCollectionModel extends BaseModel {
	static LITTLEGHOSTS = 1;
	static ECTOSKELETONS = 2;
	static FOUNDERS_LOOTBOXES = 3;
	static FOUNDERS_ITEMS = 4;

	static ASSETS = {
		LITTLEGHOSTS: RouteUtilModel.MARKETPLACE_ITEM_GHOST_URI,
		ECTOSKELETONS: RouteUtilModel.MARKETPLACE_ITEM_SKELETON_URI,
		FOUNDERS_LOOTBOXES: RouteUtilModel.MARKETPLACE_ITEM_FOUNDER_LOOTBOX_URI,
		FOUNDERS_ITEMS: RouteUtilModel.MARKETPLACE_ITEM_FOUNDER_ITEM_URI,
	};

	static getCollectionIdByAsset({ asset }: { asset: string }) {
		switch (asset) {
			case NftCollectionModel.ASSETS.LITTLEGHOSTS: {
				return NftCollectionModel.LITTLEGHOSTS;
			}

			case NftCollectionModel.ASSETS.ECTOSKELETONS: {
				return NftCollectionModel.ECTOSKELETONS;
			}

			case NftCollectionModel.ASSETS.FOUNDERS_LOOTBOXES: {
				return NftCollectionModel.FOUNDERS_LOOTBOXES;
			}

			case NftCollectionModel.ASSETS.FOUNDERS_ITEMS: {
				return NftCollectionModel.FOUNDERS_ITEMS;
			}
		}

		throw new Error('Invalid asset');
	}

	static getCollectionTotal({ id }: { id: number }) {
		switch (id) {
			case NftCollectionModel.LITTLEGHOSTS: {
				return 10000;
			}

			case NftCollectionModel.ECTOSKELETONS: {
				return 2500;
			}

			case NftCollectionModel.FOUNDERS_LOOTBOXES: {
				return 10000;
			}

			case NftCollectionModel.FOUNDERS_ITEMS: {
				return 21021;
			}
		}

		throw new Error('Invalid collection ID');
	}
}

export default NftCollectionModel;
