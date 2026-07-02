import {
	busdTokenAddress,
	ectoContractAddress,
	wbnbTokenAddress,
} from '../constants/ContractAddresses';

import { ImageTag } from './ImageUtil';
import Web3 from 'web3';

const web3 = new Web3();

export const weiToBnb = ({
	wei,
	precision,
}: {
	wei: string | number;
	precision?: number;
}) => {
	if (!wei) {
		return 0;
	}
	if (precision) {
		return +(+web3.utils.fromWei(wei.toString(), 'ether')).toFixed(
			precision
		);
	}
	return +web3.utils.fromWei(wei.toString(), 'ether');
};

//TODO: move this outta here
export const PaymentTokenImageTag = ({
	address,
	size,
}: {
	address: string;
	size: string;
}) => {
	address = address.toLowerCase();
	if (address === ectoContractAddress.toLowerCase()) {
		return (
			<ImageTag
				src={`${process.env.PUBLIC_URL}/assets/images/icons/token_icons/Ecto.png`}
				height={size}
				width={size}
			/>
		);
	} else if (address === busdTokenAddress.toLowerCase()) {
		return (
			<ImageTag
				src={`${process.env.PUBLIC_URL}/assets/images/icons/token_icons/busd_32.webp`}
				height={size}
				width={size}
			/>
		);
	} else if (address === wbnbTokenAddress.toLowerCase()) {
		return (
			<ImageTag
				src={`${process.env.PUBLIC_URL}/assets/images/icons/token_icons/binance_32.webp`}
				height={size}
				width={size}
			/>
		);
	}
	return (
		<ImageTag
			src={`${process.env.PUBLIC_URL}/images/default-token.png`}
			height={size}
			width={size}
		/>
	);
};
