import { getBalanceOf, useBalanceOf } from '../erc20/useBalanceOf';

import { ectoContractAddress } from '../../constants/ContractAddresses';

export const getEctoBalance = async ({
	account,
}: {
	account: string;
}): Promise<string> => {
	return getBalanceOf({
		account,
		tokenAddress: ectoContractAddress,
		decimal: 9,
	});
};

export const useEctoBalance = (account: string) => {
	const balance = useBalanceOf({
		account,
		tokenAddress: ectoContractAddress,
		decimal: 9,
	});

	return balance;
};
