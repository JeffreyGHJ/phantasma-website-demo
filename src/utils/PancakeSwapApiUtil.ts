import { TESTNET } from '../constants/global';
import axios from 'axios';

export interface PancakeSwapAPITokenType {
	name: string;
	price: string;
	price_BNB: string;
	symbol: string;
}

export const getTokenInfoWithPrice = (
	tokenAddress: string
): Promise<PancakeSwapAPITokenType> => {
	if (TESTNET) {
		return new Promise((res, rej) => {
			res({
				name: '',
				price: '0',
				price_BNB: '0',
				symbol: '',
			});
		});
	}

	if(tokenAddress.startsWith("0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c")){
		return axios
			.get(`https://api.binance.com/api/v3/ticker/price?symbol=BNBBUSD`)
			.then((response: any) => {
				return response.data as PancakeSwapAPITokenType;
			});
	}

	return axios
		.get(`https://api.pancakeswap.info/api/v2/tokens/${tokenAddress}`)
		.then((response: any) => {
			return response.data.data as PancakeSwapAPITokenType;
		});
};
