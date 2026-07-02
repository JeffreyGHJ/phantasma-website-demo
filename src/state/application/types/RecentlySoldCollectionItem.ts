type RecentlySoldCollectionItem = {
	transaction_hash: string;
	ask_price: string;
	blockchain_id: number;
	buyer: string;
	collection_address: string;
	collection_total: number;
	collection_name: string;
	id: number;
	image_3d: string;
	image_gif: string;
	image_png: string;
	marketplace_address: string;
	net_price: string;
	nft_collection_id: 1;
	nft_id: number;
	rank: number;
	seller: string;
	timestamp: number;
	token_image_ext: string;
	trait_type_value: Record<string, string>;
};

export default RecentlySoldCollectionItem;
