import './index.scss';

import { Grid, LinearProgress, Tooltip } from '@mui/material';

import Proposal from '../../../../state/dao/types/Proposal';
import Space from '../../../../state/dao/types/Space';
import Translation from '../../../widgets/Translation';
import { displayUntilLength } from '../../../../utils/StringUtil';
import { useTranslation } from 'react-i18next';

const PendingResultCard = ({
	proposal,
	space,
}: {
	proposal: Proposal;
	space: Space;
}) => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'Dao.ProposalDetails.PendingResultCard',
	});

	return (
		<div className='DaoComponent PendingResultCard'>
			<div className='card'>
				<div className='card-header'>
					<Translation ready={ready}>
						{t('title', {
							defaultValue: 'Current Results',
						})}
					</Translation>
				</div>
				<div className='card-body'>
					<Grid container direction='column'>
						{proposal.choices.map((choice, index) => {
							return (
								<Grid item key={index} className='choice'>
									<Grid
										container
										justifyContent='space-between'
									>
										<Grid item className='left'>
											<Tooltip
												title={choice}
												placement='top-start'
											>
												<span>{`${displayUntilLength(
													choice,
													14
												)} 0 ${space.symbol}`}</span>
											</Tooltip>
										</Grid>
										<Grid item className='right'>
											{0}
										</Grid>
									</Grid>
									<LinearProgress
										variant='determinate'
										value={0}
									/>
								</Grid>
							);
						})}
					</Grid>
				</div>
			</div>
		</div>
	);
};

export default PendingResultCard;
