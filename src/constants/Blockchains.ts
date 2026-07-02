import { TESTNET } from './global';

type Networks = Record<
	number,
	{
		chainId: string;
		chainName: string;
		nativeCurrency: {
			name: string;
			symbol: string;
			decimals: number;
		};
		rpcUrls: Array<string>;
		blockExplorerUrls: Array<string>;
	}
>;

export const blockchains = {
	ETHEREUM: TESTNET ? 4 : 1,
	RINKEBY: 4,
	CRONOS: TESTNET ? 338 : 25,
	BSC: TESTNET ? 97 : 56,
	BSC_TESTNET: 97,
	FANTOM: TESTNET ? 4002 : 250,
	CRONOS_TESTNET: 338,
	FANTOM_TESTNET: 4002,
	AVALANCHE: TESTNET ? 43113 : 43114,
	POLYGON: TESTNET ? 80001 : 137,
	HARMONY: TESTNET ? 1666700000 : 1666600000,
};

export const blockchainNames = {
	1: 'Ethereum',
	4: 'Rinkeby',
	25: 'Cronos',
	56: 'Binance Smart Chain',
	97: 'BSC Test Net',
	137: 'Polygon',
	250: 'Fantom',
	338: 'Cronos Testnet',
	4002: 'Fantom Testnet',
	43113: 'Avalanche Testnet',
	43114: 'Avalanche',
	80001: 'Mumbai Polygon',
	1666700000: 'Harmony Testnet',
	1666600000: 'Harmony',
};

export const networks = {
	[blockchains.ETHEREUM]: {
		chainId: `0x${Number(1).toString(16)}`,
		chainName: 'Ethereum Mainnet',
		nativeCurrency: {
			name: 'Ether',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: [
			`https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY || ''}`,
		],
		blockExplorerUrls: ['https://etherscan.io'],
	},
	[blockchains.BSC]: {
		chainId: `0x${Number(56).toString(16)}`,
		chainName: 'Binance Smart Chain Mainnet',
		nativeCurrency: {
			name: 'Binance Chain Native Token',
			symbol: 'BNB',
			decimals: 18,
		},
		rpcUrls: [
			'https://bsc-dataseed1.binance.org',
			'https://bsc-dataseed2.binance.org',
			'https://bsc-dataseed3.binance.org',
			'https://bsc-dataseed4.binance.org',
			'https://bsc-dataseed1.defibit.io',
			'https://bsc-dataseed2.defibit.io',
			'https://bsc-dataseed3.defibit.io',
			'https://bsc-dataseed4.defibit.io',
			'https://bsc-dataseed1.ninicoin.io',
			'https://bsc-dataseed2.ninicoin.io',
			'https://bsc-dataseed3.ninicoin.io',
			'https://bsc-dataseed4.ninicoin.io',
			'wss://bsc-ws-node.nariox.org',
		],
		blockExplorerUrls: ['https://bscscan.com'],
	},
	[blockchains.CRONOS]: TESTNET
		? {
				chainId: `0x${Number(338).toString(16)}`,
				chainName: 'Cronos Testnet',
				nativeCurrency: {
					name: 'Cronos',
					symbol: 'TCRO',
					decimals: 18,
				},
				rpcUrls: ['https://cronos-testnet-3.crypto.org:8545'],
				blockExplorerUrls: [
					'https://cronos.crypto.org/explorer/testnet3',
				],
		  }
		: {
				chainId: `0x${Number(25).toString(16)}`,
				chainName: 'Cronos Mainnet Beta',
				nativeCurrency: {
					name: 'Cronos',
					symbol: 'CRO',
					decimals: 18,
				},
				rpcUrls: ['https://evm.cronos.org'],
				blockExplorerUrls: ['https://cronos.org/explorer'],
		  },
	[blockchains.FANTOM]: TESTNET
		? {
				chainId: `0x${Number(4002).toString(16)}`,
				chainName: 'Fantom Testnet',
				nativeCurrency: {
					name: 'Fantom',
					symbol: 'FTM',
					decimals: 18,
				},
				rpcUrls: ['https://rpc.testnet.fantom.network'],
				blockExplorerUrls: ['https://testnet.ftmscan.com'],
		  }
		: {
				chainId: `0x${Number(250).toString(16)}`,
				chainName: 'Fantom Opera',
				nativeCurrency: {
					name: 'Fantom',
					symbol: 'FTM',
					decimals: 18,
				},
				rpcUrls: ['https://rpc.ftm.tools'],
				blockExplorerUrls: ['https://ftmscan.com'],
		  },
	[blockchains.AVALANCHE]: TESTNET
		? {
				chainId: `0x${Number(43113).toString(16)}`,
				chainName: 'Avalanche Fuji Testnet',
				nativeCurrency: {
					name: 'Avalanche',
					symbol: 'AVAX',
					decimals: 18,
				},
				rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
				blockExplorerUrls: ['https://testnet.snowtrace.io'],
		  }
		: {
				chainId: `0x${Number(43114).toString(16)}`,
				chainName: 'Avalanche Mainnet',
				nativeCurrency: {
					name: 'Avalanche',
					symbol: 'AVAX',
					decimals: 18,
				},
				rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
				blockExplorerUrls: ['https://snowtrace.io/'],
		  },
	[blockchains.POLYGON]: TESTNET
		? {
				chainId: `0x${Number(80001).toString(16)}`,
				chainName: 'Mumbai',
				nativeCurrency: {
					name: 'Polygon',
					symbol: 'MATIC',
					decimals: 18,
				},
				rpcUrls: ['https://matic-mumbai.chainstacklabs.com'],
				blockExplorerUrls: ['https://mumbai.polygonscan.com'],
		  }
		: {
				chainId: `0x${Number(137).toString(16)}`,
				chainName: 'Polygon Mainnet',
				nativeCurrency: {
					name: 'Polygon',
					symbol: 'MATIC',
					decimals: 18,
				},
				rpcUrls: ['https://polygon-rpc.com'],
				blockExplorerUrls: ['https://polygonscan.com'],
		  },
	[blockchains.HARMONY]: TESTNET
		? {
				chainId: `0x${Number(1666700000).toString(16)}`,
				chainName: 'Harmony Testnet Shard 0',
				nativeCurrency: {
					name: 'HARMONY',
					symbol: 'ONE',
					decimals: 18,
				},
				rpcUrls: ['https://api.s0.b.hmny.io'],
				blockExplorerUrls: ['https://explorer.pops.one'],
		  }
		: {
				chainId: `0x${Number(1666600000).toString(16)}`,
				chainName: 'Harmony Mainnet Shard 0',
				nativeCurrency: {
					name: 'HARMONY',
					symbol: 'ONE',
					decimals: 18,
				},
				rpcUrls: ['https://api.harmony.one'],
				blockExplorerUrls: ['https://explorer.harmony.one'],
		  },
};

export const supportedNetworks: Networks = {
	[blockchains.BSC]: { ...networks[blockchains.BSC] },
	[blockchains.ETHEREUM]: { ...networks[blockchains.ETHEREUM] },
	[blockchains.CRONOS]: { ...networks[blockchains.CRONOS] },
	[blockchains.FANTOM]: { ...networks[blockchains.FANTOM] },
	[blockchains.AVALANCHE]: { ...networks[blockchains.AVALANCHE] },
	[blockchains.POLYGON]: { ...networks[blockchains.POLYGON] },
	[blockchains.HARMONY]: { ...networks[blockchains.HARMONY] },
};
