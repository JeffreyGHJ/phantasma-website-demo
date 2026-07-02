import { useEffect, useState } from 'react';

import { AbiItem } from 'ethereum-multicall/dist/esm/models';
import Web3 from 'web3';
import { activeNode } from '../../../Nodes';
import ectoRewardDistributorAbi from '../EctoRewardDistributorAbi';
import ectoTokenAbi from '.';
import { oldEctoContractAddress } from '../../../ContractAddresses';

const web3 = new Web3(activeNode);

const TokenContract = new web3.eth.Contract(
	ectoTokenAbi as AbiItem[],
	oldEctoContractAddress
);

export const useDividendDistributorAddress = () => {
	const [dividendDistributorAddress, setDividendDistributorAddress] =
		useState('');
	useEffect(() => {
		let mounted = true;
		(async () => {
			const _dividendDistributorAddress = await TokenContract.methods
				.dividendDistributor()
				.call();
			if (mounted) {
				setDividendDistributorAddress(_dividendDistributorAddress);
			}
		})();
		return () => {
			mounted = false;
		};
	}, []);

	return dividendDistributorAddress;
};

export const useDividendDistributorContract = () => {
	const dividendDistributorAddress = useDividendDistributorAddress();
	const [dividendDistributionContract, setDividendDistributionContract] =
		useState(null as any);
	useEffect(() => {
		if (!dividendDistributorAddress) {
			return;
		}
		setDividendDistributionContract(
			new web3.eth.Contract(
				ectoRewardDistributorAbi as AbiItem[],
				dividendDistributorAddress
			)
		);
	}, [dividendDistributorAddress]);

	return dividendDistributionContract;
};

export const useSwapThreshold = () => {
	const [swapThreshold, setSwapThreshold] = useState(BigInt(0));

	useEffect(() => {
		let mounted = true;
		(async () => {
			TokenContract.methods
				.swapThreshold()
				.call()
				.then((_balance) => {
					if (mounted) {
						setSwapThreshold(BigInt(_balance));
					}
				});
		})();
		return () => {
			mounted = false;
		};
	}, []);

	return swapThreshold;
};
