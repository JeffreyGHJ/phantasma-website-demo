const Web3 = require('web3');
const web3 = new Web3('https://bsc-dataseed1.binance.org:443');

const contractAddress = '0x98f606a4cdde68b9f68732d21fb9ba8b5510ee48';

export const getTotalSupply = async () => {
	const abi = [
		{
			inputs: [],
			name: 'totalSupply',
			outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function',
		},
	];
	const MyContract = new web3.eth.Contract(abi, contractAddress);
	return MyContract.methods.totalSupply().call();
};
