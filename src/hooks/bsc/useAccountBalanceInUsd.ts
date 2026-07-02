import {
	useAccountBnbBalance,
	useBnbPriceInUsd,
} from '../../state/application/hooks';
import { useEffect, useState } from 'react';

import Web3 from 'web3';

const web3 = new Web3();

const useAccountBalanceInUsd = () => {
	const [balanceInUsd, setBalanceInUsd] = useState(0);
	const balance = useAccountBnbBalance();
	const bnbPriceInUsd = useBnbPriceInUsd();

	useEffect(() => {
		setBalanceInUsd(
			+(+web3.utils.fromWei(balance, 'ether') * bnbPriceInUsd).toFixed(2)
		);
	}, [balance, bnbPriceInUsd]);

	return balanceInUsd;
};

export default useAccountBalanceInUsd;
