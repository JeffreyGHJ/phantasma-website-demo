import Proposal from './types/Proposal';
import { createSlice } from '@reduxjs/toolkit';
import { proposalStateFilters } from './constants';

type DaoState = {
	space: string;
	proposalsPerPage: number;
	proposalStateFilter: string;
	page: number;
	lastPage: number;
	proposals: Array<Proposal>;
};

const initialState: DaoState = {
	space: 'littleghosts.eth',
	proposalsPerPage: 7,
	proposalStateFilter: proposalStateFilters.ALL,
	page: 1,
	lastPage: 1,
	proposals: [],
};

const DaoSlice = createSlice({
	name: 'dao',
	initialState,
	reducers: {
		updateProposalStateFilter(state, action) {
			state.proposalStateFilter = action.payload;
		},
		updatePage(state, action) {
			state.page = action.payload;
		},
		updateLastPage(state, action) {
			state.lastPage = action.payload;
		},
		updateProposals(state, action) {
			state.proposals = action.payload;
		},
	},
});

export const {
	updateProposalStateFilter,
	updatePage,
	updateLastPage,
	updateProposals,
} = DaoSlice.actions;

export default DaoSlice.reducer;
