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

export const getTotalMinted = async (): Promise<number> => {
	return LootboxContract.methods.totalSupply().call();
};

export const useTotalMinted = () => {
	const [mintCount, setMintCount] = useState(0);

	useEffect(() => {
		let mounted = true;
		getTotalMinted().then((_count) => {
			if (mounted) {
				setMintCount(_count);
			}
		});

		return () => {
			mounted = false;
		};
	}, []);

	return mintCount;
};
