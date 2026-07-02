import { useEffect, useState } from 'react';

import Web3 from 'web3';
import { activeNode } from '../../constants/Nodes';
import { isAddress } from '../../utils';

const web3 = new Web3(activeNode);

export const getBalance = async (account: string) => {
	if (!isAddress(account)) {
		return '0';
	}

	return web3.eth.getBalance(account);
};

export const useBalance = (account: string) => {
	const [balance, setBalance] = useState('0');

	useEffect(() => {
		let mounted = true;

		getBalance(account).then((_balance) => {
			if (mounted) {
				setBalance(_balance);
			}
		});

		return () => {
			mounted = false;
		};
	}, [account]);

	return balance;
};
