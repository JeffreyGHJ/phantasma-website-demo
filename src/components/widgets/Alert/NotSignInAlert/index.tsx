import './index.scss';

import { Alert } from '@mui/material';
import Loading from '../../Loading';
import { useTranslation } from 'react-i18next';

const NotSignInAlert = () => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'widgets.NotSignInAlert',
	});

	return (
		<div className='widget NotSignInAlert'>
			<Alert severity='warning'>
				<Loading loading={!ready}>
					{t('alert', { defaultValue: 'You are not signed in' })}
				</Loading>
			</Alert>
		</div>
	);
};

export default NotSignInAlert;
