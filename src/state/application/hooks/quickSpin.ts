import { useDispatch, useSelector } from 'react-redux';

import { AppState } from '../..';
import { toggleQuickSpin } from '../actions';
import { useCallback } from 'react';

export function useQuickSpin(): boolean {
	return useSelector((state: AppState) => state.application.quickSpin);
}

export function useToggleQuickSpin(): () => void {
	const dispatch = useDispatch();
	return useCallback(() => dispatch(toggleQuickSpin()), [dispatch]);
}
