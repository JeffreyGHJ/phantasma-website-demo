import { logout } from '../apis/web/web.api';
import { useCallback } from 'react';
import { useUpdateUser } from '../state/application/hooks';

const useLogout = () => {
	const updateUser = useUpdateUser();

	return useCallback(() => {
		logout().catch((error) => {
			console.log(error);
		});
		updateUser(null);
	}, [updateUser]);
};

export default useLogout;
