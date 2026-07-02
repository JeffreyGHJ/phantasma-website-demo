import './index.scss';

import { FormEvent, useCallback, useEffect, useState } from 'react';

import LabelInput from '../../../widgets/Input/LabelInput';
import Loading from '../../../widgets/Loading';
import { ectoContractAddress } from '../../../../constants/ContractAddresses';
import { extractNumbersFromString } from '../../../../utils/NumberUtil';
import { getBalanceOf } from '../../../../hooks/erc20/useBalanceOf';
import { isNaN } from 'lodash';
import usePageTitle from '../../../../hooks/usePageTitle';
import { useTranslation } from 'react-i18next';

const totalSupply = 1000000000000;
const circulatingSupplyExcludedWallets = [
	'0x81e0ef68e103ee65002d3cf766240ed1c070334d', // KIPS: Locked Wallet
	'0x000000000000000000000000000000000000dead', // Burned address
	'0x8c16be4a87d83bcf56e6977f4f6dc3a00df276ce', // Staking
];

const EarningCalculator = () => {
	usePageTitle('Earning Calculator | Phantasma');

	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'ProfileSections.EarningCalculator',
	});

	const [volume24hr, setVolume24Hr] = useState('1000000');
	const [xEctoMultiplier, setXEctoMultiplier] = useState('1000');
	const [volumeMicroTx24hr, setVolumeMicroTx24hr] = useState('50000');
	const [circulatingSupply, setCirculatingSupply] = useState('0');
	const [estimatedEarningPerHour, setEstimatedEarningPerHour] = useState<
		string | number
	>(0);

	const handleOnVolume24hrChange = (evt: FormEvent<HTMLInputElement>) => {
		const value = evt.currentTarget.value;
		setVolume24Hr(extractNumbersFromString(value));
	};

	const handleOnXEctoMultiplierChange = (
		evt: FormEvent<HTMLInputElement>
	) => {
		const value = evt.currentTarget.value;
		setXEctoMultiplier(extractNumbersFromString(value));
	};

	const handleOnVolumeMicroTxChange = (evt: FormEvent<HTMLInputElement>) => {
		const value = evt.currentTarget.value;
		setVolumeMicroTx24hr(extractNumbersFromString(value));
	};

	const handleOnCirculatingSupplyChange = (
		evt: FormEvent<HTMLInputElement>
	) => {
		const value = evt.currentTarget.value;
		setCirculatingSupply(extractNumbersFromString(value));
	};

	const calculate = useCallback(() => {
		const v = volume24hr ? +volume24hr : 0;
		const e = volumeMicroTx24hr ? +volumeMicroTx24hr : 0;
		const x = xEctoMultiplier ? +xEctoMultiplier : 0;
		const c = circulatingSupply ? +circulatingSupply : 0;

		const result = (
			((0.05 * v + 0.05 * e) / 24) *
			(x / (c / 10000000))
		).toFixed(2);

		setEstimatedEarningPerHour(result);
	}, [volume24hr, xEctoMultiplier, volumeMicroTx24hr, circulatingSupply]);

	useEffect(() => {
		let mounted = true;
		const promises = [] as Array<Promise<string>>;
		circulatingSupplyExcludedWallets.forEach((walletAddress) => {
			promises.push(
				getBalanceOf({
					account: walletAddress,
					tokenAddress: ectoContractAddress,
					decimal: 9,
				})
			);
		});

		Promise.all(promises).then((results) => {
			let excluded = 0;
			results.forEach((result) => {
				const parsedResult = +result;
				if (!isNaN(parsedResult)) {
					excluded += parsedResult;
				}
			});

			if (mounted) {
				setCirculatingSupply(
					(totalSupply - excluded).toFixed().toString()
				);
			}
		});

		return () => {
			mounted = false;
		};
	}, []);

	useEffect(() => {
		calculate();
	}, [
		volume24hr,
		xEctoMultiplier,
		volumeMicroTx24hr,
		circulatingSupply,
		calculate,
	]);

	return (
		<div id='EarningCalculator'>
			<div className='title'>
				<Loading loading={!ready}>
					{t('earning_calculator', {
						defaultValue: 'Earning Calculator',
					})}
				</Loading>
			</div>

			<div className='calculation-section'>
				<div className='earning-input-group'>
					<div className='earning-input-item'>
						<LabelInput
							labelElement={
								<Loading loading={!ready}>
									{t('24hr_ecto_volume', {
										defaultValue: '24hr $ECTO USD Volume',
									})}
								</Loading>
							}
							value={volume24hr}
							onChange={handleOnVolume24hrChange}
						/>
					</div>
					<div className='earning-input-item'>
						<LabelInput
							labelElement={
								<Loading loading={!ready}>
									{t('xecto_multiplier', {
										defaultValue: 'xECTO Multiplier',
									})}
								</Loading>
							}
							value={xEctoMultiplier}
							onChange={handleOnXEctoMultiplierChange}
						/>
					</div>
					<div className='earning-input-item'>
						<LabelInput
							labelElement={
								<Loading loading={!ready}>
									{t('24hr_microtransaction_volume', {
										defaultValue:
											'24hr Micro Tx USD Volume',
									})}
								</Loading>
							}
							value={volumeMicroTx24hr}
							onChange={handleOnVolumeMicroTxChange}
						/>
					</div>
					<div className='earning-input-item'>
						<LabelInput
							labelElement={
								<Loading loading={!ready}>
									{t('circulating_supplay', {
										defaultValue: 'Circulating Supply',
									})}
								</Loading>
							}
							value={circulatingSupply}
							onChange={handleOnCirculatingSupplyChange}
						/>
					</div>
				</div>
				<div className='hourly-earning'>
					<Loading loading={!ready}>
						{t('estimated_hourly_earning', {
							defaultValue: 'Estimated Hourly Earning',
						})}
						:{' '}
						<strong className='hourly-earning-result'>
							~${estimatedEarningPerHour}
						</strong>
					</Loading>
				</div>
			</div>
		</div>
	);
};

export default EarningCalculator;
