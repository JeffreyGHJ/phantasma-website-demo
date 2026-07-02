import { setCollectionTokens, setCollections } from '.';
import { useDispatch, useSelector } from 'react-redux';

import { AppState } from '..';
import CommunityCollection from './types/CommunityCollection';
import CommunityCollectionToken from './types/CommunityCollectionToken';
import { useCallback } from 'react';

export const useCollections = (): Array<CommunityCollection> => {
	return useSelector((state: AppState) => state.community.collections);
};

export const useUpdateCollections = (): ((
	collections: Array<CommunityCollection>
) => void) => {
	const dispatch = useDispatch();
	return useCallback(
		(collections) => dispatch(setCollections(collections)),
		[dispatch]
	);
};

export const useUpdateCollectionTokens = () => {
	const dispatch = useDispatch();
	return useCallback(
		(item: { index: number; tokens: Array<CommunityCollectionToken> }) => {
			dispatch(
				setCollectionTokens({
					index: item.index,
					tokens: item.tokens,
				})
			);
		},
		[dispatch]
	);
};
