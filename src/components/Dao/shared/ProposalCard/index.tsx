import './index.scss';

import DropdownMenu from '../../../widgets/DropdownMenu';
import DropdownMenuItem from '../../../widgets/DropdownMenu/DropdownMenuItem';
import { Grid } from '@mui/material';
import IconButton from '../../../widgets/Button/IconButton/IconButton';
import MDEditor from '@uiw/react-md-editor';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Proposal from '../../../../state/dao/types/Proposal';
import Space from '../../../../state/dao/types/Space';
import Translation from '../../../widgets/Translation';
import WebShareDialog from '../../../shared/WebShareDialog/WebShareDialog';
import cogoToast from 'cogo-toast';
import { handleSnapshotError } from '../../../../utils/SnapshotResponseUtil';
import { handleWeb3Error } from '../../../../utils/Web3ResponseUtil';
import snapshot from '@snapshot-labs/snapshot.js';
import { toastOptions } from '../../../../configs/CogoToast';
import { useActiveWeb3React } from '../../../../hooks';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const hub = 'https://hub.snapshot.org'; // or https://testnet.snapshot.org for testnet
const client = new snapshot.Client712(hub);

const ProposalCard = ({
	space,
	proposal,
}: {
	space: Space;
	proposal: Proposal;
}) => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'Dao.ProposalDetails.ProposalCard',
	});
	const { t: t2, ready: ready2 } = useTranslation('translation', {
		keyPrefix: 'Dao.statuses',
	});

	const { account, library } = useActiveWeb3React();
	const [moreActionsAnchorEl, setMoreActionsAnchorEl] = useState(null);
	const navigate = useNavigate();
	const handleMoreActionsClick = (event) => {
		setMoreActionsAnchorEl(event.currentTarget);
	};
	const handleMoreActionsMenuClose = () => {
		setMoreActionsAnchorEl(null);
	};

	const duplicateProposal = () => {
		navigate(`/dao/create/${proposal?.id}`);
	};

	const cancelProposal = async () => {
		if (!library || !account || !space || !space.admins.includes(account)) {
			return;
		}

		try {
			const receipt = await client.cancelProposal(library, account, {
				space: proposal.space.id,
				proposal: proposal.id,
			});
			cogoToast.success(
				'Proposal is successfully deleted!',
				toastOptions
			);
			navigate('/dao');
		} catch (error: any) {
			if (error.error_description) {
				handleSnapshotError(error);
			} else {
				handleWeb3Error(error);
			}
			console.log(error);
		}
	};

	return (
		<div className='DaoComponent ProposalCard'>
			<div className='proposal-title'>{proposal?.title}</div>
			<Grid container justifyContent='space-between'>
				<Grid item>
					<div
						className={`status text-end status-badge-${proposal?.state}`}
					>
						<Translation ready={ready2}>
							<span>
								{t2(proposal.state, {
									defaultValue: proposal.state,
								})}
							</span>
						</Translation>
					</div>
				</Grid>
				<Grid item>
					<Grid container>
						<Grid item>
							<Translation ready={ready}>
								<IconButton onClick={handleMoreActionsClick}>
									<MoreHorizIcon fontSize='large' />
								</IconButton>
								<DropdownMenu
									anchorEl={moreActionsAnchorEl}
									keepMounted
									open={Boolean(moreActionsAnchorEl)}
									onClose={handleMoreActionsMenuClose}
									anchorOrigin={{
										vertical: 'bottom',
										horizontal: 'left',
									}}
								>
									<DropdownMenuItem
										onClick={duplicateProposal}
									>
										{t('duplicate_proposal', {
											defaultValue: 'Duplicate proposal',
										})}
									</DropdownMenuItem>
									{library &&
										account &&
										space &&
										space.admins.includes(account) && (
											<DropdownMenuItem
												onClick={cancelProposal}
											>
												{t('delete_proposal', {
													defaultValue:
														'Delete proposal',
												})}
											</DropdownMenuItem>
										)}
								</DropdownMenu>
							</Translation>
						</Grid>
						<Grid item>
							<WebShareDialog
								title={proposal ? proposal.title : ''}
								url={window.location.href}
							/>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			<div className='proposal-details'>
				<MDEditor.Markdown source={proposal?.body} />
			</div>
		</div>
	);
};

export default ProposalCard;
