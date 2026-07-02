import { useEffect, useState } from 'react';

import { AbiItem } from 'web3-utils';
import Web3 from 'web3';
import { activeNode } from '../../constants/Nodes';
import { fromSolidityTokenFormat } from '../../utils/MathUtil';
import genericErc20ABI from '../../constants/abis/genericErc20ABI';
import { isAddress } from '../../utils';

const web3 = new Web3(activeNode);

export const getBalanceOf = async ({
	account,
	tokenAddress,
	decimal,
}: {
	account: string;
	tokenAddress: string;
	decimal: number;
}): Promise<string> => {
	if (!isAddress(account) || !tokenAddress) {
		return '0';
	}

	const Erc20Contract = new web3.eth.Contract(
		genericErc20ABI as AbiItem[],
		tokenAddress
	);
	return Erc20Contract.methods
		.balanceOf(account)
		.call()
		.then((_balance) => {
			const decimalFormat = fromSolidityTokenFormat(_balance, decimal);
			return decimalFormat;
		});
};

export const useBalanceOf = ({
	account,
	tokenAddress,
	decimal,
}: {
	account: string;
	tokenAddress: string;
	decimal: number;
}) => {
	const [balance, setBalance] = useState('0');

	useEffect(() => {
		let mounted = true;

		getBalanceOf({
			account,
			tokenAddress,
			decimal,
		}).then((_balance) => {
			if (mounted) {
				setBalance(_balance);
			}
		});

		return () => {
			mounted = false;
		};
	}, [account, tokenAddress, decimal]);

	return balance;
};
