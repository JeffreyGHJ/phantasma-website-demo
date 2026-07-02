import './SingleChoicePending.scss';

import { Grid, useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';

import BackButton from '../../../BackButton/BackButton';
import InformationCard from '../../../shared/InformationCard';
import PendingResultCard from '../../../shared/PendingResultCard';
import Proposal from '../../../../../state/dao/types/Proposal';
import ProposalCard from '../../../shared/ProposalCard';
import Space from '../../../../../state/dao/types/Space';
import { fetchSpace } from '../../../../../state/dao/apis';

const SingleChoicePending = ({ proposal }: { proposal: Proposal }) => {
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
		<div id='SingleChoicePending'>
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
										<PendingResultCard
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

export default SingleChoicePending;
