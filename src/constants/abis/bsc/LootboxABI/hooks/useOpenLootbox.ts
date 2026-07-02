import {
	useHandleWeb3Error,
	useHandleWeb3Response,
} from '../../../../../utils/Web3ResponseUtil';

import { AbiItem } from 'web3-utils';
import LootboxABI from '..';
import { TransactionReceipt } from '@ethersproject/providers';
import Web3 from 'web3';
import { Web3Provider } from '@ethersproject/providers';
import { activeNode } from '../../../../Nodes';
import { lootboxContractAddress } from '../../../../ContractAddresses';
import { useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';

const web3 = new Web3(activeNode);

const LootboxContract = new web3.eth.Contract(
	LootboxABI as AbiItem[],
	lootboxContractAddress
);

export const useOpenLootbox = () => {
	const { account, library } = useWeb3React<Web3Provider>();
	const handleWeb3Reponse = useHandleWeb3Response();
	const handleWeb3Error = useHandleWeb3Error();

	return useCallback(
		({
			lootboxes,
			callback,
			errorCallback,
		}: {
			lootboxes: Array<number>;
			callback: (receipt: TransactionReceipt) => void;
			errorCallback?: () => void;
		}) => {
			const encoded = LootboxContract.methods
				.openLootBoxes(lootboxes)
				.encodeABI();
			library
				?.getSigner()
				.sendTransaction({
					from: account || '',
					to: lootboxContractAddress,
					value: 0,
					data: encoded,
				})
				.then((res) => {
					handleWeb3Reponse({
						waitingMessage: `Waiting for confirmations to open Lootbox #${lootboxes.join(
							', '
						)}`,
						successMessage: `Successfully opened Lootbox #${lootboxes.join(
							', '
						)}`,
						res,
						callback,
					});
				})
				.catch((err) => {
					handleWeb3Error({ err, callback: errorCallback });
				});
		},
		[account, library, handleWeb3Error, handleWeb3Reponse]
	);
};
