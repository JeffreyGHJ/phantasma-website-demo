import './Dao.scss';

import { FormControl, Grid, IconButton, MenuItem, Select } from '@mui/material';
import { abbreviateAddress, displayUntilLength } from '../../utils/StringUtil';
import {
	proposalStateFilters,
	proposalStates,
} from '../../state/dao/constants';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Loading from '../widgets/Loading';
import LookaheadPagination from '../shared/LookacheadPagination/LookaheadPagination';
import Proposal from '../../state/dao/types/Proposal';
import QuickSetting from '../widgets/SpeedDial/QuickSetting';
import Space from '../../state/dao/types/Space';
import Translation from '../widgets/Translation';
import { getReadableStartEndDate } from '../../utils/DateUtil';
import { maxValueIndex } from '../../utils/ArrayUtil';
import { useDao } from './useDao';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Dao = () => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'Dao.Proposals',
	});

	const {
		proposalStateFilter,
		page,
		lastPage,
		proposals,
		handlePageChange,
		handleFilterChange,
		space,
	} = useDao();
	const navigate = useNavigate();

	return (
		<>
			<div id='Dao' className='container'>
				<div className='header my-5 d-flex justify-content-between'>
					<div className='title_wrapper'>
						<Loading loading={!ready}>
							<p id='title'>
								{t('proposals', { defaultValue: 'proposals' })}
							</p>
						</Loading>
					</div>
					<div className='text-end new-proposal'>
						<IconButton
							className='icon-button'
							onClick={() => {
								navigate('/dao/create');
							}}
						>
							<AddCircleIcon />
							<Translation ready={ready}>
								<span className='button-text'>
									{t('new_proposal', {
										defaultValue: 'New Proposal',
									})}
								</span>
							</Translation>
						</IconButton>
					</div>
				</div>
				<div className='content'>
					<div className='row'>
						<div className='filter'>
							<FormControl
								variant='outlined'
								style={{
									minWidth: '100px',
								}}
							>
								<Select
									value={proposalStateFilter}
									onChange={handleFilterChange}
								>
									<MenuItem value={proposalStateFilters.ALL}>
										<Translation ready={ready}>
											{t('status_selections.all', {
												defaultValue: 'All',
											})}
										</Translation>
									</MenuItem>
									<MenuItem
										value={proposalStateFilters.ACTIVE}
									>
										<Translation ready={ready}>
											{t('status_selections.active', {
												defaultValue: 'Active',
											})}
										</Translation>
									</MenuItem>
									<MenuItem
										value={proposalStateFilters.PENDING}
									>
										<Translation ready={ready}>
											{t('status_selections.pending', {
												defaultValue: 'Pending',
											})}
										</Translation>
									</MenuItem>
									<MenuItem
										value={proposalStateFilters.CLOSED}
									>
										<Translation ready={ready}>
											{t('status_selections.closed', {
												defaultValue: 'Closed',
											})}
										</Translation>
									</MenuItem>
									<MenuItem value={proposalStateFilters.CORE}>
										<Translation ready={ready}>
											{t('status_selections.core', {
												defaultValue: 'Core',
											})}
										</Translation>
									</MenuItem>
								</Select>
							</FormControl>
						</div>
					</div>
					{proposals.map((proposal) => {
						return (
							<div className='row proposal' key={proposal.id}>
								<div
									className='row-item col-12'
									onClick={() => {
										navigate(
											`/dao/proposals/${proposal.id}`
										);
									}}
								>
									<div className='card'>
										<div className='card-body'>
											<div className='d-flex justify-content-between'>
												<div>
													<Translation ready={ready}>
														<p className='card-text'>
															{t('proposed_by', {
																defaultValue:
																	'Proposed by',
															})}{' '}
															{abbreviateAddress(
																proposal.author
															)}
															{space?.admins.includes(
																proposal.author
															) && (
																<span className='core pill'>
																	{t('core', {
																		defaultValue:
																			'Core',
																	})}
																</span>
															)}
														</p>
													</Translation>
												</div>
												<div
													className={`status text-end status-badge-${proposal.state} pill`}
												>
													<Translation ready={ready}>
														<span className='capitalize'>
															{t(
																`status_selections.${proposal.state}`,
																{
																	defaultValue:
																		proposal.state,
																}
															)}
														</span>
													</Translation>
												</div>
											</div>
											<div className='proposal-title'>
												{proposal.title}
											</div>
											<div className='proposal-content'>
												{displayUntilLength(
													proposal.body,
													200
												)}
											</div>
											<div className='proposal-time'>
												{space && (
													<CardFooter
														proposal={proposal}
														space={space}
													/>
												)}
											</div>
										</div>
									</div>
								</div>
							</div>
						);
					})}

					<div id='paginationWrapper'>
						<LookaheadPagination
							currentPage={page}
							lastPage={lastPage}
							onChange={handlePageChange}
						/>
					</div>
				</div>
			</div>
			<QuickSetting />
		</>
	);
};

const CardFooter = ({
	proposal,
	space,
}: {
	proposal: Proposal;
	space: Space;
}) => {
	if (proposal.state !== proposalStates.CLOSED) {
		return (
			<div>{getReadableStartEndDate(proposal.start, proposal.end)}</div>
		);
	}

	const index = maxValueIndex(proposal.scores);
	return (
		<Grid container spacing={1}>
			<Grid item>
				<div>
					<CheckCircleIcon
						fontSize='large'
						style={{ verticalAlign: 'baseline' }}
					/>
				</div>
			</Grid>
			<Grid item>
				<div>
					{`${proposal.choices[index]} - ${(+proposal.scores[
						index
					]).toLocaleString()} ${space.symbol}`}
				</div>
			</Grid>
		</Grid>
	);
};
export default Dao;
