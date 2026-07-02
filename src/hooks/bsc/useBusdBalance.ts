import { getBalanceOf, useBalanceOf } from '../erc20/useBalanceOf';

import { busdTokenAddress } from '../../constants/ContractAddresses';
import { isAddress } from '../../utils';

export const getBusdBalance = async (account: string) => {
	if (!isAddress(account)) {
		return '0';
	}

	return getBalanceOf({
		account,
		tokenAddress: busdTokenAddress,
		decimal: 18,
	});
};

export const useBusdBalance = (account: string) => {
	const balance = useBalanceOf({
		account,
		tokenAddress: busdTokenAddress,
		decimal: 18,
	});

	return balance;
};
