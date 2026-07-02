import { getBalanceOf, useBalanceOf } from '../erc20/useBalanceOf';

import { oldEctoContractAddress } from '../../constants/ContractAddresses';

export const getOldEctoBalance = async ({
	account,
}: {
	account: string;
}): Promise<string> => {
	return getBalanceOf({
		account,
		tokenAddress: oldEctoContractAddress,
		decimal: 9,
	});
};

export const useOldEctoBalance = (account: string) => {
	const balance = useBalanceOf({
		account,
		tokenAddress: oldEctoContractAddress,
		decimal: 9,
	});

	return balance;
};
