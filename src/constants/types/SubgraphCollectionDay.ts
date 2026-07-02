import SubgraphCollection from './SubgraphCollection';

type SubgraphCollectionDay = {
	id: string;
	date: number;
	collection: SubgraphCollection;
	dailyVolumeBNB: string;
	dailyTrades: string;
};

export default SubgraphCollectionDay;
