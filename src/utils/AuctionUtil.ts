import {
	busdTokenAddress,
	ectoContractAddress,
	wbnbTokenAddress,
} from '../constants/ContractAddresses';

import { SingleCollectionItemAuction } from '../state/application/types/SingleCollectionItem';
import { fromSolidityTokenFormat } from './MathUtil';
import { getPaymentTokenDecimals } from './funcs';
import { isUndefined } from 'lodash';

export const getAuctionExpireDisplay = ({
	item,
	currentTime,
}: {
	item: {
		endBlock?: number;
	};
	currentTime: number;
}) => {
	if (!item.endBlock) {
		return 'Expired';
	}
	const expireTime = +item.endBlock * 1000;
	if (expireTime <= currentTime) {
		return 'Expired';
	}
	return ((expireTime - currentTime) / 1000 / 60 / 60).toFixed(2);
};

export const getBuyoutPriceInUsd = (_item, _ectoPrice, _bnbPrice) => {
	const address = _item.paymentToken.toLowerCase();
	if (address === ectoContractAddress.toLowerCase()) {
		return (
			+fromSolidityTokenFormat(_item.auction_price, 9) * _ectoPrice
		).toFixed();
	} else if (address === busdTokenAddress.toLowerCase()) {
		return (+fromSolidityTokenFormat(_item.auction_price, 18)).toFixed();
	} else if (address === wbnbTokenAddress.toLowerCase()) {
		return (
			+fromSolidityTokenFormat(_item.auction_price, 18) * _bnbPrice
		).toFixed();
	}
	return '0';
};

export const getBidPriceInUsd = (
	_item: {
		paymentToken?: string;
		auction_price?: string;
		highestBidAmount?: string;
		minimumBidAmount?: string;
	},
	_ectoPrice: number,
	_bnbPrice: number
) => {
	if (
		!isUndefined(_item.paymentToken) &&
		!isUndefined(_item.auction_price) &&
		!isUndefined(_item.highestBidAmount) &&
		!isUndefined(_item.minimumBidAmount)
	) {
		const bid = +_item.highestBidAmount
			? _item.highestBidAmount
			: _item.minimumBidAmount;

		const address = _item.paymentToken.toLowerCase();
		if (address === ectoContractAddress.toLowerCase()) {
			return (+fromSolidityTokenFormat(bid, 9) * _ectoPrice).toFixed();
		} else if (address === busdTokenAddress.toLowerCase()) {
			return (+fromSolidityTokenFormat(bid, 18)).toFixed();
		} else if (address === wbnbTokenAddress.toLowerCase()) {
			return (+fromSolidityTokenFormat(bid, 18) * _bnbPrice).toFixed();
		}
	}
	return '0';
};

export const getCurrentBid = (_item: SingleCollectionItemAuction) => {
	const paymentTokenDecimals = getPaymentTokenDecimals(_item.paymentToken);
	return +_item.highestBidAmount
		? +fromSolidityTokenFormat(_item.highestBidAmount, paymentTokenDecimals)
		: +fromSolidityTokenFormat(
				_item.minimumBidAmount,
				paymentTokenDecimals
		  );
};

export const getCurrentBiddingPriceInUsd = (_item, _ectoPrice, _bnbPrice) => {
	const address = _item.paymentToken.toLowerCase();
	const price = +_item.highestBidAmount
		? _item.highestBidAmount
		: _item.minimumBidAmount;
	if (address === ectoContractAddress.toLowerCase()) {
		return +fromSolidityTokenFormat(price, 9) * _ectoPrice;
	} else if (address === busdTokenAddress.toLowerCase()) {
		return +fromSolidityTokenFormat(price, 18);
	} else if (address === wbnbTokenAddress.toLowerCase()) {
		return +fromSolidityTokenFormat(price, 18) * _bnbPrice;
	}
	return '0';
};

export const durations = [
	{
		count: 1,
		unit: 'Day',
		seconds: 86400,
	},
	{
		count: 2,
		unit: 'Days',
		seconds: 172800,
	},
	{
		count: 3,
		unit: 'Days',
		seconds: 259200,
	},
	{
		count: 4,
		unit: 'Days',
		seconds: 345600,
	},
	{
		count: 5,
		unit: 'Days',
		seconds: 432000,
	},
	{
		count: 6,
		unit: 'Days',
		seconds: 518400,
	},
	{
		count: 7,
		unit: 'Days',
		seconds: 604800,
	},
];
