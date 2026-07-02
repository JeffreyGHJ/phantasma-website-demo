import './BasicPending.scss';

import {
	Grid,
	IconButton,
	LinearProgress,
	Menu,
	MenuItem,
	useMediaQuery,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
	capitalizeFirstLetter,
	displayUntilLength,
} from '../../../../../utils/StringUtil';

import BackButton from '../../../BackButton/BackButton';
import ExternalLink from '../../../../widgets/ExternalLink/ExternalLink';
import { ImageTag } from '../../../../../utils/ImageUtil';
import MDEditor from '@uiw/react-md-editor';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Proposal from '../../../../../state/dao/types/Proposal';
import Space from '../../../../../state/dao/types/Space';
import StrategiesDialog from '../../../../shared/StrategiesDialog/StrategiesDialog';
import WebShareDialog from '../../../../shared/WebShareDialog/WebShareDialog';
import cogoToast from 'cogo-toast';
import { fetchSpace } from '../../../../../state/dao/apis';
import { format } from 'date-fns';
import { handleSnapshotError } from '../../../../../utils/SnapshotResponseUtil';
import { handleWeb3Error } from '../../../../../utils/Web3ResponseUtil';
import snapshot from '@snapshot-labs/snapshot.js';
import { toastOptions } from '../../../../../configs/CogoToast';
import { useActiveWeb3React } from '../../../../../hooks';
import { useNavigate } from 'react-router-dom';

const hub = 'https://hub.snapshot.org'; // or https://testnet.snapshot.org for testnet
const client = new snapshot.Client712(hub);

const BasicPending = ({ proposal }: { proposal: Proposal }) => {
	const { account, library } = useActiveWeb3React();
	const navigate = useNavigate();
	const [space, setSpace] = useState(null as Space | null);
	const [strategiesDialogOpen, setStrategiesDialogOpen] = useState(false);
	const handleStrategiesDialogClose = () => {
		setStrategiesDialogOpen(false);
	};
	// More Actions
	const [moreActionsAnchorEl, setMoreActionsAnchorEl] = React.useState(null);
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
		<div id='BasicPending'>
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
						<div>
							<div className='proposal-title'>
								{proposal?.title}
							</div>
							<Grid container justifyContent='space-between'>
								<Grid item>
									<div
										className={`status text-end status-badge-${proposal?.state}`}
									>
										<span>
											{capitalizeFirstLetter(
												proposal ? proposal.state : ''
											)}
										</span>
									</div>
								</Grid>
								<Grid item>
									<Grid container>
										<Grid item>
											<IconButton
												className='icon-button'
												onClick={handleMoreActionsClick}
											>
												<MoreHorizIcon fontSize='large' />
											</IconButton>
											<Menu
												anchorEl={moreActionsAnchorEl}
												keepMounted
												open={Boolean(
													moreActionsAnchorEl
												)}
												onClose={
													handleMoreActionsMenuClose
												}
												anchorOrigin={{
													vertical: 'bottom',
													horizontal: 'left',
												}}
											>
												<MenuItem
													onClick={duplicateProposal}
												>
													Duplicate proposal
												</MenuItem>
												{library &&
													account &&
													space &&
													space.admins.includes(
														account
													) && (
														<MenuItem
															onClick={
																cancelProposal
															}
														>
															Delete proposal
														</MenuItem>
													)}
											</Menu>
										</Grid>
										<Grid item>
											<WebShareDialog
												title={
													proposal
														? proposal.title
														: ''
												}
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
									<div className='card'>
										<div className='card-header'>
											Information
										</div>
										<div className='card-body'>
											<Grid
												container
												justifyContent='space-between'
												className='grid-row strategy-grid-container'
											>
												<Grid item>
													<div className='left'>
														Strategie(s)
													</div>
												</Grid>
												<Grid item className='right'>
													<div
														onClick={() => {
															setStrategiesDialogOpen(
																true
															);
														}}
													>
														{space &&
															proposal.strategies.map(
																(strategy) => {
																	return (
																		<ImageTag
																			key={
																				strategy
																					.params
																					.address
																			}
																			height={
																				'30'
																			}
																			width={
																				'30'
																			}
																			src={`https://worker.snapshot.org/mirror?img=https%3A%2F%2Fcloudflare-ipfs.com%2Fipfs%2F${
																				space.avatar.split(
																					'ipfs://'
																				)[1]
																			}`}
																			style={{
																				borderRadius:
																					'50px',
																				marginLeft:
																					'1rem',
																			}}
																			title={
																				strategy
																					.params
																					.symbol
																			}
																		/>
																	);
																}
															)}
													</div>
													<StrategiesDialog
														open={
															strategiesDialogOpen
														}
														handleClose={
															handleStrategiesDialogClose
														}
														strategies={
															space
																? space.strategies
																: []
														}
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
														Author
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
															)}...${proposal?.author.slice(
																-4
															)}`}
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
														IPFS
													</div>
												</Grid>
												<Grid item className='right'>
													<div>
														<ExternalLink
															href={`https://cloudflare-ipfs.com/ipfs/${proposal?.ipfs}`}
														>
															#
															{proposal?.ipfs.slice(
																0,
																7
															)}{' '}
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
														Voting system
													</div>
												</Grid>
												<Grid item className='right'>
													<div>Basic voting</div>
												</Grid>
											</Grid>
											<Grid
												container
												justifyContent='space-between'
												className='grid-row'
											>
												<Grid item>
													<div className='left'>
														Start date
													</div>
												</Grid>
												<Grid item className='right'>
													<div>
														{format(
															new Date(
																proposal
																	? proposal.start *
																	  1000
																	: 0
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
														End date
													</div>
												</Grid>
												<Grid item className='right'>
													<div>
														{format(
															new Date(
																proposal
																	? proposal.end *
																	  1000
																	: 0
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
														Snapshot
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
								</Grid>
								<Grid item className='row-item'>
									{proposal && space && (
										<SingleChoiceResultBox
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

const SingleChoiceResultBox = ({
	proposal,
	space,
}: {
	proposal: Proposal;
	space: Space;
}) => {
	return (
		<div className='card' id='SingleChoiceResultBox'>
			<div className='card-header'>Current Results</div>
			<div className='card-body'>
				<Grid container direction='column'>
					{proposal.choices.map((choice, index) => {
						return (
							<Grid item key={index} className='choice'>
								<Grid container justifyContent='space-between'>
									<Grid
										item
										className='left'
									>{`${displayUntilLength(choice, 14)} 0 ${
										space.symbol
									}`}</Grid>
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
	);
};

export default BasicPending;
