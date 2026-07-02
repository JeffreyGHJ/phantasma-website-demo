import './WeightedPending.scss';

import { Grid, LinearProgress, Tooltip, useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';

import BackButton from '../../../BackButton/BackButton';
import InformationCard from '../../../shared/InformationCard';
import Proposal from '../../../../../state/dao/types/Proposal';
import ProposalCard from '../../../shared/ProposalCard';
import ResultCard from '../../../shared/ResultCard';
import Space from '../../../../../state/dao/types/Space';
import { displayUntilLength } from '../../../../../utils/StringUtil';
import { fetchSpace } from '../../../../../state/dao/apis';

const WeightedPending = ({ proposal }: { proposal: Proposal }) => {
	const [space, setSpace] = useState(null as Space | null);

	const isMobile = useMediaQuery((theme: any) =>
		theme.breakpoints.down('md')
	);

	useEffect(() => {
		if (!proposal) {
			return;
		}

		fetchSpace({ id: proposal.space.id }).then((_space) => {
			setSpace(_space);
		});
	}, [proposal]);

	return (
		<div id='WeightedPending'>
			<BackButton />
			<div className='header my-5 d-flex justify-content-between'>
				<div className='title_wrapper'></div>
			</div>
			<div className='body'>
				<Grid
					container
					className='grid-row'
					spacing={isMobile ? 0 : 3}
					style={{ width: 'unset', marginLeft: 'unset' }}
				>
					<Grid
						item
						className='row-item proposal-question-answer'
						sm={12}
						md={6}
						lg={8}
					>
						{space && proposal && (
							<ProposalCard space={space} proposal={proposal} />
						)}
					</Grid>
					<Grid
						item
						className='row-item information'
						sm={12}
						md={6}
						lg={4}
					>
						<div>
							<Grid
								container
								className='grid-row'
								direction='column'
							>
								<Grid item className='row-item'>
									{space && proposal && (
										<InformationCard
											space={space}
											proposal={proposal}
										/>
									)}
								</Grid>
								<Grid item className='row-item'>
									{proposal && space && (
										<ResultBox
											proposal={proposal}
											space={space}
										/>
									)}
								</Grid>
							</Grid>
						</div>
					</Grid>
				</Grid>
			</div>
		</div>
	);
};

const ResultBox = ({
	proposal,
	space,
}: {
	proposal: Proposal;
	space: Space;
}) => {
	return (
		<ResultCard>
			<Grid container direction='column'>
				{proposal.choices.map((choice, index) => {
					return (
						<Grid item key={index} className='choice'>
							<Grid container justifyContent='space-between'>
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
									0%
								</Grid>
							</Grid>
							<LinearProgress variant='determinate' value={0} />
						</Grid>
					);
				})}
			</Grid>
		</ResultCard>
	);
};

export default WeightedPending;
