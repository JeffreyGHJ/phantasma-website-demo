type Vote = {
	choice: number | Array<number> | Record<number, number>;
	created: number;
	id: string;
	ipfs: string;
	voter: string;
	vp: number;
	vp_by_strategy: Array<any>;
	totalCasts?: number;
	voteString?: string;
};

export default Vote;
