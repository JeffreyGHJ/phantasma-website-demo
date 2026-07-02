type NftOffer = {
	buyer: string;
	nftOfferId: number;
	soldNftAddress: string;
	soldNftIds: Array<number>;
	status: string;
	wantedNftAddress: string;
	wantedNftId: number;
	index: number;
	nftInfo: {
		address: string;
		image_gif: string;
		image_png: string;
		image_3d: string;
		name: string;
		rank: number;
		token_id: number;
		token_image_ext: string;
		token_offer_id: number;
	};
};

export default NftOffer;
