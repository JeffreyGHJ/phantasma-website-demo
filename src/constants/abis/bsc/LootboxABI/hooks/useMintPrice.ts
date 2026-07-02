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

export const getMintPrice = async (): Promise<string> => {
	return LootboxContract.methods.MINT_PRICE().call();
};

export const useMintPrice = () => {
	const [mintPrice, setMintPrice] = useState('0');

	useEffect(() => {
		let mounted = true;
		getMintPrice().then((_mintPrice) => {
			if (mounted) {
				setMintPrice(_mintPrice);
			}
		});

		return () => {
			mounted = false;
		};
	}, []);

	return mintPrice;
};
