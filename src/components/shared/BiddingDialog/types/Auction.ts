type Auction = {
	auctionID: number;
	bidOnly: boolean;
	biddingFeePaid: string;
	createdBy: string;
	endBlock: number;
	highestBidAmount: number;
	highestBidder: string;
	id: number;
	listingFeeAmoung: number;
	minimumBidAmount: number;
	nft: string;
	paymentToken: string;
	price: number;
	status: string;
	tokenID: number;
};

export default Auction;
