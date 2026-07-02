import { useCallback } from 'react';
import { useUpdateUser } from '../state/application/hooks';

export const useHandleUnauthorizedResponse = (): (() => void) => {
	const updateUser = useUpdateUser();
	return useCallback(() => {
		updateUser(null);
	}, [updateUser]);
};
