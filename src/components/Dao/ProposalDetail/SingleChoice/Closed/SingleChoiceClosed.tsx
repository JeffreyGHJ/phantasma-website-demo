import './SingleChoiceClosed.scss';

import {
	Grid,
	LinearProgress,
	Pagination,
	Tooltip,
	useMediaQuery,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
	fetchSpace,
	fetchVoteByVoter,
	fetchVotes,
} from '../../../../../state/dao/apis';

import BackButton from '../../../BackButton/BackButton';
import ExternalLink from '../../../../widgets/ExternalLink/ExternalLink';
import InformationCard from '../../../shared/InformationCard';
import Proposal from '../../../../../state/dao/types/Proposal';
import ProposalCard from '../../../shared/ProposalCard';
import ResultCard from '../../../shared/ResultCard';
import Space from '../../../../../state/dao/types/Space';
import Translation from '../../../../widgets/Translation';
import Vote from '../../../../../state/dao/types/Vote';
import { displayUntilLength } from '../../../../../utils/StringUtil';
import { isWholeNumber } from '../../../../../utils/NumberUtil';
import snapshot from '@snapshot-labs/snapshot.js';
import { useActiveWeb3React } from '../../../../../hooks';
import { useTranslation } from 'react-i18next';

const votesPerPage = 5;
const SingleChoiceClosed = ({ proposal }: { proposal: Proposal }) => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'Dao.ProposalDetails',
	});

	const { account } = useActiveWeb3React();
	const [votes, setVotes] = useState([] as Array<Vote>);
	const [vote, setVote] = useState(null as Vote | null);
	const [page, setPage] = useState(1);
	const [pageCount, setPageCount] = useState(1);
	const [space, setSpace] = useState(null as Space | null);

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

	useEffect(() => {
		if (!proposal) {
			return;
		}
		fetchSpace({ id: proposal.space.id }).then((_space) => {
			setSpace(_space);
		});
		setPageCount(Math.ceil(proposal.votes / votesPerPage));
	}, [proposal]);

	useEffect(() => {
		if (!proposal || !account) {
			return;
		}
		fetchVoteByVoter({ id: proposal.id, voter: account }).then((_vote) => {
			setVote(_vote);
		});
	}, [account, proposal]);

	useEffect(() => {
		if (!proposal) {
			return;
		}
		fetchVotes({
			first: votesPerPage,
			id: proposal.id,
			orderBy: 'vp',
			orderDirection: 'desc',
			skip: (page - 1) * votesPerPage,
		}).then((_votes) => {
			setVotes(_votes);
		});
	}, [page, proposal]);

	return (
		<div id='SingleChoiceClosed'>
			<BackButton />
			<div className='header mb-5 d-flex justify-content-between'>
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
										/>
									)}
								</Grid>
							</Grid>
						</div>
					</Grid>
				</Grid>
				<Grid container className='grid-row votes'>
					<Grid className='row-item'>
						<div className='card'>
							<div className='card-header'>
								<Translation ready={ready}>
									{t('VotesCard.title', {
										defaultValue: 'Votes',
									})}
									<span>{proposal?.votes}</span>
								</Translation>
							</div>
							<div className='card-body'>
								{page === 1 && account && vote && (
									<Grid
										container
										className='grid-row vote-item text-center'
										justifyContent='space-between'
									>
										<Grid item sm={4}>
											<Translation ready={ready}>
												<ExternalLink
													href={`https://bscscan.com/address/${account}`}
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
															(vote.choice as number) -
																1
														]
													}
													placement='top-start'
												>
													<span>{`${displayUntilLength(
														proposal.choices[
															(vote.choice as number) -
																1
														],
														14
													)}`}</span>
												</Tooltip>
											)}
										</Grid>
										<Grid item sm={4}>
											{`${
												isWholeNumber(vote.vp)
													? vote.vp
													: vote.vp.toFixed(2)
											} ${space?.symbol}`}
										</Grid>
									</Grid>
								)}
								{votes.map((_vote, index) => {
									return (
										<Grid
											key={_vote.id}
											container
											className='grid-row vote-item text-center'
											justifyContent='space-between'
										>
											<Grid item sm={4}>
												{`${_vote.voter.slice(
													0,
													6
												)}...${_vote.voter.slice(-4)}`}
											</Grid>
											<Grid item sm={4}>
												{proposal && (
													<Tooltip
														title={
															proposal.choices[
																(_vote.choice as number) -
																	1
															]
														}
														placement='top-start'
													>
														<span>{`${displayUntilLength(
															proposal.choices[
																(_vote.choice as number) -
																	1
															],
															14
														)}`}</span>
													</Tooltip>
												)}
											</Grid>
											<Grid item sm={4}>
												{`${
													isWholeNumber(_vote.vp)
														? _vote.vp
														: _vote.vp.toFixed(2)
												} ${space?.symbol}`}
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
	proposal,
	space,
}: {
	proposal: Proposal;
	space: Space;
}) => {
	let choiceScores = [] as Array<{ choice: string; score: number }>;
	proposal.choices.forEach((choice, index) => {
		choiceScores.push({
			choice,
			score: proposal.scores[index],
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
						proposal.scores_total
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

export default SingleChoiceClosed;
