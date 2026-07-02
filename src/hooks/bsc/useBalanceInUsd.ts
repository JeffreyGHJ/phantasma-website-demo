import { useEffect, useState } from 'react';

import Web3 from 'web3';
import { useBalance } from './useBalance';
import { useBnbPriceInUsd } from '../../state/application/hooks';

const web3 = new Web3();

const useBalanceInUsd = (account: string) => {
	const [balanceInUsd, setBalanceInUsd] = useState(0);
	const balance = useBalance(account);
	const bnbPriceInUsd = useBnbPriceInUsd();

	useEffect(() => {
		setBalanceInUsd(
			+(+web3.utils.fromWei(balance, 'ether') * bnbPriceInUsd).toFixed(2)
		);
	}, [balance, bnbPriceInUsd]);

	return balanceInUsd;
};

export default useBalanceInUsd;
