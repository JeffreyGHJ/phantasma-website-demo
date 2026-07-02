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

export const getTotalSupply = async (): Promise<number> => {
	return LootboxContract.methods.TOTAL_SUPPLY().call();
};

export const useTotalSupply = () => {
	const [totalSupply, setTotalSupply] = useState(0);

	useEffect(() => {
		let mounted = true;
		getTotalSupply().then((_count) => {
			if (mounted) {
				setTotalSupply(_count);
			}
		});

		return () => {
			mounted = false;
		};
	}, []);

	return totalSupply;
};
