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

export const isLootboxApprovedForClaim = async ({
	account,
}: {
	account: string;
}): Promise<boolean> => {
	return LootboxContract.methods
		.isApprovedForAll(account, lootboxContractAddress)
		.call();
};

export const useIsLootboxApprovedForClaim = (account: string) => {
	const [isLootboxApproved, setIsLootboxApproved] = useState(false);

	useEffect(() => {
		isLootboxApprovedForClaim({ account }).then((approved) => {
			setIsLootboxApproved(approved);
		});
	}, [account]);

	return isLootboxApproved;
};
