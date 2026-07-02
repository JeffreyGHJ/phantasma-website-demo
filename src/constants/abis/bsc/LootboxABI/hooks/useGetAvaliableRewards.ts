import { useEffect, useState } from 'react';

import { AbiItem } from 'web3-utils';
import LootboxABI from '..';
import Web3 from 'web3';
import { activeNode } from '../../../../Nodes';
import { lootboxContractAddress } from '../../../../ContractAddresses';

const web3 = new Web3(activeNode);

const LootboxContract = new web3.eth.Contract(
	LootboxABI as AbiItem[],
	lootboxContractAddress
);

export const getAvaliableRewards = async (): Promise<{
	foundersItems: Array<number>;
	littleGhosts: number;
	ectoSkeletons: number;
}> => {
	return LootboxContract.methods
		.getAvaliableItems()
		.call()
		.then((res) => {
			return {
				foundersItems: res.foundersItems,
				littleGhosts: res.littleGhosts,
				ectoSkeletons: res.ectoSkeletons,
			};
		});
};

export const useGetAvaliableRewards = () => {
	const [avaliableRewards, setAvaliableRewards] = useState<null | {
		foundersItems: Array<number>;
		littleGhosts: number;
		ectoSkeletons: number;
	}>();

	useEffect(() => {
		let mounted = true;
		getAvaliableRewards().then((_rewards) => {
			if (mounted) {
				setAvaliableRewards(_rewards);
			}
		});

		return () => {
			mounted = false;
		};
	}, []);

	return avaliableRewards;
};
