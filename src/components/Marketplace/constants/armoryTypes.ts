import RouteUtilModel from '../../../models/util_models/RouteUtilModel';
import { foundersItemsContractAddress } from '../../../constants/ContractAddresses';

export const armoryTypes = {
	FOUNDERS_ARMORY: 'founders_armory',
};

export const armoryCollectionNameByType = {
	[armoryTypes.FOUNDERS_ARMORY]: "Founder's Armory",
};

export const armoryCollectionAddressByType = {
	[armoryTypes.FOUNDERS_ARMORY]: foundersItemsContractAddress,
};

export const armoryCollectionPathByType = {
	[armoryTypes.FOUNDERS_ARMORY]:
		RouteUtilModel.MARKETPLACE_ITEM_FOUNDER_ITEM_URI,
};

export const allArmoryTypes = Object.values(armoryTypes);
