const AirdropperABI = [
	{
		inputs: [
			{
				internalType: 'address',
				name: '_oldTokenAddress',
				type: 'address',
			},
		],
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: '_caller',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: '_burned',
				type: 'uint256',
			},
		],
		name: 'Burned',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: '_user',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: '_amount',
				type: 'uint256',
			},
		],
		name: 'Migrated',
		type: 'event',
	},
	{
		inputs: [],
		name: 'burn',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'burned',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
		name: 'migrate',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'migrate',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'newTokenAddress',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'oldTokenAddress',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function',
	},
];

export default AirdropperABI;
