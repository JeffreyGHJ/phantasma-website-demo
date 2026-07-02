import application from './application/reducer';
import community from './community';
import { configureStore } from '@reduxjs/toolkit';
import dao from './dao/dao.slice';
import lootbox from './lootbox/lootbox.slice';
import marketplace from './marketplace/marketplace.slice';
import multicall from './multicall/reducer';

const store = configureStore({
	reducer: {
		application,
		community,
		multicall,
		marketplace,
		dao,
		lootbox,
	},
});

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
