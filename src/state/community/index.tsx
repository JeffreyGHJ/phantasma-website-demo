import CommunityCollection from './types/CommunityCollection';
import { createSlice } from '@reduxjs/toolkit';

type CommunityState = {
	collections: Array<CommunityCollection>;
};

const initialState: CommunityState = {
	collections: [],
};

const CommunitySlice = createSlice({
	name: 'community',
	initialState,
	reducers: {
		setCollections(state, action) {
			state.collections = action.payload;
		},
		setCollectionTokens(state, action) {
			state.collections[action.payload.index].tokens =
				action.payload.tokens;
		},
	},
});

export const { setCollectionTokens, setCollections } = CommunitySlice.actions;

export default CommunitySlice.reducer;
