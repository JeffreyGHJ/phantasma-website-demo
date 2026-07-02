import { supportedNetworks } from '../constants/Blockchains';
import { useCallback } from 'react';
import { useSnackbar } from 'notistack';

declare let window: any;

const useChangeChain = () => {
	const { enqueueSnackbar } = useSnackbar();

	return useCallback(
		async (blockchainID: number) => {
			try {
				if (!window.ethereum) throw new Error('No provider was found');
				await window.ethereum.request({
					method: 'wallet_switchEthereumChain',
					params: [
						{ chainId: `0x${Number(blockchainID).toString(16)}` },
					],
				});
			} catch (err: any) {
				console.log(err.message);
				if (err.message.indexOf('Unrecognized chain ID') !== -1) {
					try {
						await window.ethereum.request({
							method: 'wallet_addEthereumChain',
							params: [supportedNetworks[blockchainID]],
						});
					} catch (error: any) {
						if (
							error.message ===
							'May not specify default MetaMask chain.'
						) {
							error.message =
								'Please mannually switch to Ethereum Chain';
						}
						enqueueSnackbar(error.message, { variant: 'error' });
					}
					return;
				}
				if (err.message === 'May not specify default MetaMask chain.') {
					err.message = 'Please mannually switch to Ethereum Chain';
				}
				enqueueSnackbar(err.message, { variant: 'error' });
			}
		},
		[enqueueSnackbar]
	);
};

export default useChangeChain;
