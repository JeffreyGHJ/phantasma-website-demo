import Strategy from './Strategy';

type Space = {
	about: string;
	admins: Array<string>;
	avatar: string;
	categories: Array<string>;
	domain: any;
	filters: {
		minScore: number; //Min Holdings
		onlyMembers: boolean;
	};
	followersCount: number;
	github: string;
	id: string;
	members: Array<any>;
	name: string;
	network: string;
	plugins: any;
	private: boolean;
	skin: any;
	strategies: Array<Strategy>;
	symbol: string;
	terms: any;
	twitter: string;
	validation: {
		name: string;
		params: any;
	};
	voting: {
		delay: number | null;
		hideAbstain: boolean | null;
		period: number | null;
		quorum: any;
		type: any;
	};
};

export default Space;
