import { useEffect, useMemo, useState } from 'react';

import { AbiItem } from 'web3-utils';
import { Multicall } from 'ethereum-multicall';
import OwnedItem from '../state/application/types/OwnedItem';
import Web3 from 'web3';
import { activeNode } from '../constants/Nodes';
import { littleGhostsMarketContractAddress } from '../constants/ContractAddresses';
import littleGhostsNFTMarketABI from '../constants/abis/LittleGhostsNFTMarketABI';

const web3 = new Web3(activeNode);
const multicall = new Multicall({ web3Instance: web3, tryAggregate: true });

const useClaimableWbnbRewards = (
	account: string,
	ownedGhosts: Array<OwnedItem>,
	mintCount: number
) => {
	const [rewards, setRewards] = useState(0);

	const littleGhostsMarketContractCallContext = useMemo(() => {
		const context = [
			{
				reference: 'marketplace',
				contractAddress: littleGhostsMarketContractAddress,
				abi: littleGhostsNFTMarketABI,
				calls: [] as Array<{
					reference: string;
					methodName: string;
					methodParameters: Array<number>;
				}>,
			},
		];

		for (let i = 0; i < ownedGhosts.length; i++) {
			const tokenId = ownedGhosts[i].id;
			context[0].calls.push({
				reference: `getReflectionBalanceCall`,
				methodName: 'getReflectionBalance',
				methodParameters: [tokenId],
			});
		}

		return context;
	}, [ownedGhosts]);

	useEffect(() => {
		if (!account) {
			setRewards(0);
			return () => {};
		}

		const LittleGhostsMarketContract = new web3.eth.Contract(
			littleGhostsNFTMarketABI as AbiItem[],
			littleGhostsMarketContractAddress
		);
		let mounted = true;

		const promises = [
			multicall
				.call(littleGhostsMarketContractCallContext)
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
				}),
			LittleGhostsMarketContract.methods
				.getReflectionMintBalance(account, mintCount)
				.call()
				.then((mintBalance) => {
					mintBalance = parseInt(mintBalance);
					return mintBalance;
				}),
		];

		Promise.all(promises).then((results: Array<number>) => {
			const [holderRewards, minterRewards] = results;
			if (mounted) {
				setRewards(holderRewards + minterRewards);
			}
		});
		return () => {
			mounted = false;
		};
	}, [littleGhostsMarketContractCallContext, account, mintCount]);

	return rewards;
};

export default useClaimableWbnbRewards;
