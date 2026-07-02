import {
	setBnbPrice as setGlobalBnbPrice,
	setCollectionDetails as setGlobalCollectionDetails,
} from '../marketplace/marketplace.slice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { AppState } from '..';
import { CollectionDetail } from './types/CollectionDetail';
import Web3 from 'web3';
import { activeNode } from '../../constants/Nodes';
import { aggregatorV3InterfaceABI } from '../../constants/abis/aggregatorV3InterfaceABI';
import axios from 'axios';
import { chainlinkAggregatorV3InterfaceAddress } from '../../constants/ContractAddresses';

const web3 = new Web3(activeNode);

const fetchBnbPrice = async () => {
	const priceFeed = new web3.eth.Contract(
		// @ts-ignore
		aggregatorV3InterfaceABI,
		chainlinkAggregatorV3InterfaceAddress
	);
	return priceFeed.methods
		.latestAnswer()
		.call()
		.then((price) => {
			return price / 10 ** 8;
		});
};

const fetchCollectionDetails = async (_address) => {
	const _fetch = axios.get(
		`${process.env.REACT_APP_API}/nftmarketplace/collections/${_address}`
	) as Promise<{
		data: CollectionDetail;
	}>;

	return _fetch;
};

export const useWalletDetails = () => {
	const dispatch = useDispatch();

	/* Collection Item Details States */
	const [collectionAddress, setCollectionAddress] = useState('');
	const [collectionDetail, setCollectionDetail] = useState(
		{} as CollectionDetail
	);

	/* Global States*/
	const bnbPrice = useSelector(
		(state: AppState) => state.marketplace.bnbPrice
	);
	const collectionDetails = useSelector(
		(state: AppState) => state.marketplace.collectionDetails
	);

	useEffect(() => {
		// bnb price
		if (!bnbPrice) {
			fetchBnbPrice().then((price) => {
				dispatch(setGlobalBnbPrice(price));
			});
		}
	}, []);

	useEffect(() => {
		if (collectionAddress) {
			if (!collectionDetails[collectionAddress]) {
				fetchCollectionDetails(collectionAddress).then((res) => {
					setCollectionDetail(res.data);
					dispatch(
						setGlobalCollectionDetails({
							[collectionAddress]: res.data,
						})
					);
				});
			} else {
				setCollectionDetail(collectionDetails[collectionAddress]);
			}
		}
	}, [collectionAddress]);

	return {
		collectionDetail,
		bnbPrice,
		collectionAddress,
		setCollectionAddress,
	};
};
