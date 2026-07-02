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

export const getTotalOpened = async (): Promise<number> => {
	return LootboxContract.methods.TOTAL_OPEN().call();
};

export const useTotalOpened = () => {
	const [openCount, setOpenCount] = useState(0);

	useEffect(() => {
		let mounted = true;
		getTotalOpened().then((_count) => {
			if (mounted) {
				setOpenCount(_count);
			}
		});

		return () => {
			mounted = false;
		};
	}, []);

	return openCount;
};
