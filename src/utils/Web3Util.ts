import {
	bscConnector,
	injected,
	walletconnect,
	walletlink,
} from '../web3/connectors';

import Web3 from 'web3';

export const connectorIDs = {
	injected: 'injected',
	bsc: 'bsc',
	walletlink: 'walletlink',
	ledger: 'ledger',
	walletconnect: 'walletconnect',
};

export const connectorIdMap = {
	injected,
	bsc: bscConnector,
	walletlink: walletlink,
	walletconnect: walletconnect,
};

export const isValidAddress = (adr: string) => {
	try {
		const web3 = new Web3();
		return web3.utils.toChecksumAddress(adr);
	} catch (e) {
		return false;
	}
};
