import {
	busdTokenAddress,
	ectoContractAddress,
	ectoSkeletonNFTAddress,
	foundersItemsContractAddress,
	littleGhostNFTAddress,
	lootboxContractAddress,
	wbnbTokenAddress,
} from '../constants/ContractAddresses';

import { fromSolidityTokenFormat } from './MathUtil';

export const getPaymentTokenDecimals = (address: string) => {
	if (!address) {
		return 0;
	}
	address = address.toLowerCase();
	if (address === ectoContractAddress.toLowerCase()) {
		return 9;
	} else if (address === busdTokenAddress.toLowerCase()) {
		return 18;
	} else if (address === wbnbTokenAddress.toLowerCase()) {
		return 18;
	}
	return 0;
};

export const getTokenPriceInUsd = ({
	address,
	amount,
	ectoPrice,
	bnbPrice,
	solidityFormat = true,
}: {
	address: string;
	amount: string | number;
	ectoPrice?: number;
	bnbPrice?: number;
	solidityFormat?: boolean;
}) => {
	address = address.toLowerCase();
	if (solidityFormat) {
		if (address === ectoContractAddress.toLowerCase() && ectoPrice) {
			return (
				+fromSolidityTokenFormat(amount.toString(), 9) * ectoPrice
			).toFixed();
		} else if (address === busdTokenAddress.toLowerCase()) {
			return (+fromSolidityTokenFormat(amount.toString(), 18)).toFixed();
		} else if (address === wbnbTokenAddress.toLowerCase() && bnbPrice) {
			return (
				+fromSolidityTokenFormat(amount.toString(), 18) * bnbPrice
			).toFixed();
		}
	} else {
		if (address === ectoContractAddress.toLowerCase() && ectoPrice) {
			return (ectoPrice * +amount).toFixed();
		} else if (address === busdTokenAddress.toLowerCase()) {
			return (+amount).toFixed();
		} else if (address === wbnbTokenAddress.toLowerCase() && bnbPrice) {
			return (bnbPrice * +amount).toFixed();
		}
	}
	return '0';
};

export const getPaymentTokenDisplay = (address: string) => {
	if (!address) {
		return 'BNB';
	}
	address = address.toLowerCase();
	if (address === ectoContractAddress.toLowerCase()) {
		return 'ECTO';
	} else if (address === busdTokenAddress.toLowerCase()) {
		return 'BUSD';
	} else if (address === wbnbTokenAddress.toLowerCase()) {
		return 'WBNB';
	}
	return 'Unknown Token';
};

export const getNftDisplay = (address: string) => {
	address = address.toLowerCase();
	if (address === littleGhostNFTAddress.toLowerCase()) {
		return 'LittleGhosts';
	} else if (address === ectoSkeletonNFTAddress.toLowerCase()) {
		return 'EctoSkeletons';
	} else if (address === lootboxContractAddress.toLowerCase()) {
		return "Founder's Lootboxes";
	} else if (address === foundersItemsContractAddress.toLowerCase()) {
		return "Founder's Items";
	}
	return 'Unknown NFT';
};
