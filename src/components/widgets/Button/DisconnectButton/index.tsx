import './index.scss';

import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import Loading from '../../Loading';
import useDisconnect from '../../../../hooks/useDisconnect';
import { useTranslation } from 'react-i18next';

export const DisconnectButton = () => {
	const disconnect = useDisconnect();
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'widgets.DisconnectButton',
	});

	return (
		<button
			className='widget DisconnectButton'
			onClick={() => {
				disconnect();
			}}
		>
			<ExitToAppOutlinedIcon fontSize='large' className='nav-item-icon' />
			<span className='label'>
				<Loading loading={!ready}>
					{t('disconnect', { defaultValue: 'Disconnect' })}
				</Loading>
			</span>
		</button>
	);
};
