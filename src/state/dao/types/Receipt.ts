type Receipt = {
	id: string;
	ipfs: string;
	relayer: {
		address: string;
		receipt: string;
	};
};

export default Receipt;
