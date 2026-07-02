import { ectoSkeletonNFTAddress } from '../../../constants/ContractAddresses';

export const petTypes = {
	ECTOSKELETONS: 'ectoskeletons',
};

export const petCollectionNameByType = {
	[petTypes.ECTOSKELETONS]: 'EctoSkeletons',
};

export const petCollectionAddressByType = {
	[petTypes.ECTOSKELETONS]: ectoSkeletonNFTAddress,
};

export const petCollectionPathByType = {
	[petTypes.ECTOSKELETONS]: 'skeleton',
};

export const allPetTypes = Object.values(petTypes);
