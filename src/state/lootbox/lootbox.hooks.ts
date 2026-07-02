import { useDispatch, useSelector } from 'react-redux';

import { AppState } from '..';
import { updateHideLootboxMintAlert } from './lootbox.slice';
import { useCallback } from 'react';

export const useHideLootboxMintAlert = (): boolean => {
	return useSelector((state: AppState) => state.lootbox.hideLootboxMintAlert);
};

export const useUpdateHideLootboxMintAlert = (): ((hide: boolean) => void) => {
	const dispatch = useDispatch();
	return useCallback(
		(hide) => dispatch(updateHideLootboxMintAlert(hide)),
		[dispatch]
	);
};
