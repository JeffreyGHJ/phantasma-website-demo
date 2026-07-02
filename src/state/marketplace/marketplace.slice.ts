import { CollectionDetail } from './types/CollectionDetail';
import { createSlice } from '@reduxjs/toolkit';

type MarketplaceState = {
	bnbPrice: number | string;
	volumes: Record<string, number | string>;
	collectionDetails: Record<string, CollectionDetail>;
	filters: Record<string, Record<string, Array<string>>>;
	selectedFilters: Record<string, Record<string, Array<string>>>;
	forSales: Record<string, string>;
	sortBys: Record<string, string>;
	pages: Record<string, number>;
};

const initialState: MarketplaceState = {
	bnbPrice: 0,
	volumes: {},
	collectionDetails: {},
	filters: {},
	selectedFilters: {},
	forSales: {},
	sortBys: {},
	pages: {},
};

const MarketplaceSlice = createSlice({
	name: 'marketplace',
	initialState,
	reducers: {
		setBnbPrice(state, action) {
			state.bnbPrice = action.payload;
		},
		setVolumes(state, action) {
			state.volumes = { ...state.volumes, ...action.payload };
		},
		setCollectionDetails(state, action) {
			state.collectionDetails = {
				...state.collectionDetails,
				...action.payload,
			};
		},
		setFilters(state, action) {
			state.filters = {
				...state.filters,
				...action.payload,
			};
		},
		setSelectedFilters(state, action) {
			state.selectedFilters = {
				...state.selectedFilters,
				...action.payload,
			};
		},
		setForSales(state, action) {
			state.forSales = {
				...state.forSales,
				...action.payload,
			};
		},
		setSortBys(state, action) {
			state.sortBys = {
				...state.sortBys,
				...action.payload,
			};
		},
		setPages(state, action) {
			state.pages = {
				...state.pages,
				...action.payload,
			};
		},
	},
});

export const {
	setBnbPrice,
	setVolumes,
	setCollectionDetails,
	setFilters,
	setSelectedFilters,
	setForSales,
	setSortBys,
	setPages,
} = MarketplaceSlice.actions;

export default MarketplaceSlice.reducer;
