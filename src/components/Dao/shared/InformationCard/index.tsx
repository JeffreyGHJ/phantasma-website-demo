import './index.scss';

import ExternalLink from '../../../widgets/ExternalLink/ExternalLink';
import { Grid } from '@mui/material';
import { ImageTag } from '../../../../utils/ImageUtil';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Proposal from '../../../../state/dao/types/Proposal';
import Space from '../../../../state/dao/types/Space';
import StrategiesDialog from '../../../shared/StrategiesDialog/StrategiesDialog';
import Translation from '../../../widgets/Translation';
import { format } from 'date-fns';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { votingSystemsDisplay } from '../../../../state/dao/constants';

const InformationCard = ({
	space,
	proposal,
}: {
	space: Space;
	proposal: Proposal;
}) => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'Dao.ProposalDetails.InformationCard',
	});

	const { t: t2, ready: ready2 } = useTranslation('translation', {
		keyPrefix: 'Dao.voting_systems',
	});

	const [strategiesDialogOpen, setStrategiesDialogOpen] = useState(false);
	const handleStrategiesDialogClose = () => {
		setStrategiesDialogOpen(false);
	};

	return (
		<div className='DaoComponent InformationCard'>
			<div className='card'>
				<div className='card-header'>
					<Translation ready={ready}>
						{t('title', { defaultValue: 'Information' })}
					</Translation>
				</div>
				<div className='card-body'>
					<Grid
						container
						justifyContent='space-between'
						className='grid-row strategy-grid-container'
					>
						<Grid item>
							<div className='left'>
								<Translation ready={ready}>
									{t('strategies', {
										defaultValue: 'Strategie(s)',
									})}
								</Translation>
							</div>
						</Grid>
						<Grid item className='right'>
							<div
								onClick={() => {
									setStrategiesDialogOpen(true);
								}}
							>
								{space &&
									proposal.strategies.map((strategy) => {
										return (
											<ImageTag
												key={strategy.params.address}
												height={'30'}
												width={'30'}
												src={`${process.env.PUBLIC_URL}/littleghostsSnapshotStrategy.webp`}
												style={{
													borderRadius: '50px',
													marginLeft: '1rem',
												}}
												title={strategy.params.symbol}
											/>
										);
									})}
							</div>
							<StrategiesDialog
								open={strategiesDialogOpen}
								handleClose={handleStrategiesDialogClose}
								strategies={proposal.strategies}
							/>
						</Grid>
					</Grid>
					<Grid
						container
						justifyContent='space-between'
						className='grid-row'
					>
						<Grid item>
							<div className='left'>
								<Translation ready={ready}>
									{t('author', {
										defaultValue: 'Author',
									})}
								</Translation>
							</div>
						</Grid>
						<Grid item className='right'>
							<div>
								<ExternalLink
									href={`https://bscscan.com/address/${proposal?.author}`}
								>
									{`${proposal?.author.slice(
										0,
										6
									)}...${proposal?.author.slice(-4)}`}
								</ExternalLink>
							</div>
						</Grid>
					</Grid>
					<Grid
						container
						justifyContent='space-between'
						className='grid-row'
					>
						<Grid item>
							<div className='left'>
								<Translation ready={ready}>
									{t('ipfs', {
										defaultValue: 'IPFS',
									})}
								</Translation>
							</div>
						</Grid>
						<Grid item className='right'>
							<div>
								<ExternalLink
									href={`https://cloudflare-ipfs.com/ipfs/${proposal?.ipfs}`}
								>
									#{proposal?.ipfs.slice(0, 7)}{' '}
									<OpenInNewIcon />
								</ExternalLink>
							</div>
						</Grid>
					</Grid>
					<Grid
						container
						justifyContent='space-between'
						className='grid-row'
					>
						<Grid item>
							<div className='left'>
								<Translation ready={ready}>
									{t('voting_system', {
										defaultValue: 'Voting system',
									})}
								</Translation>
							</div>
						</Grid>
						<Grid item className='right'>
							<Translation ready={ready2}>
								<div>
									{t2(votingSystemsDisplay[proposal.type], {
										defaultValue:
											votingSystemsDisplay[proposal.type],
									})}
								</div>
							</Translation>
						</Grid>
					</Grid>
					<Grid
						container
						justifyContent='space-between'
						className='grid-row'
					>
						<Grid item>
							<div className='left'>
								<Translation ready={ready}>
									{t('start_date', {
										defaultValue: 'Start date',
									})}
								</Translation>
							</div>
						</Grid>
						<Grid item className='right'>
							<div>
								{format(
									new Date(
										proposal ? proposal.start * 1000 : 0
									),
									'MMM dd, yyyy, hh:mm a'
								)}
							</div>
						</Grid>
					</Grid>
					<Grid
						container
						justifyContent='space-between'
						className='grid-row'
					>
						<Grid item>
							<div className='left'>
								<Translation ready={ready}>
									{t('end_date', {
										defaultValue: 'End date',
									})}
								</Translation>
							</div>
						</Grid>
						<Grid item className='right'>
							<div>
								{format(
									new Date(
										proposal ? proposal.end * 1000 : 0
									),
									'MMM dd, yyyy, hh:mm a'
								)}
							</div>
						</Grid>
					</Grid>
					<Grid
						container
						justifyContent='space-between'
						className='grid-row'
					>
						<Grid item>
							<div className='left'>
								<Translation ready={ready}>
									{t('snapshot', {
										defaultValue: 'Snapshot',
									})}
								</Translation>
							</div>
						</Grid>
						<Grid item className='right'>
							<div>
								<ExternalLink
									href={`https://bscscan.com/block/${proposal?.snapshot}`}
								>
									{proposal
										? (+proposal.snapshot).toLocaleString()
										: ''}{' '}
									<OpenInNewIcon />
								</ExternalLink>
							</div>
						</Grid>
					</Grid>
				</div>
			</div>
		</div>
	);
};

export default InformationCard;
