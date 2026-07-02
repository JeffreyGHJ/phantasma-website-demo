import './NewProposal.scss';

import { IconButton, TextField } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import {
	fetchProposal,
	fetchScores,
	fetchSpace,
} from '../../../state/dao/apis';
import { useNavigate, useParams } from 'react-router-dom';

import BackButton from '../BackButton/BackButton';
import MDEditor from '@uiw/react-md-editor';
import PublishIcon from '@mui/icons-material/Publish';
import Receipt from '../../../state/dao/types/Receipt';
import Space from '../../../state/dao/types/Space';
import VotingSystemsDialog from './VotingSystemsDialog';
import cogoToast from 'cogo-toast';
import { format } from 'date-fns';
import { handleSnapshotError } from '../../../utils/SnapshotResponseUtil';
import { handleWeb3Error } from '../../../utils/Web3ResponseUtil';
import { isUndefined } from 'lodash';
import rehypeSanitize from 'rehype-sanitize';
import snapshot from '@snapshot-labs/snapshot.js';
import { toastOptions } from '../../../configs/CogoToast';
import { useActiveWeb3React } from '../../../hooks';
import { useSpace } from '../../../state/dao/dao.hooks';
import { votingSystems } from '../../../state/dao/constants';

const basicVotingChoices = ['For', 'Against', 'Abstain'];
const votingSystemIndexes = {
	SingleChoiceVoting: 0,
	ApprovalVoting: 1,
	QuadraticVoting: 2,
	RankedChoiceVoting: 3,
	WeightedVoting: 4,
	BasicVoting: 5,
};

const hub = 'https://hub.snapshot.org'; // or https://testnet.snapshot.org for testnet
const client = new snapshot.Client712(hub);
const NewProposal = () => {
	const { account, library } = useActiveWeb3React();
	const [block, setBlock] = useState(0);
	const [vp, setVp] = useState(0);
	const { id } = useParams();
	const spaceLink = useSpace();
	// Dialog states
	const [open, setOpen] = useState(false);
	const handleClose = () => {
		setOpen(false);
	};
	const [space, setSpace] = useState(null as null | Space);
	const [title, setTitle] = useState('');
	const [body, setBody] = useState('');
	const [selectedVotingSystem, setSelectedVotingSystem] = useState(0);
	const [choices, setChoices] = useState(['', ''] as Array<string>);
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const startDateRef = useRef<HTMLDivElement>(null);
	const endDateRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();

	const addChoice = () => {
		setChoices([...choices, '']);
	};

	const removeChoice = (index: number) => {
		setChoices(
			choices.filter((choice, idx) => {
				return idx !== index;
			})
		);
	};

	const onChoiceChange = (index: number, newText: string) => {
		setChoices(
			choices.map((choice, idx) => {
				if (index !== idx) {
					return choice;
				}
				return newText;
			})
		);
	};

	const publish = async () => {
		if (
			!library ||
			!account ||
			!space ||
			!block ||
			!vp ||
			vp < space.filters.minScore
		) {
			return;
		}
		let _startDate;
		const _endDate = Math.ceil(new Date(endDate).getTime() / 1000);
		const _strategies = JSON.stringify(space.strategies);
		if (space.voting.delay) {
			_startDate =
				Math.ceil(new Date().getTime() / 1000) + space.voting.delay;
		} else {
			_startDate = Math.ceil(new Date(startDate).getTime() / 1000);
		}
		try {
			const receipt = (await client.proposal(library, account, {
				space: spaceLink,
				type: votingSystems[selectedVotingSystem].id,
				title,
				body,
				choices: choices,
				start: _startDate,
				end: _endDate,
				snapshot: block,
				network: '56',
				strategies: _strategies,
				plugins: '{}', //JSON.stringify({})
				metadata: '{}',
				discussion: '',
			})) as Receipt;

			navigate(`/dao/proposals/${receipt.id}`);
			cogoToast.success('Proposal successfully created!', toastOptions);
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
		if (selectedVotingSystem === votingSystemIndexes.BasicVoting) {
			setChoices(basicVotingChoices);
		}
	}, [selectedVotingSystem]);

	useEffect(() => {
		if (id) {
			fetchProposal({ id }).then((_proposal) => {
				const start = new Date(_proposal.created * 1000);
				const end = new Date(_proposal.end * 1000);
				setTitle(_proposal.title);
				setBody(_proposal.body);
				setSelectedVotingSystem(
					votingSystems.findIndex((x) => {
						return x.id === _proposal.type;
					})
				);
				setStartDate(
					`${format(start, 'yyyy-MM-dd')}T${format(start, 'HH:mm')}`
				);
				setChoices(_proposal.choices);
			});
		}
	}, [id]);

	useEffect(() => {
		fetchSpace({ id: spaceLink }).then((_space) => {
			setSpace(_space);
		});
	}, [spaceLink]);

	useEffect(() => {
		if (!space) {
			return;
		}
		if (space.voting.delay) {
			const delay = new Date().getTime() + space.voting.delay * 1000;
			setStartDate(
				`${format(delay, 'yyyy-MM-dd')}T${format(delay, 'HH:mm')}`
			);
		}
	}, [space]);

	useEffect(() => {
		if (endDateRef.current) {
			const now = new Date();
			endDateRef.current.setAttribute(
				'min',
				`${format(now, 'yyyy-MM-dd')}T${format(now, 'HH:mm')}`
			);
		}
	}, [endDateRef]);

	useEffect(() => {
		if (startDateRef.current) {
			const now = new Date();
			startDateRef.current.setAttribute(
				'min',
				`${format(now, 'yyyy-MM-dd')}T${format(now, 'HH:mm')}`
			);
		}
	}, [startDateRef]);

	useEffect(() => {
		if (!account || !space) {
			return;
		}
		fetchScores({
			addresses: [account],
			network: '56',
			snapshot: 'latest',
			space: spaceLink,
			strategies: space.strategies,
		}).then((_scores) => {
			let _vp = 0;

			_scores.scores.forEach((_score) => {
				_vp += _score[account] || 0;
			});
			setVp(_vp);
			if (_vp < space.filters.minScore) {
				cogoToast.warn(
					`You need to have a minimum of ${space.filters.minScore} ${space.symbol} in order to submit a proposal`,
					{ ...toastOptions, hideAfter: 10 }
				);
			}
		});
	}, [account, space]);

	useEffect(() => {
		if (library) {
			library.getBlockNumber().then((_block) => {
				setBlock(_block);
			});
		}
	}, [library]);

	return (
		<>
			<div id='NewProposal' className='container'>
				<BackButton />
				<div className='header mt-4 mb-5 d-flex justify-content-between'>
					<div className='title_wrapper'>
						<p id='title'>New Proposal</p>
					</div>
					<div className='publish'>
						<IconButton
							className='icon-button'
							onClick={() => {
								publish();
							}}
							disabled={
								!library ||
								!account ||
								!space ||
								!block ||
								!vp ||
								vp < space.filters.minScore
							}
						>
							<PublishIcon />
							<span className='button-text'>Publish</span>
						</IconButton>
					</div>
				</div>
				<div className='body'>
					<div className='row'>
						<div className='row-item proposal-question-answer col-12 col-md-6 col-lg-9'>
							<div className='proposal-title'>
								<input
									type='text'
									placeholder='Ask a question...'
									value={title}
									onChange={(event) => {
										setTitle(event.target.value);
									}}
								/>
							</div>
							<div className='proposal-details'>
								<MDEditor
									value={body}
									onChange={(_value) => {
										setBody(
											isUndefined(_value) ? '' : _value
										);
									}}
									previewOptions={{
										rehypePlugins: [[rehypeSanitize]],
									}}
									preview='edit'
									height={500}
									maxHeight={1000}
								/>
							</div>
						</div>
						<div className='row-item options col-12 col-md-6 col-lg-3'>
							<div className='card'>
								<div className='card-header'>Options</div>
								<div className='card-body'>
									<div>
										<button
											className='voting-type'
											onClick={() => {
												setOpen(true);
											}}
										>
											{
												votingSystems[
													selectedVotingSystem
												].title
											}
										</button>
									</div>
									<div id='startDateWrapper'>
										<TextField
											id='startDate'
											label='Start Date'
											type='datetime-local'
											InputLabelProps={{
												shrink: true,
											}}
											value={startDate}
											onChange={(event) => {
												setStartDate(
													event.target.value
												);
											}}
											disabled={
												space
													? !!space.voting.delay
													: false
											}
											inputRef={startDateRef}
										/>
									</div>
									<div id='endDateWrapper'>
										<TextField
											inputRef={endDateRef}
											id='endDate'
											label='End Date'
											type='datetime-local'
											InputLabelProps={{
												shrink: true,
											}}
											value={endDate}
											onChange={(event) => {
												setEndDate(event.target.value);
											}}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className='row choices'>
						<div className='row-item col-12'>
							<div className='card'>
								<div className='card-header'>Choices</div>
								<div className='card-body'>
									{choices.map((choice, index) => {
										return (
											<div
												className='choice-item'
												key={index}
											>
												<span className='choice-num'>
													{index + 1}
												</span>
												<input
													type='text'
													value={choice}
													onChange={(evt) => {
														onChoiceChange(
															index,
															evt.target.value
														);
													}}
													disabled={
														selectedVotingSystem ===
														votingSystemIndexes.BasicVoting
													}
												/>
												{selectedVotingSystem !==
													votingSystemIndexes.BasicVoting && (
													<span
														className='remove-choice'
														onClick={() => {
															removeChoice(index);
														}}
													>
														x
													</span>
												)}
											</div>
										);
									})}
									<div
										className='choice-item add_choice_wrapper'
										onClick={() => {
											addChoice();
										}}
									>
										<div className='add_choice'>
											Add Choice
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<VotingSystemsDialog
					open={open}
					handleClose={handleClose}
					selectedVotingSystem={selectedVotingSystem}
					setSelectedVotingSystem={setSelectedVotingSystem}
				/>
			</div>
		</>
	);
};

export default NewProposal;
