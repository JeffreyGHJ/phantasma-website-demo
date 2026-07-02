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

export const getLootbox = async (
	id: number
): Promise<{
	id: number;
	requestID: string;
	randomWords: Array<string>;
	claimed: boolean;
}> => {
	return LootboxContract.methods
		.getLootbox(id)
		.call()
		.then((res) => {
			return {
				id: +res.id,
				requestID: res.requestId,
				randomWords: res.randomWords,
				claimed: res.claimed,
			};
		});
};

export const useLootbox = (id: number) => {
	const [lootbox, setLootbox] = useState<null | {
		id: number;
		requestID: string;
		randomWords: Array<string>;
		claimed: boolean;
	}>();

	useEffect(() => {
		let mounted = true;
		getLootbox(id).then((_lootbox) => {
			if (mounted) {
				setLootbox(_lootbox);
			}
		});

		return () => {
			mounted = false;
		};
	}, [id]);

	return lootbox;
};
