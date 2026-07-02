import UserWalletAddress from '../../../models/AccountModel/types/WalletAddress';
import updateUserWalletAddresses from '../actions/user/updateUserWalletAddresses';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

export const useUpdateUserAddresses = (): ((
	walletAddresses: Array<UserWalletAddress>
) => void) => {
	const dispatch = useDispatch();
	return useCallback(
		(walletAddresses) =>
			dispatch(updateUserWalletAddresses({ walletAddresses })),
		[dispatch]
	);
};
