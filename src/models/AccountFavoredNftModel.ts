import BaseModel from './BaseModel';
import ModelAttributeType from './types/ModelAttributeType';
import NftCollectionModel from './NftCollectionModel';

class AccountFavoredNftModel extends BaseModel {
	account_id?: number;
	nft_collection_id?: number;
	nft_token_id?: number;

	static url = 'account/favorites';

	static recaptcha = true;

	static attributes = {
		id: {
			type: ModelAttributeType.NUMBER,
		},
		account_id: {
			type: ModelAttributeType.NUMBER,
		},
		nft_collection_id: {
			type: ModelAttributeType.NUMBER,
			validations: {
				required: true,
				between: {
					inclusive: true,
					start: 1,
					end: 4,
				},
			},
		},
		nft_token_id: {
			type: ModelAttributeType.NUMBER,
			validations: {
				required: true,
				isValid: ({
					attr,
					value,
					item,
				}: {
					attr: string;
					value: any;
					item: AccountFavoredNftModel;
				}) => {
					if (!item.nft_collection_id) {
						throw new Error('Collection id is null');
					}

					const collectionTotal =
						NftCollectionModel.getCollectionTotal({
							id: item.nft_collection_id as number,
						});
					if (value < 0 || value >= collectionTotal) {
						throw new Error('Invalid collection token id');
					}
				},
			},
		},
	};

	constructor(args) {
		super(args);

		const keys = Object.keys(args);
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			this[key] = args[key];
		}
	}
}

export default AccountFavoredNftModel;
