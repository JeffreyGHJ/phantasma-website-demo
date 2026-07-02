import './index.scss';

import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import Loading from '../../Loading';
import useLogout from '../../../../hooks/useLogout';
import { useTranslation } from 'react-i18next';

export const LogoutButton = () => {
	const logout = useLogout();
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'widgets.LogoutButton',
	});

	return (
		<button
			className='widget LogoutButton'
			onClick={() => {
				logout();
			}}
		>
			<ExitToAppOutlinedIcon fontSize='large' className='nav-item-icon' />
			<span className='label'>
				<Loading loading={!ready}>
					{t('logout', { defaultValue: 'Logout' })}
				</Loading>
			</span>
		</button>
	);
};
