import {
	handleWeb3Error,
	handleWeb3Reponse,
} from '../../../../utils/Web3ResponseUtil';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { AbiItem } from 'web3-utils';
import { Multicall } from 'ethereum-multicall';
import Web3 from 'web3';
import { Web3Provider } from '@ethersproject/providers';
import { activeNode } from '../../../Nodes';
import { pancakeNFTRewardContractAddress } from '../../../ContractAddresses';
import pancakeswapNftMarketplaceRewardAbi from '.';
import { useWeb3React } from '@web3-react/core';

const web3 = new Web3(activeNode);
const multicall = new Multicall({ web3Instance: web3, tryAggregate: true });

const PancakeswapNftMarketplaceRewardContract = new web3.eth.Contract(
	pancakeswapNftMarketplaceRewardAbi as AbiItem[],
	pancakeNFTRewardContractAddress
);

export const useMintCount = (account: string) => {
	const [mintCount, setMintCount] = useState(0);

	const getMintCount = useCallback(async () => {
		if (!account) {
			return 0;
		}
		const mintCount = await PancakeswapNftMarketplaceRewardContract.methods
			.getMintCount(account)
			.call();
		return mintCount;
	}, [account]);

	useEffect(() => {
		let mounted = true;
		getMintCount().then((_mintCount) => {
			if (mounted) {
				setMintCount(_mintCount);
			}
		});
		return () => {
			mounted = false;
		};
	}, [account, getMintCount]);

	return mintCount;
};

export const useReflectionBalance = (tokenIds: Array<number>) => {
	const [balance, setBalance] = useState('0');
	const [fetching, setFetching] = useState(true);
	const pancakeswapMarketContractCallContext = useMemo(() => {
		if (!tokenIds.length) {
			return [];
		}
		return [
			{
				reference: 'marketplace',
				contractAddress: pancakeNFTRewardContractAddress,
				abi: pancakeswapNftMarketplaceRewardAbi,
				calls: tokenIds.map((tokenId) => {
					return {
						reference: 'getReflectionBalanceCall',
						methodName: 'getReflectionBalance',
						methodParameters: [tokenId],
					};
				}),
			},
		];
	}, [tokenIds]);

	const getBalance = useCallback(async () => {
		if (!tokenIds.length) {
			return '0';
		}
		const _balance = await multicall
			.call(pancakeswapMarketContractCallContext)
			.then((response) => {
				let totalBalance = 0;
				if (response.results.marketplace) {
					response.results.marketplace.callsReturnContext.forEach(
						(ctx) => {
							const value = web3.utils.hexToNumber(
								ctx.returnValues[0].hex
							);
							totalBalance += value;
						}
					);
				}
				return totalBalance;
			});

		return web3.utils.fromWei(_balance.toString());
	}, [tokenIds, pancakeswapMarketContractCallContext]);

	useEffect(() => {
		let mounted = true;

		setFetching(true);
		getBalance().then((_balance) => {
			if (mounted) {
				setBalance(_balance);
				setFetching(false);
			}
		});
		return () => {
			mounted = false;
		};
	}, [tokenIds, getBalance]);

	return {
		reflectionBalance: balance,
		setReflectionBalance: setBalance,
		fetching,
	};
};

export const useMintBalance = ({
	account,
	mintCount,
}: {
	account: string;
	mintCount: number;
}) => {
	const [balance, setBalance] = useState('0');

	const getMintBalance = useCallback(async () => {
		if (!account || !mintCount) {
			return '0';
		}
		const mintBalance =
			await PancakeswapNftMarketplaceRewardContract.methods
				.getReflectionMintBalance(account, mintCount)
				.call();

		return web3.utils.fromWei(mintBalance.toString());
	}, [account, mintCount]);

	useEffect(() => {
		let mounted = true;
		getMintBalance().then((_mintBalance) => {
			if (mounted) {
				setBalance(_mintBalance);
			}
		});
		return () => {
			mounted = false;
		};
	}, [account, getMintBalance]);

	return {
		mintBalance: balance,
		setMintBalance: setBalance,
	};
};

export const useClaimRewards = (callback: (receipt) => void) => {
	const { account, library } = useWeb3React<Web3Provider>();

	return useCallback(() => {
		const encoded = PancakeswapNftMarketplaceRewardContract.methods
			.claimRewards()
			.encodeABI();
		library
			?.getSigner()
			.sendTransaction({
				from: account || '',
				to: pancakeNFTRewardContractAddress,
				value: 0,
				data: encoded,
			})
			.then((res) => {
				handleWeb3Reponse({
					waitingMessage: 'Waiting for confirmations...',
					successMessage: 'Rewards have been claimed successfully!',
					res,
					callback,
				});
			})
			.catch((err) => {
				handleWeb3Error(err);
			});
	}, [account, library, callback]);
};
