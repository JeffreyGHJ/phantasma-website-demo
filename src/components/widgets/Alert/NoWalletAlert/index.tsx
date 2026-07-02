import './index.scss';

import { Alert } from '@mui/material';
import Loading from '../../Loading';
import { useTranslation } from 'react-i18next';

const NoWalletAlert = () => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'widgets.NoWalletAlert',
	});

	return (
		<div className='widget NoWalletAlert'>
			<Alert severity='warning'>
				<Loading loading={!ready}>
					{t('alert', { defaultValue: 'No wallet is connected' })}
				</Loading>
			</Alert>
		</div>
	);
};

export default NoWalletAlert;
