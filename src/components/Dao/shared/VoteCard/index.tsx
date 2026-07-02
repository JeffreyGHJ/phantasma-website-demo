import Translation from '../../../widgets/Translation';
import { useTranslation } from 'react-i18next';

const VoteCard = (props) => {
	const { vp, VoteButton, children } = props;

	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'Dao.ProposalDetails.VoteCard',
	});

	return (
		<div className='DaoComponent VoteCard'>
			<div className='card pt-4 pb-4'>
				<div className='card-header d-flex justify-content-between'>
					<div>
						<Translation ready={ready}>
							{t('title', {
								defaultValue: 'Cast your vote',
							})}
						</Translation>
					</div>
					<div>VP: {vp}</div>
				</div>
				<div className='card-body'>
					{children}
					<Translation ready={ready}>
						<VoteButton>
							{' '}
							{t('vote', { defaultValue: 'Vote' })}
						</VoteButton>
					</Translation>
				</div>
			</div>
		</div>
	);
};

export default VoteCard;
