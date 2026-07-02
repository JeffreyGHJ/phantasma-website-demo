import { useCallback, useEffect } from 'react';
import {
	useCloseWalletModal,
	useConnectorID,
	useOpenWalletModal,
	useUpdateConnectorID,
	useWalletModalOpen,
} from '../state/application/hooks';

import { Web3Provider } from '@ethersproject/providers';
import { connectorIdMap } from '../utils/Web3Util';
import { useSnackbar } from 'notistack';
import { useWeb3React } from '@web3-react/core';

export const useWalletModal = () => {
	/* Global States*/
	const isWalletModalOpen = useWalletModalOpen();
	const connectorID = useConnectorID();
	const setConnectorID = useUpdateConnectorID();
	const handleModalOpen = useOpenWalletModal();
	const handleModalClose = useCloseWalletModal();

	const { activate, error } = useWeb3React<Web3Provider>();
	const { enqueueSnackbar } = useSnackbar();

	const handleWalletClick = useCallback(
		(_connectorID: string) => {
			handleModalClose();
			try {
				activate(connectorIdMap[_connectorID]);
				setConnectorID(_connectorID);
			} catch (err) {
				console.log(err);
			}
		},
		[handleModalClose, activate, setConnectorID]
	);

	useEffect(() => {
		if (connectorID) {
			handleWalletClick(connectorID);
		}
	}, [connectorID, handleWalletClick]);

	useEffect(() => {
		if (error && enqueueSnackbar) {
			enqueueSnackbar(error.message, { variant: 'error' });
		}
	}, [error, enqueueSnackbar]);

	return {
		isWalletModalOpen,
		handleModalOpen,
		handleModalClose,
		handleWalletClick,
	};
};
