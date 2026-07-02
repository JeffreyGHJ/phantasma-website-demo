import SubgraphCollection from '../../../constants/types/SubgraphCollection';
import SubgraphCollectionDay from '../../../constants/types/SubgraphCollectionDay';
import SubgraphTransaction from '../../../constants/types/SubgraphTransaction';
import axios from 'axios';

type Marketplace = 'littleghosts' | 'pancakeswap';

const getApi = (marketplace: Marketplace) => {
	return marketplace === 'littleghosts'
		? 'https://api.thegraph.com/subgraphs/name/relaxedleaf/marketplace'
		: 'https://api.thegraph.com/subgraphs/name/pancakeswap/nft-market';
};

export const fetchCollectionData = async ({
	marketplace,
	collectionAddress,
}: {
	collectionAddress: string;
	marketplace: Marketplace;
}) => {
	const api = getApi(marketplace);
	const res = (await axios.post(api, {
		query: `{
                collections(where: {
						id: "${collectionAddress}"
					}
				){
					id
					name
					symbol
					active
					totalTrades
					totalVolumeBNB
					numberTokensListed
					creatorAddress
					tradingFee
					whitelistChecker
                }
            }`,
		variables: null,
	})) as {
		data: {
			data: {
				collections: Array<SubgraphCollection>;
			};
		};
	};

	if (res.data && res.data.data.collections.length) {
		return res.data.data.collections[0];
	}
	return null;
};

export const fetchCollectionDayData = async ({
	marketplace,
	collectionAddress,
	from,
	to,
}: {
	collectionAddress: string;
	marketplace: Marketplace;
	from: number;
	to: number;
}) => {
	const api = getApi(marketplace);
	const res = (await axios.post(api, {
		query: `{
				collectionDayDatas(where: {
						collection: "${collectionAddress}"
						date_gte: ${from}
						date_lte: ${to}
					}
				){
					id
					date
					dailyVolumeBNB
					dailyTrades
                }
            }`,
		variables: null,
	})) as {
		data: {
			data: {
				collectionDayDatas: Array<SubgraphCollectionDay>;
			};
		};
	};

	if (res.data) {
		return res.data.data.collectionDayDatas;
	}
	return [];
};

export const fetchTransactionData = async ({
	marketplace,
	collectionAddress,
	from,
	to,
}: {
	collectionAddress: string;
	marketplace: Marketplace;
	from: number;
	to: number;
}) => {
	const max = 1000;
	const api = getApi(marketplace);

	const getResult = async (skip: number) => {
		const res = (await axios.post(api, {
			query: `{
				transactions(
						first: ${max},
						skip: ${skip},
						where: {
							collection: "${collectionAddress}"
							timestamp_gte: "${from}"
							timestamp_lte: "${to}"
						}
					){
						id
						timestamp
						askPrice
						netPrice
						withBNB
					}
				}`,
			variables: null,
		})) as {
			data: {
				data: {
					transactions: Array<SubgraphTransaction>;
				};
			};
		};
		return res;
	};
	let results = [] as Array<SubgraphTransaction>;
	let skip = 0;
	while (true) {
		const res = await getResult(skip);
		if (res.data) {
			results = results.concat(res.data.data.transactions);
			if (res.data.data.transactions.length === 1000) {
				skip += max;
				continue;
			}
		}
		break;
	}
	return results;
};
