import { useEffect, useState } from 'react';

import Web3 from 'web3';

const web3 = new Web3();

export const useAccountBnbBalanceDisplay = ({
	balance,
	decimal,
}: {
	balance: string;
	decimal: number;
}) => {
	const [display, setDisplay] = useState(0);

	useEffect(() => {
		setDisplay(+(+web3.utils.fromWei(balance, 'ether')).toFixed(decimal));
	}, [balance, decimal]);

	return display;
};
