import { useEffect, useState } from 'react';

import { AbiItem } from 'web3-utils';
import Web3 from 'web3';
import { activeNode } from '../constants/Nodes';
import { littleGhostsMarketContractAddress } from '../constants/ContractAddresses';
import littleGhostsNFTMarketABI from '../constants/abis/LittleGhostsNFTMarketABI';

const web3 = new Web3(activeNode);

const useGhostsMintCount = (account: string) => {
	const [count, setCount] = useState(0);

	useEffect(() => {
		if (!account) {
			setCount(0);
			return () => {};
		}
		const LittleGhostsMarketplaceContract = new web3.eth.Contract(
			littleGhostsNFTMarketABI as AbiItem[],
			littleGhostsMarketContractAddress
		);
		let mounted = true;
		LittleGhostsMarketplaceContract.methods
			.getMintCount(account)
			.call()
			.then((_count: number) => {
				if (mounted) {
					setCount(_count);
				}
			});

		return () => {
			mounted = false;
		};
	}, [account]);

	return count;
};

export default useGhostsMintCount;
