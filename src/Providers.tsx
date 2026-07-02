import { Web3ReactProvider, createWeb3ReactRoot } from '@web3-react/core';

import { NetworkContextName } from './constants/index';
import { Provider } from 'react-redux';
import getLibrary from './utils/getLibrary';
import store from './state';
import {VaultManagerProvider} from "./contexts/VaultManager";

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

const Providers = (props: any) => {
	const { children } = props;
	return (
		<VaultManagerProvider>
		<Web3ReactProvider getLibrary={getLibrary}>
			<Web3ProviderNetwork getLibrary={getLibrary}>
				<Provider store={store}>{children}</Provider>
			</Web3ProviderNetwork>
		</Web3ReactProvider>
		</VaultManagerProvider>
	);
};

export default Providers;
