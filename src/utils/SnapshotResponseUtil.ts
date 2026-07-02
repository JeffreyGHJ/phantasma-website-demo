import cogoToast from 'cogo-toast';
import { toastOptions } from '../configs/CogoToast';

export const handleSnapshotError = (err) => {
	if (err.error_description) {
		cogoToast.error(err.error_description, { ...toastOptions });
	}
};
