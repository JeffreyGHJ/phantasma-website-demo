import { createAction } from '@reduxjs/toolkit';

const updateUserWalletAddresses = createAction<{
	walletAddresses: Array<{ wallet_address: string }>;
}>('app/updateUserWalletAddresses');

export default updateUserWalletAddresses;
