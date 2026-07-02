interface CollectionItem {
	address: string;
	id: number;
	name: string;
	collection_total: number;
	image_3d: string;
	image_gif: string;
	image_png: string;
	rank: number;
	token_id: number;
	token_image_ext: string;
	trait_type_value: Record<string, string>;
	rankable: number;
	//for sale or auction
	price: string;
	seller?: string;
	//for sale
	marketplace?: string;
	//auction
	auctionID?: number;
	auction_price?: string;
	bidOnly?: number;
	biddingFeePaid?: string;
	createdBy?: string;
	endBlock?: number;
	highestBidAmount?: string;
	highestBidder?: string;
	listingFeeAmount?: string;
	minimumBidAmount?: string;
	nft?: string;
	paymentToken?: string;
	status?: string;
}

export default CollectionItem;
