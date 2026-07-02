import {
	fetchCollectionData,
	fetchCollectionDayData,
	fetchTransactionData,
} from '.';
import { useEffect, useState } from 'react';

import SubgraphCollection from '../../../constants/types/SubgraphCollection';
import SubgraphCollectionDay from '../../../constants/types/SubgraphCollectionDay';
import SubgraphTransaction from '../../../constants/types/SubgraphTransaction';

export const useCollectionData = ({
	marketplace,
	collectionAddress,
}: {
	marketplace: 'littleghosts' | 'pancakeswap';
	collectionAddress: string;
}) => {
	const [collectionData, setCollectionData] =
		useState<SubgraphCollection | null>(null);

	useEffect(() => {
		let mounted = true;
		fetchCollectionData({ marketplace, collectionAddress }).then((data) => {
			if (mounted) {
				setCollectionData(data);
			}
		});

		return () => {
			mounted = false;
		};
	}, [marketplace, collectionAddress]);

	return collectionData;
};

export const useCollectionDayData = ({
	marketplace,
	collectionAddress,
	from,
	to,
}: {
	marketplace: 'littleghosts' | 'pancakeswap';
	collectionAddress: string;
	from: number;
	to: number;
}) => {
	const [collectionDayData, setCollectionDayData] =
		useState<Array<SubgraphCollectionDay> | null>(null);

	useEffect(() => {
		let mounted = true;
		fetchCollectionDayData({
			marketplace,
			collectionAddress,
			from,
			to,
		}).then((data) => {
			if (mounted) {
				setCollectionDayData(data);
			}
		});

		return () => {
			mounted = false;
		};
	}, [marketplace, collectionAddress, from, to]);

	return collectionDayData;
};

export const useTransactionData = ({
	marketplace,
	collectionAddress,
	from,
	to,
}: {
	marketplace: 'littleghosts' | 'pancakeswap';
	collectionAddress: string;
	from: number;
	to: number;
}) => {
	const [transactionData, setTransactionData] =
		useState<Array<SubgraphTransaction> | null>(null);

	useEffect(() => {
		let mounted = true;
		fetchTransactionData({
			marketplace,
			collectionAddress,
			from,
			to,
		}).then((data) => {
			if (mounted) {
				setTransactionData(data);
			}
		});

		return () => {
			mounted = false;
		};
	}, [marketplace, collectionAddress, from, to]);

	return transactionData;
};
