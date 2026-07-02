import Strategy from './Strategy';

type Proposal = {
	author: string;
	body: string;
	choices: Array<string>;
	created: number;
	end: number;
	id: string;
	ipfs: string;
	network: string;
	plugins: any;
	scores: Array<any>;
	scores_by_strategy: Array<any>;
	scores_state: string;
	scores_total: number;
	snapshot: string;
	space: {
		id: string;
		name: string;
	};
	start: number;
	state: string;
	strategies: Array<Strategy>;
	title: string;
	type: string;
	votes: number;
};

export default Proposal;
