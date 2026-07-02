import MarketplaceType from '../../../models/util_models/MarketplaceUtilModel/types/MarketplaceType';

export interface SingleCollectionItemAuction {
	auctionID: number;
	bidOnly: number;
	biddingFeePaid: string;
	createdBy: string;
	endBlock: number;
	highestBidAmount: string;
	highestBidder: string;
	minimumBidAmount: string;
	nft: string;
	paymentToken: string;
	price: string;
	status: string;
	tokenID: string;
}

export interface SingleCollectionItem {
	address: string;
	attributes: Record<
		string,
		{
			trait_value: string;
			trait_count: number;
		}
	>;
	auction?: SingleCollectionItemAuction;
	id: number;
	token_id: number;
	name: string;
	image_3d: string;
	image_gif: string;
	image_png: string;
	rank: number;
	rankable: number;
	token_image_ext: string;
	collection_total: number;
	marketplace?: MarketplaceType;
	seller?: string;
	price?: string;
}
