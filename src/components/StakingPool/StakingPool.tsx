import './StakingPool.scss';

import React, { useEffect, useState } from 'react';

import { ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';

enum STATES {
	STAKE,
	UNSTAKE,
}

const StakingPool = () => {
	const [stakingState, setStakingState] = useState(STATES.STAKE);
	const [stakedTokens, setStakedTokens] = useState(0);
	const [avaliableTokens, setAvaliableTokens] = useState(0);
	const [approved, setApproved] = useState(false);

	const approve = () => {
		console.log(approve);
	};

	const chartOptions: ApexOptions = {
		chart: {
			id: 'apr-chart',
			toolbar: {
				tools: {
					download: false,
				},
			},
		},
		xaxis: {
			categories: [
				'11/23/21',
				'11/24/21',
				'11/25/21',
				'11/26/21',
				'11/27/21',
				'11/28/21',
				'11/29/21',
				'11/30/21',
			],
		},
	};

	const chartSeries = [
		{
			name: 'series-1',
			data: [2, 3, 2, 2.5, 5, 6, 4.1, 3],
		},
	];

	return (
		<>
			<div id='StakingPool' className='container'>
				<div className='header my-5'>
					<div className='title_wrapper py-3 d-flex justify-content-between'>
						<p id='title'>$ECTO Staking Pool</p>
					</div>
				</div>
				<div className='body'>
					<div className='row'>
						{/* <Chart
							options={chartOptions}
							series={chartSeries}
							type='line'
							width='100%'
							height='300px'
						/> */}
					</div>
					<div className='row'>
						<div className='row-item col-12 col-sm-12 col-md-6'>
							<div className='card'>
								<div className='card-body'>
									<p className='card-text'>
										Total Staked: 0.000
									</p>
									<p className='card-text'>
										Your Tokens: 0.000
									</p>
									<p className='card-text'>
										Total Value: $0.000
									</p>
								</div>
							</div>
						</div>
						<div className='row-item col-12 col-sm-12 col-md-6'>
							<div className='card'>
								<div className='card-body'>
									<p className='card-text'>APR: 5%</p>
								</div>
							</div>
						</div>
					</div>
					<div className='row'>
						<div className='row-item col-12'>
							<div className='card'>
								<div className='card-body'>
									<div className='stake-unstake text-end'>
										<button
											className={`stake ${
												stakingState === STATES.STAKE
													? 'active'
													: ''
											}`}
											onClick={() => {
												setStakingState(STATES.STAKE);
											}}
										>
											Stake
										</button>
										<button
											className={`unstake ${
												stakingState === STATES.UNSTAKE
													? 'active'
													: ''
											}`}
											onClick={() => {
												setStakingState(STATES.UNSTAKE);
											}}
										>
											Unstake
										</button>
									</div>
									<div className='d-flex flex-column justify-content-between flex-md-row'>
										<div>
											<p className='card-text'>
												Available:{' '}
												{stakingState === STATES.STAKE
													? avaliableTokens
													: stakedTokens}
											</p>
										</div>
										<div className='percentages text-end'>
											<button
												onClick={() => {
													setStakingState(
														STATES.UNSTAKE
													);
												}}
											>
												25%
											</button>
											<button
												onClick={() => {
													setStakingState(
														STATES.UNSTAKE
													);
												}}
											>
												50%
											</button>
											<button
												onClick={() => {
													setStakingState(
														STATES.UNSTAKE
													);
												}}
											>
												75%
											</button>
											<button
												onClick={() => {
													setStakingState(
														STATES.UNSTAKE
													);
												}}
											>
												100%
											</button>
										</div>
									</div>
									<div className='amount'>
										<input
											type='number'
											placeholder={`Enter an amount to ${
												stakingState === STATES.STAKE
													? 'stake'
													: 'unstake'
											}`}
										/>
									</div>
									<div className='approve-stake-unstake'>
										{!approved && (
											<button
												className='approve'
												onClick={() => {
													approve();
												}}
											>
												Approve
											</button>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default StakingPool;
