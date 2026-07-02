import {
	allArmoryTypes,
	armoryTypes,
} from '../components/Marketplace/constants/armoryTypes';
import {
	allMarketplaces,
	marketplaceTypes,
} from '../components/Marketplace/constants/marketplaceTypes';
import {
	allOfferActionTypes,
	offerActionTypes,
} from '../components/Marketplace/constants/offerActionTypes';
import {
	allOfferTypes,
	offerTypes,
} from '../components/Marketplace/constants/offerTypes';
import {
	allPetTypes,
	petTypes,
} from '../components/Marketplace/constants/petTypes';
import {
	allSaleTypes,
	saleTypes,
} from '../components/Marketplace/constants/saleTypes';
import {
	allSortTypes,
	saleSortTypes,
} from '../components/Marketplace/constants/sortTypes';
import {
	allSupplyTypes,
	supplyTypes,
} from '../components/Marketplace/constants/SupplyTypes';
import {
	allViewTypes,
	viewTypes,
} from '../components/Marketplace/constants/viewTypes';

import { cloneDeep } from 'lodash';

export function isAuctionType(_params: URLSearchParams) {
	const saleType = getSaleTypeFromURL(_params);
	return saleType === saleTypes.AUCTION;
}

export function isAllSaleType(_params: URLSearchParams) {
	const saleType = getSaleTypeFromURL(_params);
	return saleType === saleTypes.ALL;
}

export function getSaleTypeFromURL(
	_params: URLSearchParams,
	defaultSaleType?: string
) {
	const saleType = _params.get('saleType');

	if (saleType && allSaleTypes.includes(saleType)) {
		return saleType;
	}

	if (defaultSaleType && allSaleTypes.includes(defaultSaleType)) {
		return defaultSaleType;
	}
	return saleTypes.ALL;
}

export function getViewTypeFromURL(_params: URLSearchParams) {
	const viewType = _params.get('viewType');

	if (viewType && allViewTypes.includes(viewType)) {
		return viewType;
	}
	return viewTypes.GRID_VIEW;
}

export function getPetTypeFromURL(_params: URLSearchParams) {
	const petType = _params.get('petType');

	if (petType && allPetTypes.includes(petType)) {
		return petType;
	}
	return petTypes.ECTOSKELETONS;
}

export function getSupplyTypeFromURL(_params: URLSearchParams) {
	const supplyType = _params.get('supplyType');

	if (supplyType && allSupplyTypes.includes(supplyType)) {
		return supplyType;
	}
	return supplyTypes.FOUNDERS_LOOTBOXES;
}

export function getArmoryTypeFromURL(_params: URLSearchParams) {
	const armoryType = _params.get('armoryType');

	if (armoryType && allArmoryTypes.includes(armoryType)) {
		return armoryType;
	}
	return armoryTypes.FOUNDERS_ARMORY;
}

export function getSortTypeFromURL(
	_params: URLSearchParams,
	defaultSortType?: string
) {
	const sortType = _params.get('sortType');
	if (sortType && allSortTypes.includes(sortType)) {
		return sortType;
	}

	if (defaultSortType) {
		return defaultSortType;
	}
	return saleSortTypes.HIGHEST_RANK;
}

export function getPageFromURL(_params: URLSearchParams) {
	const page = _params.get('page');
	if (page && !isNaN(+page) && +page >= 1) {
		return +page;
	}
	return 1;
}

export function getMarketplacesFromURL(_params: URLSearchParams) {
	let marketplaces: null | string | Array<string> =
		_params.get('marketplaces');
	if (!marketplaces) {
		return [marketplaceTypes.LG_MARKETPLACE, marketplaceTypes.PANCAKESWAP];
	}

	if (marketplaces.includes(',')) {
		const returnMarketplaces: Array<string> = [];
		marketplaces = marketplaces.split(',');
		marketplaces.forEach((marketplace) => {
			if (allMarketplaces.includes(marketplace)) {
				returnMarketplaces.push(marketplace);
			}
		});
		if (returnMarketplaces.length) {
			return returnMarketplaces;
		}
		return allMarketplaces;
	}

	if (allMarketplaces.includes(marketplaces)) {
		return [marketplaces];
	}
	return allMarketplaces;
}

export function getAttributesFromURL(
	filters: Record<string, Array<string>>,
	_params: URLSearchParams
) {
	const attributeKeys = Object.keys(filters);
	const filterAttributes = attributeKeys.reduce((curr, next) => {
		curr[next] = [];
		return curr;
	}, {});

	attributeKeys.forEach((attributeKey) => {
		let attributes: null | string | Array<string> =
			_params.get(attributeKey);
		if (attributes) {
			try {
				attributes = decodeURIComponent(attributes);
			} catch (err) {
				console.log(err);
			}
			if (attributes.includes(',')) {
				attributes = Array.from(new Set(attributes.split(',')));
				attributes.forEach((attribute) => {
					if (filters[attributeKey].includes(attribute)) {
						filterAttributes[attributeKey].push(attribute);
					}
				});
			} else if (filters[attributeKey].includes(attributes)) {
				filterAttributes[attributeKey].push(attributes);
			}
		}
	});

	return filterAttributes;
}

export function _didFilterChange(
	filter1: Record<string, Array<string>>,
	filter2: Record<string, Array<string>>
) {
	filter1 = cloneDeep(filter1);
	filter2 = cloneDeep(filter2);
	const filterKeys1 = Object.keys(filter1);
	const filterKeys2 = Object.keys(filter2);

	if (filterKeys1.length !== filterKeys2.length) {
		return true;
	}

	for (let i = 0; i < filterKeys1.length; i++) {
		const filterKey = filterKeys1[i];
		if (!(filterKey in filter2)) {
			return true;
		}
		const filterSets1 = Array.from(new Set(filter1[filterKey]));
		const filterSets2 = Array.from(new Set(filter2[filterKey]));
		if (filterSets1.length !== filterSets2.length) {
			return true;
		}

		for (let k = 0; k < filterSets1.length; k++) {
			const value = filterSets1[k];
			if (!filterSets2.includes(value)) {
				return true;
			}
		}
	}

	return false;
}

export function getOfferActionTypeFromURL(_params: URLSearchParams) {
	const offerActionType = _params.get('offerActionType');

	if (offerActionType && allOfferActionTypes.includes(offerActionType)) {
		return offerActionType;
	}
	return offerActionTypes.RECEIVED;
}

export function getOfferTypeFromURL(_params: URLSearchParams) {
	const offerType = _params.get('offerType');

	if (offerType && allOfferTypes.includes(offerType)) {
		return offerType;
	}
	return offerTypes.TOKEN_OFFERS;
}
