import { Web3Provider } from '@ethersproject/providers';
import { useCallback } from 'react';
import { useUpdateConnectorID } from '../state/application/hooks';
import { useWeb3React } from '@web3-react/core';

const useDisconnect = () => {
	const { deactivate } = useWeb3React<Web3Provider>();
	const setConnectorID = useUpdateConnectorID();

	return useCallback(() => {
		if (deactivate) {
			setConnectorID('');
			deactivate();
		}
	}, [setConnectorID, deactivate]);
};

export default useDisconnect;
