import './BackButton.scss';

import { Link } from 'react-router-dom';
import Translation from '../../widgets/Translation';
import { useTranslation } from 'react-i18next';

const BackButton = () => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'widgets.BackButton',
	});
	return (
		<div id='BackButton' className='mt-5'>
			<Translation ready={ready}>
				<Link to={'/dao'}>← {t('back', { defaultValue: 'Back' })}</Link>
			</Translation>
		</div>
	);
};

export default BackButton;
