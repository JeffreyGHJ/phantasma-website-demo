import { createSlice } from '@reduxjs/toolkit';

type LootboxState = {
	hideLootboxMintAlert: boolean;
};

const initialState: LootboxState = {
	hideLootboxMintAlert: false,
};

const LootboxSlice = createSlice({
	name: 'lootbox',
	initialState,
	reducers: {
		updateHideLootboxMintAlert(state, action) {
			state.hideLootboxMintAlert = action.payload;
		},
	},
});

export const { updateHideLootboxMintAlert } = LootboxSlice.actions;

export default LootboxSlice.reducer;
