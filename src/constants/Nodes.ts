import { TESTNET } from './global';
import { blockchains } from './Blockchains';

const Rinkeby = 'https://rpc.sepolia.org';

const bscTestNetNode = 'https://data-seed-prebsc-2-s2.binance.org:8545/';
const bsc = 'https://bsc-dataseed1.binance.org/';

const QuickNodeBsc = process.env.REACT_APP_NETWORK_URL || 'https://bsc-dataseed1.binance.org/';
const QuickNodeEth = process.env.REACT_APP_ETH_NETWORK_URL || 'https://eth.llamarpc.com';
const CronosTestNode = 'https://cronos-testnet-3.crypto.org:8545';
const CronosMainnetNode = 'https://evm.cronos.org';
const FantomTestNode = 'https://rpc.testnet.fantom.network';
const FantomMainnetNode = 'https://rpc.ftm.tools';
const AvalancheTestNode = 'https://api.avax-test.network/ext/bc/C/rpc';
const AvalancheMainnetNode = 'https://api.avax.network/ext/bc/C/rpc';
const PolygonTestNode = 'https://matic-mumbai.chainstacklabs.com';
const PolygonMainnetNode = 'https://polygon-rpc.com';
const HarmonyTestNode = 'https://api.s0.b.hmny.io';
const HarmonyMainnetNode = 'https://api.harmony.one';

export const solanaNode = 'https://api.mainnet-beta.solana.com'

export const activeNodes = {
	[blockchains.ETHEREUM]: TESTNET ? Rinkeby : QuickNodeEth,
	[blockchains.BSC]: TESTNET ? bscTestNetNode : QuickNodeBsc,
	[blockchains.CRONOS]: TESTNET ? CronosTestNode : CronosMainnetNode,
	[blockchains.FANTOM]: TESTNET ? FantomTestNode : FantomMainnetNode,
	[blockchains.AVALANCHE]: TESTNET ? AvalancheTestNode : AvalancheMainnetNode,
	[blockchains.POLYGON]: TESTNET ? PolygonTestNode : PolygonMainnetNode,
	[blockchains.HARMONY]: TESTNET ? HarmonyTestNode : HarmonyMainnetNode,
};

export const activeNode = activeNodes[blockchains.BSC];
