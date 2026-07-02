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

export const getHasSaleStarted = async (): Promise<boolean> => {
	return LootboxContract.methods.hasSaleStarted().call();
};

export const useHasSaleStarted = () => {
	const [saleStarted, setSaleStarted] = useState(false);

	useEffect(() => {
		getHasSaleStarted().then((_started) => {
			setSaleStarted(_started);
		});
	}, []);

	return saleStarted;
};
