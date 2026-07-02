type AuctionedItem = {
	address: string;
	auctionID: number;
	bidOnly: number;
	biddingFeePaid: string;
	createdBy: string;
	endBlock: number;
	highestBidAmount: string;
	highestBidder: string;
	id: number;
	image_3d: string;
	image_gif: string;
	image_png: string;
	listingFeeAmount: string;
	minimumBidAmount: string;
	nft: string;
	paymentToken: string;
	price: string;
	rank: number;
	status: string;
	tokenID: number;
	token_image_ext: string;
};

export default AuctionedItem;
