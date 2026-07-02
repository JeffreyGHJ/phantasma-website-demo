import { getBalanceOf, useBalanceOf } from '../erc20/useBalanceOf';

import { isAddress } from '../../utils';
import { wbnbTokenAddress } from '../../constants/ContractAddresses';

export const getWbnbBalance = async (account: string) => {
	if (!isAddress(account)) {
		return '0';
	}

	return getBalanceOf({
		account,
		tokenAddress: wbnbTokenAddress,
		decimal: 18,
	});
};

export const useWbnbBalance = (account: string) => {
	const balance = useBalanceOf({
		account,
		tokenAddress: wbnbTokenAddress,
		decimal: 18,
	});

	return balance;
};
