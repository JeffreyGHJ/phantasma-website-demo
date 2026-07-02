import {
	busdTokenAddress,
	ectoContractAddress,
	wbnbTokenAddress,
} from './ContractAddresses';

import Token from './types/Token';

/**
 * @deprecated see CATEGORY_ROUTES_TAB_MAP in src\models\util_models\RouteUtilModel\index.ts
 */
export const routesTabMap = {
	ghosts: 0,
	pets: 1,
	armory: 2,
	supplies: 3,
	multipliers: 4,
};

/**
 * @deprecated see CATEGORY_ROUTES_TAB_REVERSE_MAP in src\models\util_models\RouteUtilModel\index.ts
 */
export const routesTabReverseMap = {
	0: 'ghosts',
	1: 'pets',
	2: 'armory',
	3: 'supplies',
	4: 'multipliers',
};

export const paymentTokens = [
	{
		name: 'ECTO',
		decimals: 9,
		tokenAddress: ectoContractAddress,
	},
	{
		name: 'BUSD',
		decimals: 18,
		tokenAddress: busdTokenAddress,
	},
	{
		name: 'WBNB',
		decimals: 18,
		tokenAddress: wbnbTokenAddress,
	},
] as Array<Token>;
