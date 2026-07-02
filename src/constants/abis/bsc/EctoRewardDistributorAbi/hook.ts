import { useCallback, useEffect, useState } from 'react';
import {
	useDividendDistributorAddress,
	useDividendDistributorContract,
} from '../EctoTokenAbi/hook';
import {
	useHandleWeb3Error,
	useHandleWeb3Response,
} from '../../../../utils/Web3ResponseUtil';

import { Contract } from 'web3-eth-contract';
import { Shares } from './types';
import { Web3Provider } from '@ethersproject/providers';
import { isEmpty } from 'lodash';
import { isValidAddress } from '../../../../utils/Web3Util';
import { useWeb3React } from '@web3-react/core';

export const useUnpaidEarnings = ({
	account,
	DividendDistributionContract,
}: {
	account: string;
	DividendDistributionContract: Contract;
}) => {
	const [unpaidEarnings, setUnpaidEarnings] = useState(BigInt(0));

	useEffect(() => {
		let mounted = true;
		if (
			!DividendDistributionContract ||
			!account ||
			!isValidAddress(account)
		) {
			if (mounted) {
				setUnpaidEarnings(BigInt(0));
			}
			return;
		}

		(async () => {
			const _unpaidEarnings = await DividendDistributionContract.methods
				.getUnpaidEarnings(account)
				.call();
			if (mounted) {
				setUnpaidEarnings(BigInt(_unpaidEarnings));
			}
		})();
		return () => {
			mounted = false;
		};
	}, [account, DividendDistributionContract]);

	return { unpaidEarnings, setUnpaidEarnings };
};

export const useShares = ({
	account,
	DividendDistributionContract,
	unpaidEarnings,
}: {
	account: string;
	DividendDistributionContract: Contract;
	unpaidEarnings: bigint;
}): Shares => {
	const [shares, setShares] = useState({} as Shares);

	useEffect(() => {
		let mounted = true;
		if (
			!DividendDistributionContract ||
			!account ||
			!isValidAddress(account)
		) {
			if (mounted) {
				setShares(
					{} as {
						'0': string;
						'1': string;
						'2': string;
						amount: string;
						totalExcluded: string;
						totalRealised: string;
					}
				);
			}
			return;
		}
		(async () => {
			const _shares = await DividendDistributionContract.methods
				.shares(account)
				.call();
			if (mounted) {
				setShares(_shares);
			}
		})();
		return () => {
			mounted = false;
		};
	}, [account, DividendDistributionContract, unpaidEarnings]);

	return shares;
};

export const useDividendsPerShare = (
	DividendDistributionContract: Contract
) => {
	const [dividendsPerShare, setDividendsPerShare] = useState(BigInt(0));

	useEffect(() => {
		let mounted = true;
		if (!DividendDistributionContract) {
			if (mounted) {
				setDividendsPerShare(BigInt(0));
			}
			return;
		}
		(async () => {
			const _dividendsPerShare =
				await DividendDistributionContract.methods
					.dividendsPerShare()
					.call();
			if (mounted) {
				setDividendsPerShare(BigInt(_dividendsPerShare));
			}
		})();
		return () => {
			mounted = false;
		};
	}, [DividendDistributionContract]);

	return dividendsPerShare;
};

export const useDividendsPerShareAccuracyFactor = ({
	DividendDistributionContract,
}: {
	DividendDistributionContract: Contract;
}) => {
	const [
		dividendsPerShareAccuracyFactor,
		setDividendsPerShareAccuracyFactor,
	] = useState(BigInt(0));

	useEffect(() => {
		let mounted = true;
		if (!DividendDistributionContract) {
			return;
		}

		(async () => {
			const _dividendsPerShareAccuracyFactor =
				await DividendDistributionContract.methods
					.dividendsPerShareAccuracyFactor()
					.call();
			if (mounted) {
				setDividendsPerShareAccuracyFactor(
					BigInt(_dividendsPerShareAccuracyFactor)
				);
			}
		})();
		return () => {
			mounted = false;
		};
	}, [DividendDistributionContract]);

	return dividendsPerShareAccuracyFactor;
};

export const useTotalShares = ({
	DividendDistributionContract,
}: {
	DividendDistributionContract: Contract;
}) => {
	const [totalShares, setTotalShares] = useState(BigInt(0));

	useEffect(() => {
		let mounted = true;
		if (!DividendDistributionContract) {
			if (mounted) {
				setTotalShares(BigInt(0));
			}
			return;
		}
		(async () => {
			const _totalShares = await DividendDistributionContract.methods
				.totalShares()
				.call();
			if (mounted) {
				setTotalShares(BigInt(_totalShares));
			}
		})();
		return () => {
			mounted = false;
		};
	}, [DividendDistributionContract]);

	return totalShares;
};

export const useAnticipatedDividendsPerShare = ({
	amount,
	DividendDistributionContract,
	dividendsPerShareAccuracyFactor,
}: {
	amount: bigint;
	DividendDistributionContract: Contract;
	dividendsPerShareAccuracyFactor: bigint;
}) => {
	const dividendsPerShare = useDividendsPerShare(
		DividendDistributionContract
	);
	const totalShares = useTotalShares({ DividendDistributionContract });

	const [anticipatedDividendsPerShare, setAnticipatedDividendsPerShare] =
		useState(BigInt(0));

	useEffect(() => {
		if (
			amount &&
			dividendsPerShare &&
			dividendsPerShareAccuracyFactor &&
			totalShares
		) {
			setAnticipatedDividendsPerShare(
				dividendsPerShare +
					(dividendsPerShareAccuracyFactor * amount) / totalShares
			);
		}
	}, [
		amount,
		dividendsPerShare,
		dividendsPerShareAccuracyFactor,
		totalShares,
	]);

	return anticipatedDividendsPerShare;
};

export const useAnticipatedCumulativeDividends = ({
	amount,
	shares,
	DividendDistributionContract,
	dividendsPerShareAccuracyFactor,
}: {
	amount: bigint;
	shares: Shares;
	DividendDistributionContract: Contract;
	dividendsPerShareAccuracyFactor: bigint;
}) => {
	const anticipatedDividendsPerShare = useAnticipatedDividendsPerShare({
		amount,
		DividendDistributionContract,
		dividendsPerShareAccuracyFactor,
	});
	const [anticipatedCumulativeDividends, setAnticipatedCumulativeDividends] =
		useState(BigInt(0));
	useEffect(() => {
		if (
			!isEmpty(shares) &&
			dividendsPerShareAccuracyFactor &&
			anticipatedDividendsPerShare
		) {
			setAnticipatedCumulativeDividends(
				(BigInt(shares.amount) * anticipatedDividendsPerShare) /
					dividendsPerShareAccuracyFactor
			);
		}
	}, [shares, anticipatedDividendsPerShare, dividendsPerShareAccuracyFactor]);

	return anticipatedCumulativeDividends;
};

export const useAnticipatedRewards = ({
	amount,
	unpaidEarnings,
	shares,
	DividendDistributionContract,
	dividendsPerShareAccuracyFactor,
}: {
	amount: bigint;
	unpaidEarnings: bigint;
	shares: Shares;
	DividendDistributionContract: Contract;
	dividendsPerShareAccuracyFactor: bigint;
}) => {
	const anticipatedCumulativeDividends = useAnticipatedCumulativeDividends({
		amount,
		shares,
		DividendDistributionContract,
		dividendsPerShareAccuracyFactor,
	});
	const [anticipatedRewards, setAnticipatedRewards] = useState(BigInt(0));

	useEffect(() => {
		if (!amount || isEmpty(shares) || !anticipatedCumulativeDividends) {
			setAnticipatedRewards(BigInt(0));
			return;
		}
		setAnticipatedRewards(
			anticipatedCumulativeDividends -
				BigInt(shares.totalExcluded) -
				unpaidEarnings
		);
	}, [amount, unpaidEarnings, shares, anticipatedCumulativeDividends]);

	return anticipatedRewards;
};

export const useClaimRewards = (callback: (receipt) => void) => {
	const dividendDistributorAddress = useDividendDistributorAddress();
	const DividendDistributorContract = useDividendDistributorContract();
	const { account, library } = useWeb3React<Web3Provider>();
	const handleWeb3Reponse = useHandleWeb3Response();
	const handleWeb3Error = useHandleWeb3Error();

	return useCallback(() => {
		if (
			!dividendDistributorAddress ||
			!DividendDistributorContract ||
			!library ||
			!account
		) {
			return;
		}

		const encoded = DividendDistributorContract.methods
			.claimDividend()
			.encodeABI();
		library
			.getSigner()
			.sendTransaction({
				from: account,
				to: dividendDistributorAddress,
				value: 0,
				data: encoded,
			})
			.then((res) => {
				handleWeb3Reponse({
					waitingMessage: 'Waiting for confirmations...',
					successMessage: 'Rewards have been claimed successfully!',
					res,
					callback: (receipt) => {
						callback(receipt);
					},
				});
			})
			.catch((err) => {
				handleWeb3Error({ err });
			});
	}, [
		dividendDistributorAddress,
		DividendDistributorContract,
		account,
		library,
		callback,
	]);
};
