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

export const getMintCount = async (account: string): Promise<number> => {
	return LootboxContract.methods.getMintCount(account).call();
};

export const useMintCount = (account: string) => {
	const [mintCount, setMintCount] = useState(0);

	useEffect(() => {
		if (account === '') {
			setMintCount(0);
			return () => {};
		}
		let mounted = true;
		getMintCount(account).then((_count) => {
			if (mounted) {
				setMintCount(_count);
			}
		});

		return () => {
			mounted = false;
		};
	}, [account]);

	return mintCount;
};
