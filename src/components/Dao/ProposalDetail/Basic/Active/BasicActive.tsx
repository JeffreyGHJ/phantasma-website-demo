import './BasicActive.scss';

import {
	Grid,
	IconButton,
	LinearProgress,
	Menu,
	MenuItem,
	Pagination,
	useMediaQuery,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
	capitalizeFirstLetter,
	displayUntilLength,
} from '../../../../../utils/StringUtil';
import { cloneDeep, isNull } from 'lodash';
import {
	fetchAllVotes,
	fetchScores,
	fetchSpace,
	fetchVoteByVoter,
} from '../../../../../state/dao/apis';

import ExternalLink from '../../../../widgets/ExternalLink/ExternalLink';
import { ImageTag } from '../../../../../utils/ImageUtil';
import MDEditor from '@uiw/react-md-editor';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Proposal from '../../../../../state/dao/types/Proposal';
import ScoreResult from '../../../../../state/dao/types/ScoreResult';
import Space from '../../../../../state/dao/types/Space';
import StrategiesDialog from '../../../../shared/StrategiesDialog/StrategiesDialog';
import Vote from '../../../../../state/dao/types/Vote';
import WebShareDialog from '../../../../shared/WebShareDialog/WebShareDialog';
import cogoToast from 'cogo-toast';
import { format } from 'date-fns';
import { handleSnapshotError } from '../../../../../utils/SnapshotResponseUtil';
import { handleWeb3Error } from '../../../../../utils/Web3ResponseUtil';
import { isWholeNumber } from '../../../../../utils/NumberUtil';
import snapshot from '@snapshot-labs/snapshot.js';
import { toastOptions } from '../../../../../configs/CogoToast';
import { totalStrategyVotes } from '../../../../../utils/daoUtil';
import { useActiveWeb3React } from '../../../../../hooks';
import { useNavigate } from 'react-router-dom';

const hub = 'https://hub.snapshot.org'; // or https://testnet.snapshot.org for testnet
const client = new snapshot.Client712(hub);

const votesPerPage = 5;
const BasicActive = ({
	proposal,
	updateProposal,
}: {
	proposal: Proposal;
	updateProposal: () => void;
}) => {
	const { account, library } = useActiveWeb3React();
	const [votes, setVotes] = useState([] as Array<Vote>);
	const [votesWithScores, setVotesWithScores] = useState([] as Array<Vote>);
	const [vote, setVote] = useState(null as Vote | null);
	const [voteWithScores, setVoteWithScores] = useState(null as Vote | null);
	const [score, setScore] = useState(0);
	const [scores, setScores] = useState(null as ScoreResult | null);
	const [page, setPage] = useState(1);
	const [pageCount, setPageCount] = useState(1);
	const navigate = useNavigate();
	const [space, setSpace] = useState(null as Space | null);
	const [selectedChoice, setSelectedChoice] = useState(null as null | number);
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

	const handlePageChange = (
		event: React.ChangeEvent<unknown>,
		value: number
	) => {
		if (!value) {
			return;
		}
		setPage(value);
	};

	const castVote = async () => {
		if (!library || !account || isNull(selectedChoice) || score <= 0) {
			return;
		}

		try {
			const receipt = await client.vote(library, account, {
				space: proposal.space.id,
				proposal: proposal.id,
				type: 'single-choice',
				choice: selectedChoice + 1,
				metadata: JSON.stringify({}),
			});
			cogoToast.success('Your vote has been casted!', toastOptions);
			updateProposal();
		} catch (error: any) {
			if (error.error_description) {
				handleSnapshotError(error);
			} else {
				handleWeb3Error(error);
			}
			console.log(error);
		}
	};

	useEffect(() => {
		if (!proposal) {
			return;
		}
		fetchAllVotes({ id: proposal.id }).then((_votes) => {
			setVotes(_votes);
			setVotesWithScores(
				_votes.map((_vote) => {
					return { ..._vote, vp: 0 };
				})
			);
		});
		fetchSpace({ id: proposal.space.id }).then((_space) => {
			setSpace(_space);
		});
	}, [proposal]);

	useEffect(() => {
		if (!proposal || !account) {
			return;
		}
		fetchVoteByVoter({ id: proposal.id, voter: account }).then((_vote) => {
			setVote(_vote);
		});

		fetchScores({
			addresses: [account],
			network: '56',
			snapshot: +proposal.snapshot,
			space: proposal.space.id,
			strategies: proposal.strategies,
		}).then((_scores) => {
			setScore(
				_scores.scores.reduce((previousValue, currentValue) => {
					return previousValue + (currentValue[account] || 0);
				}, 0)
			);
		});
	}, [account, proposal]);

	useEffect(() => {
		if (!proposal || !votes.length) {
			return;
		}
		setPageCount(Math.ceil(votes.length / votesPerPage));
		fetchScores({
			addresses: votes.map((vote) => vote.voter),
			network: '56',
			snapshot: +proposal.snapshot,
			space: proposal.space.id,
			strategies: proposal.strategies,
		}).then((_scores) => {
			setScores(_scores);
		});
	}, [proposal, votes]);

	useEffect(() => {
		if (!scores || !scores.scores.length || !votesWithScores.length) {
			return;
		}

		const _votesWithScore = cloneDeep(votesWithScores);

		_votesWithScore.forEach((_voteWithScores) => {
			const voter = _voteWithScores.voter;
			_voteWithScores.vp = 0;
			scores.scores.forEach((_score) => {
				_voteWithScores.vp += _score[voter];
			});
		});

		setVotesWithScores(
			_votesWithScore.sort((a, b) => {
				return b.vp - a.vp;
			})
		);
	}, [scores]);

	useEffect(() => {
		if (
			!account ||
			!scores ||
			!scores.scores.length ||
			!votesWithScores.length
		) {
			return;
		}

		const _voteWithScores =
			votesWithScores.find((_vote) => {
				return _vote.voter.toLowerCase() === account.toLowerCase();
			}) || null;

		setVoteWithScores(_voteWithScores);
	}, [account, scores, vote, votesWithScores]);

	return (
		<>
			<div id='BasicActive'>
				<div className='header my-5 d-flex justify-content-between'>
					<div className='title_wrapper'>
						{/* <p id='title'>Proposal #{id}</p> */}
					</div>
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
													proposal
														? proposal.state
														: ''
												)}
											</span>
										</div>
									</Grid>
									<Grid item>
										<Grid container>
											<Grid item>
												<IconButton
													className='icon-button'
													onClick={
														handleMoreActionsClick
													}
												>
													<MoreHorizIcon fontSize='large' />
												</IconButton>
												<Menu
													anchorEl={
														moreActionsAnchorEl
													}
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
														onClick={
															duplicateProposal
														}
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
									<MDEditor.Markdown
										source={proposal?.body}
									/>
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
													<Grid
														item
														className='right'
													>
														<div
															onClick={() => {
																setStrategiesDialogOpen(
																	true
																);
															}}
														>
															{space &&
																proposal.strategies.map(
																	(
																		strategy
																	) => {
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
																proposal.strategies
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
													<Grid
														item
														className='right'
													>
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
													<Grid
														item
														className='right'
													>
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
													<Grid
														item
														className='right'
													>
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
													<Grid
														item
														className='right'
													>
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
													<Grid
														item
														className='right'
													>
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
													<Grid
														item
														className='right'
													>
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
												votesWithScores={
													votesWithScores
												}
											/>
										)}
									</Grid>
								</Grid>
							</div>
						</Grid>
					</Grid>
					<Grid container className='grid-row cast-vote'>
						<Grid className='row-item'>
							<div className='card pt-4 pb-4'>
								<div className='card-header d-flex justify-content-between'>
									<div>Cast your vote</div>
									<div>
										VP:{' '}
										{isWholeNumber(score)
											? score
											: score.toFixed(2)}
									</div>
								</div>
								<div className='card-body'>
									{proposal?.choices.map((choice, index) => {
										return (
											<div
												className={`choice text-center ${
													selectedChoice === index
														? 'selected'
														: ''
												}`}
												key={index}
												onClick={() => {
													setSelectedChoice(index);
												}}
											>
												{choice}
											</div>
										);
									})}
									<button
										id='VoteBtn'
										disabled={
											isNull(selectedChoice) ||
											!library ||
											!account ||
											score <= 0
										}
										onClick={castVote}
									>
										Vote
									</button>
								</div>
							</div>
						</Grid>
					</Grid>
					<Grid container className='grid-row votes'>
						<Grid className='row-item'>
							<div className='card'>
								<div className='card-header pt-4'>
									Votes<span>{votesWithScores.length}</span>
								</div>
								<div className='card-body'>
									{page === 1 && account && voteWithScores && (
										<Grid
											container
											className='grid-row vote-item text-center'
											justifyContent='space-between'
										>
											<Grid item sm={4}>
												<ExternalLink
													href={`https://bscscan.com/address/${voteWithScores.voter}`}
												>
													You
												</ExternalLink>
											</Grid>
											<Grid item sm={4}>
												{
													proposal?.choices[
														(voteWithScores.choice as number) -
															1
													]
												}
											</Grid>
											<Grid item sm={4}>
												<ExternalLink
													href={`https://cloudflare-ipfs.com/ipfs/${voteWithScores.ipfs}`}
												>
													{`${
														isWholeNumber(
															totalStrategyVotes(
																voteWithScores.vp_by_strategy
															)
														)
															? totalStrategyVotes(
																	voteWithScores.vp_by_strategy
															  )
															: totalStrategyVotes(
																	voteWithScores.vp_by_strategy
															  ).toFixed(2)
													} ${space?.symbol}`}
												</ExternalLink>
											</Grid>
										</Grid>
									)}
									{votesWithScores
										.slice(
											(page - 1) * votesPerPage,
											page * votesPerPage
										)
										.map((_vote, index) => {
											return (
												<Grid
													key={_vote.id}
													container
													className='grid-row vote-item text-center'
													justifyContent='space-between'
												>
													<Grid item sm={4}>
														<ExternalLink
															href={`https://bscscan.com/address/${_vote.voter}`}
														>
															{`${_vote.voter.slice(
																0,
																6
															)}...${_vote.voter.slice(
																-4
															)}`}
														</ExternalLink>
													</Grid>
													<Grid item sm={4}>
														{
															proposal?.choices[
																(_vote.choice as number) -
																	1
															]
														}
													</Grid>
													<Grid item sm={4}>
														<ExternalLink
															href={`https://cloudflare-ipfs.com/ipfs/${_vote.ipfs}`}
														>
															{`${
																isWholeNumber(
																	totalStrategyVotes(
																		_vote.vp_by_strategy
																	)
																)
																	? totalStrategyVotes(
																			_vote.vp_by_strategy
																	  )
																	: totalStrategyVotes(
																			_vote.vp_by_strategy
																	  ).toFixed(
																			2
																	  )
															} ${space?.symbol}`}
														</ExternalLink>
													</Grid>
												</Grid>
											);
										})}
									<div id='paginationWrapper'>
										<Pagination
											count={pageCount}
											page={page}
											onChange={handlePageChange}
										/>
									</div>
								</div>
							</div>
						</Grid>
					</Grid>
				</div>
			</div>
		</>
	);
};

const SingleChoiceResultBox = ({
	votesWithScores,
	proposal,
	space,
}: {
	votesWithScores: Array<Vote>;
	proposal: Proposal;
	space: Space;
}) => {
	const totalVP = votesWithScores.reduce((previousValue, currentValue) => {
		return previousValue + totalStrategyVotes(currentValue.vp_by_strategy);
	}, 0);
	let choiceScores = [] as Array<{ choice: string; score: number }>;
	proposal.choices.forEach((choice, index) => {
		const score = votesWithScores
			.filter((x) => x.choice === index + 1)
			.reduce((previousValue, currentValue) => {
				return (
					previousValue +
					totalStrategyVotes(currentValue.vp_by_strategy)
				);
			}, 0);
		choiceScores.push({
			choice,
			score,
		});
	});

	choiceScores = choiceScores.sort((a, b) => {
		return b.score - a.score;
	});
	return (
		<div className='card' id='SingleChoiceResultBox'>
			<div className='card-header'>Results</div>
			<div className='card-body'>
				<Grid container direction='column'>
					{choiceScores.map((choiceScore, index) => {
						const percentage = (
							(choiceScore.score * 100) /
							totalVP
						).toFixed(2);
						return (
							<Grid item key={index} className='choice'>
								<Grid container justifyContent='space-between'>
									<Grid
										item
										className='left'
									>{`${displayUntilLength(
										choiceScore.choice,
										14
									)} ${
										isWholeNumber(choiceScore.score)
											? choiceScore.score
											: choiceScore.score.toFixed(2)
									} ${space.symbol}`}</Grid>
									<Grid item className='right'>{`${
										percentage === 'NaN' ? 0 : percentage
									}%`}</Grid>
								</Grid>
								<LinearProgress
									variant='determinate'
									value={+percentage || 0}
								/>
							</Grid>
						);
					})}
				</Grid>
			</div>
		</div>
	);
};

export default BasicActive;
