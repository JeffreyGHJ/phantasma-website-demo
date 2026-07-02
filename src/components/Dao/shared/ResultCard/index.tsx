import './index.scss';

import PropTypes from 'prop-types';
import Translation from '../../../widgets/Translation';
import { useTranslation } from 'react-i18next';

const ResultCard = (props) => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'Dao.ProposalDetails.ResultCard',
	});

	const { children } = props;

	return (
		<div className='DaoComponent ResultCard'>
			<div className='card' id='SingleChoiceResultBox'>
				<div className='card-header'>
					<Translation ready={ready}>
						{t('title', { defaultValue: 'Results' })}
					</Translation>
				</div>
				<div className='card-body'>{children}</div>
			</div>
		</div>
	);
};

ResultCard.propTypes = {
	children: PropTypes.any,
};

export default ResultCard;
