type Strategy = {
	name: string;
	params: {
		address: string;
		decimals?: number;
		symbol: string;
	};
};

export default Strategy;
