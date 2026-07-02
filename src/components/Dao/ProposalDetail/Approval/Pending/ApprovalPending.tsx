import './ApprovalPending.scss';

import { Grid, LinearProgress, Tooltip, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react';

import BackButton from '../../../BackButton/BackButton';
import InformationCard from '../../../shared/InformationCard';
import PendingResultCard from '../../../shared/PendingResultCard';
import Proposal from '../../../../../state/dao/types/Proposal';
import ProposalCard from '../../../shared/ProposalCard';
import Space from '../../../../../state/dao/types/Space';
import cogoToast from 'cogo-toast';
import { displayUntilLength } from '../../../../../utils/StringUtil';
import { fetchSpace } from '../../../../../state/dao/apis';
import { handleSnapshotError } from '../../../../../utils/SnapshotResponseUtil';
import { handleWeb3Error } from '../../../../../utils/Web3ResponseUtil';
import snapshot from '@snapshot-labs/snapshot.js';
import { toastOptions } from '../../../../../configs/CogoToast';
import { useActiveWeb3React } from '../../../../../hooks';
import { useNavigate } from 'react-router-dom';

const hub = 'https://hub.snapshot.org'; // or https://testnet.snapshot.org for testnet
const client = new snapshot.Client712(hub);

const ApprovalPending = ({ proposal }: { proposal: Proposal }) => {
	const { account, library } = useActiveWeb3React();
	const navigate = useNavigate();
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
		<div id='ApprovalPending'>
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

export default ApprovalPending;
