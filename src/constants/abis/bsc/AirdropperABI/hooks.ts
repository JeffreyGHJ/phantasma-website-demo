import {
	useHandleWeb3Error,
	useHandleWeb3Response,
} from '../../../../utils/Web3ResponseUtil';

import { AbiItem } from 'web3-utils';
import AirdropperABI from '.';
import { TransactionReceipt } from '@ethersproject/providers';
import Web3 from 'web3';
import { Web3Provider } from '@ethersproject/providers';
import { activeNode } from '../../../Nodes';
import { airdropperContractAddress } from '../../../ContractAddresses';
import { useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';

const web3 = new Web3(activeNode);

const AirdropperContract = new web3.eth.Contract(
	AirdropperABI as AbiItem[],
	airdropperContractAddress
);

export const useMigrateAll = () => {
	const { account, library } = useWeb3React<Web3Provider>();
	const handleWeb3Reponse = useHandleWeb3Response();
	const handleWeb3Error = useHandleWeb3Error();

	return useCallback(
		(callback: (receipt: TransactionReceipt) => void) => {
			const encoded = AirdropperContract.methods.migrate().encodeABI();
			library
				?.getSigner()
				.sendTransaction({
					from: account || '',
					to: airdropperContractAddress,
					value: 0,
					data: encoded,
				})
				.then((res) => {
					handleWeb3Reponse({
						waitingMessage:
							'Waiting for confirmations to migrate your ECTO tokens...',
						successMessage:
							'Your ECTO tokens are successfully migrated!',
						res,
						callback,
					});
				})
				.catch((err) => {
					handleWeb3Error({ err });
				});
		},
		[account, library, handleWeb3Reponse, handleWeb3Error]
	);
};
