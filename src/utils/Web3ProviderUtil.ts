import {
	NoEthereumProviderError,
	UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector';
import { injected, walletconnect } from '../web3/connectors';

import { UnsupportedChainIdError } from '@web3-react/core';
import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from '@web3-react/frame-connector';
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector';
import { Web3Provider } from '@ethersproject/providers';

enum ConnectorNames {
	Injected = 'Injected',
	WalletConnect = 'WalletConnect',
}

const connectorsByName: { [connectorName in ConnectorNames]: any } = {
	[ConnectorNames.Injected]: injected,
	[ConnectorNames.WalletConnect]: walletconnect,
};

export const getErrorMessage = (error: Error) => {
	if (error instanceof NoEthereumProviderError) {
		return 'No provider found.';
	} else if (error instanceof UnsupportedChainIdError) {
		return "You're connected to an unsupported network.";
	} else if (
		error instanceof UserRejectedRequestErrorInjected ||
		error instanceof UserRejectedRequestErrorWalletConnect ||
		error instanceof UserRejectedRequestErrorFrame
	) {
		return 'Please authorize this website to access your account.';
	} else {
		console.error(error);
		return 'An unknown error occurred. Check the console for more details.';
	}
};

export const getLibrary = (provider: any): Web3Provider => {
	const library = new Web3Provider(provider);
	library.pollingInterval = 12000;
	return library;
};
