const bridgeABI = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'bytes32',
				name: 'swapTxHash',
				type: 'bytes32',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'tokenAddr',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'recipient',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'fromChainId',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256[]',
				name: 'tokenIds',
				type: 'uint256[]',
			},
		],
		name: 'BackwardSwapFilled',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'bridgedTokenAddr',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'sender',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'recipient',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'dstChainId',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'dstTokenAddr',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256[]',
				name: 'tokenIds',
				type: 'uint256[]',
			},
		],
		name: 'BackwardSwapStarted',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'previousOwner',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'newOwner',
				type: 'address',
			},
		],
		name: 'OwnershipTransferred',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'bytes32',
				name: 'swapTxHash',
				type: 'bytes32',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'fromTokenAddr',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'recipient',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'bridgedTokenAddr',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'fromChainId',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256[]',
				name: 'tokenIds',
				type: 'uint256[]',
			},
		],
		name: 'SwapFilled',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'bytes32',
				name: 'registerTxHash',
				type: 'bytes32',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'fromTokenAddr',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'bridgedTokenAddr',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'fromChainId',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'string',
				name: 'tokenSymbol',
				type: 'string',
			},
			{
				indexed: false,
				internalType: 'string',
				name: 'tokenName',
				type: 'string',
			},
		],
		name: 'SwapPairCreated',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'tokenAddress',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'string',
				name: 'tokenName',
				type: 'string',
			},
			{
				indexed: false,
				internalType: 'string',
				name: 'tokenSymbol',
				type: 'string',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'dstChainId',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'destTokenAddress',
				type: 'address',
			},
		],
		name: 'SwapPairRegister',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'tokenAddr',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'sender',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'recipient',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'dstChainId',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256[]',
				name: 'tokenIds',
				type: 'uint256[]',
			},
		],
		name: 'SwapStarted',
		type: 'event',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'registerTxHash',
				type: 'bytes32',
			},
			{
				internalType: 'address',
				name: 'fromTokenAddr',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'fromChainId',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: 'targetTokenAddr',
				type: 'address',
			},
			{
				internalType: 'string',
				name: 'baseURI_',
				type: 'string',
			},
			{
				internalType: 'string',
				name: 'tokenName',
				type: 'string',
			},
			{
				internalType: 'string',
				name: 'tokenSymbol',
				type: 'string',
			},
		],
		name: 'createSwapPair',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_tokenAddr',
				type: 'address',
			},
			{
				internalType: 'string',
				name: '_baseURI',
				type: 'string',
			},
		],
		name: 'emergencySetBridgedBaseURI',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_tokenAddr',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: '_tokenId',
				type: 'uint256',
			},
			{
				internalType: 'string',
				name: '_tokenURI',
				type: 'string',
			},
		],
		name: 'emergencySetBridgedTokenURI',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_tokenAddr',
				type: 'address',
			},
			{
				internalType: 'address',
				name: '_newOwner',
				type: 'address',
			},
		],
		name: 'emergencyTransferOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_tokenAddr',
				type: 'address',
			},
			{
				internalType: 'uint256[]',
				name: '_tokenIds',
				type: 'uint256[]',
			},
			{
				internalType: 'address',
				name: '_recipient',
				type: 'address',
			},
		],
		name: 'emergencyTransferTokens',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'swapTxHash',
				type: 'bytes32',
			},
			{
				internalType: 'address',
				name: 'fromTokenAddr',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'recipient',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'fromChainId',
				type: 'uint256',
			},
			{
				internalType: 'uint256[]',
				name: 'tokenIds',
				type: 'uint256[]',
			},
		],
		name: 'fill',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: '',
				type: 'bytes32',
			},
		],
		name: 'filledSwap',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
			{
				internalType: 'bytes',
				name: '',
				type: 'bytes',
			},
		],
		name: 'onERC721Received',
		outputs: [
			{
				internalType: 'bytes4',
				name: '',
				type: 'bytes4',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'owner',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'paused',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'tokenAddr',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'dstChainId',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: 'dstTokenAddr',
				type: 'address',
			},
		],
		name: 'registerSwapPair',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'registeredToken',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'renounceOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bool',
				name: '_paused',
				type: 'bool',
			},
		],
		name: 'setPaused',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '_dstChainId',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: '_fee',
				type: 'uint256',
			},
		],
		name: 'setSwapFee',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'tokenAddr',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'recipient',
				type: 'address',
			},
			{
				internalType: 'uint256[]',
				name: 'tokenIds',
				type: 'uint256[]',
			},
			{
				internalType: 'uint256',
				name: 'dstChainId',
				type: 'uint256',
			},
		],
		name: 'swap',
		outputs: [],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		name: 'swapFee',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'swapMappingIncoming',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'swapMappingOutgoing',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'newOwner',
				type: 'address',
			},
		],
		name: 'transferOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'withdrawFees',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		stateMutability: 'payable',
		type: 'receive',
	},
];

export default bridgeABI;
