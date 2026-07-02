import './SingleChoiceActive.scss';

import {
	Grid,
	LinearProgress,
	Pagination,
	Tooltip,
	useMediaQuery,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { cloneDeep, isNull } from 'lodash';
import {
	fetchAllVotes,
	fetchScores,
	fetchSpace,
	fetchVoteByVoter,
} from '../../../../../state/dao/apis';

import BackButton from '../../../BackButton/BackButton';
import ExternalLink from '../../../../widgets/ExternalLink/ExternalLink';
import InformationCard from '../../../shared/InformationCard';
import Proposal from '../../../../../state/dao/types/Proposal';
import ProposalCard from '../../../shared/ProposalCard';
import ResultCard from '../../../shared/ResultCard';
import ScoreResult from '../../../../../state/dao/types/ScoreResult';
import Space from '../../../../../state/dao/types/Space';
import Translation from '../../../../widgets/Translation';
import Vote from '../../../../../state/dao/types/Vote';
import VoteCard from '../../../shared/VoteCard';
import cogoToast from 'cogo-toast';
import { displayUntilLength } from '../../../../../utils/StringUtil';
import { handleSnapshotError } from '../../../../../utils/SnapshotResponseUtil';
import { handleWeb3Error } from '../../../../../utils/Web3ResponseUtil';
import { isWholeNumber } from '../../../../../utils/NumberUtil';
import snapshot from '@snapshot-labs/snapshot.js';
import { toastOptions } from '../../../../../configs/CogoToast';
import { totalStrategyVotes } from '../../../../../utils/daoUtil';
import { useActiveWeb3React } from '../../../../../hooks';
import { useTranslation } from 'react-i18next';

const hub = 'https://hub.snapshot.org'; // or https://testnet.snapshot.org for testnet
const client = new snapshot.Client712(hub);

const votesPerPage = 5;
const SingleChoiceActive = ({
	proposal,
	updateProposal,
}: {
	proposal: Proposal;
	updateProposal: () => void;
}) => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'Dao.ProposalDetails',
	});

	const { account, library } = useActiveWeb3React();
	const [votes, setVotes] = useState([] as Array<Vote>);
	const [votesWithScores, setVotesWithScores] = useState([] as Array<Vote>);
	const [vote, setVote] = useState(null as Vote | null);
	const [voteWithScores, setVoteWithScores] = useState(null as Vote | null);
	const [score, setScore] = useState(0);
	const [scores, setScores] = useState(null as ScoreResult | null);
	const [page, setPage] = useState(1);
	const [pageCount, setPageCount] = useState(1);
	const [space, setSpace] = useState(null as Space | null);
	const [selectedChoice, setSelectedChoice] = useState(null as null | number);

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

	const VoteButton = (props) => {
		const { children } = props;
		return (
			<button
				id='VoteBtn'
				disabled={
					isNull(selectedChoice) || !library || !account || score <= 0
				}
				onClick={castVote}
			>
				{children}
			</button>
		);
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
		<div id='SingleChoiceActive'>
			<BackButton />
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
										<SingleChoiceResultBox
											proposal={proposal}
											space={space}
											votesWithScores={votesWithScores}
										/>
									)}
								</Grid>
							</Grid>
						</div>
					</Grid>
				</Grid>
				<Grid container className='grid-row cast-vote'>
					<Grid className='row-item'>
						<VoteCard
							vp={isWholeNumber(score) ? score : score.toFixed(2)}
							VoteButton={VoteButton}
						>
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
						</VoteCard>
					</Grid>
				</Grid>
				<Grid container className='grid-row votes'>
					<Grid className='row-item'>
						<div className='card'>
							<div className='card-header pt-4'>
								<Translation ready={ready}>
									{t('VotesCard.title', {
										defaultValue: 'Votes',
									})}
									<span>{votesWithScores.length}</span>
								</Translation>
							</div>
							<div className='card-body'>
								{page === 1 && account && voteWithScores && (
									<Grid
										container
										className='grid-row vote-item text-center'
										justifyContent='space-between'
									>
										<Grid item sm={4}>
											<Translation ready={ready}>
												<ExternalLink
													href={`https://bscscan.com/address/${voteWithScores.voter}`}
												>
													{t('VotesCard.you', {
														defaultValue: 'You',
													})}
												</ExternalLink>
											</Translation>
										</Grid>
										<Grid item sm={4}>
											{proposal && (
												<Tooltip
													title={
														proposal.choices[
															(voteWithScores.choice as number) -
																1
														]
													}
													placement='top-start'
												>
													<span>{`${displayUntilLength(
														proposal.choices[
															(voteWithScores.choice as number) -
																1
														],
														14
													)}`}</span>
												</Tooltip>
											)}
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
													{proposal && (
														<Tooltip
															title={
																proposal
																	.choices[
																	(_vote.choice as number) -
																		1
																]
															}
															placement='top-start'
														>
															<span>{`${displayUntilLength(
																proposal
																	.choices[
																	(_vote.choice as number) -
																		1
																],
																14
															)}`}</span>
														</Tooltip>
													)}
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
																  ).toFixed(2)
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
		return (
			previousValue +
			currentValue.vp_by_strategy.reduce((prev, curr) => {
				return prev + curr;
			}, 0)
		);
	}, 0);

	let choiceScores = [] as Array<{ choice: string; score: number }>;
	proposal.choices.forEach((choice, index) => {
		const score = votesWithScores
			.filter((x) => x.choice === index + 1)
			.reduce((previousValue, currentValue) => {
				return (
					previousValue +
					currentValue.vp_by_strategy.reduce((prev, curr) => {
						return prev + curr;
					}, 0)
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
		<ResultCard>
			<Grid container direction='column'>
				{choiceScores.map((choiceScore, index) => {
					const percentage = (
						(choiceScore.score * 100) /
						totalVP
					).toFixed(2);
					return (
						<Grid item key={index} className='choice'>
							<Grid container justifyContent='space-between'>
								<Grid item className='left'>
									<Tooltip
										title={choiceScore.choice}
										placement='top-start'
									>
										<span>{`${displayUntilLength(
											choiceScore.choice,
											14
										)}`}</span>
									</Tooltip>{' '}
									{`${
										isWholeNumber(choiceScore.score)
											? choiceScore.score
											: choiceScore.score.toFixed(2)
									} ${space.symbol}`}
								</Grid>
								<Grid item className='right'>{`${
									percentage === 'NaN' ? 0 : percentage
								}%`}</Grid>
							</Grid>
							<LinearProgress
								variant='determinate'
								value={+percentage}
							/>
						</Grid>
					);
				})}
			</Grid>
		</ResultCard>
	);
};

export default SingleChoiceActive;
