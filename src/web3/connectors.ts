import { activeNode, activeNodes } from '../constants/Nodes';

import { BscConnector } from '@binance-chain/bsc-connector';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { blockchains } from '../constants/Blockchains';

// const POLLING_INTERVAL = 12000;

export const injected = new InjectedConnector({
	supportedChainIds: [
		blockchains.BSC,
		blockchains.ETHEREUM,
		blockchains.CRONOS,
		blockchains.FANTOM,
		blockchains.AVALANCHE,
		blockchains.POLYGON,
		blockchains.HARMONY,
	],
});

export const walletconnect = new WalletConnectConnector({
	rpc: {
		[blockchains.ETHEREUM]: activeNodes[blockchains.ETHEREUM],
		[blockchains.BSC]: activeNodes[blockchains.BSC],
		[blockchains.CRONOS]: activeNodes[blockchains.CRONOS],
		[blockchains.FANTOM]: activeNodes[blockchains.FANTOM],
		[blockchains.AVALANCHE]: activeNodes[blockchains.AVALANCHE],
		[blockchains.POLYGON]: activeNodes[blockchains.POLYGON],
		[blockchains.HARMONY]: activeNodes[blockchains.HARMONY],
	},
	qrcode: true,
});

export const bscConnector = new BscConnector({
	supportedChainIds: [
		blockchains.BSC,
		blockchains.ETHEREUM,
		blockchains.CRONOS,
		blockchains.FANTOM,
		blockchains.AVALANCHE,
		blockchains.POLYGON,
		blockchains.HARMONY,
	],
});

export const walletlink = new WalletLinkConnector({
	url: activeNode,
	appName: 'Phantasma Website',
	supportedChainIds: [blockchains.BSC],
});
