import './index.scss';

import {
	useAccountBnbBalance,
	useAccountBusdBalance,
	useAccountClaimableBnbRewards,
	useAccountClaimableBusdRewards,
	useAccountClaimableWbnbRewards,
	useAccountWbnbBalance,
	useUpdateAccountBnbBalance,
	useUpdateAccountBusdBalance,
	useUpdateAccountClaimableBnbRewards,
	useUpdateAccountClaimableBusdRewards,
	useUpdateAccountClaimableWbnbRewards,
	useUpdateAccountWbnbBalance,
} from '../../../../state/application/hooks';

import { Alert } from '@mui/material';
import { ImageTag } from '../../../../utils/ImageUtil';
import Loading from '../../../widgets/Loading';
import NoWalletAlert from '../../../widgets/Alert/NoWalletAlert';
import OutlinedButton from '../../../widgets/Button/OutlinedButton';
import { fromSolidityTokenFormat } from '../../../../utils/MathUtil';
import { getBalance } from '../../../../hooks/bsc/useBalance';
import { getBusdBalance } from '../../../../hooks/bsc/useBusdBalance';
import { getHumanReadableLargeNumber } from '../../../../utils/NumberUtil';
import { getWbnbBalance } from '../../../../hooks/bsc/useWbnbBalance';
import { useAccountBnbBalanceDisplay } from '../../../../hooks/useAccountBalanceDisplay';
import { useActiveWeb3React } from '../../../../hooks';
import { useClaimRewards as useClaimBusdRewards } from '../../../../constants/abis/bsc/EctoRewardDistributorAbi/hook';
import { useClaimRewards as useClaimLittleGhostsMarketplaceRewards } from '../../../../constants/abis/bsc/LittleGhostsNftMarketplaceAbi/hook';
import { useClaimRewards as useClaimPancakeSWAPMarketplaceRewards } from '../../../../constants/abis/bsc/PancakeswapNftMarketplaceRewardAbi/hook';
import { useMemo } from 'react';
import usePageTitle from '../../../../hooks/usePageTitle';
import { useTranslation } from 'react-i18next';

const ClaimRewards = () => {
	usePageTitle('Rewards | Phantasma');

	const { account } = useActiveWeb3React();

	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'ProfileSections.ClaimRewards',
	});

	//global states
	const accountBusdBalance = useAccountBusdBalance();
	const accountWbnbBalance = useAccountWbnbBalance();
	const accountBnbBalance = useAccountBnbBalanceDisplay({
		balance: useAccountBnbBalance(),
		decimal: 3,
	});
	const accountClaimableBnbRewards = useAccountClaimableBnbRewards();
	const accountClaimableWbnbRewards = useAccountClaimableWbnbRewards();
	const accountClaimableBusdRewards = useAccountClaimableBusdRewards();

	//global updaters
	const setAccountClaimableWbnbRewards =
		useUpdateAccountClaimableWbnbRewards();
	const setAccountClaimableBnbRewards = useUpdateAccountClaimableBnbRewards();
	const setAccountClaimableBusdRewards =
		useUpdateAccountClaimableBusdRewards();
	const setAccountBnbBalance = useUpdateAccountBnbBalance();
	const setAccountWbnbBalance = useUpdateAccountWbnbBalance();
	const setAccountBusdBalance = useUpdateAccountBusdBalance();

	const accountReadableBusdBalance = useMemo(() => {
		return getHumanReadableLargeNumber({
			number: +accountBusdBalance,
			precision: 2,
		});
	}, [accountBusdBalance]);

	const accountReadableWbnbBalance = useMemo(() => {
		return getHumanReadableLargeNumber({
			number: +accountWbnbBalance,
			precision: 2,
		});
	}, [accountWbnbBalance]);

	const accountReadableBnbBalance = useMemo(() => {
		return getHumanReadableLargeNumber({
			number: +accountBnbBalance,
			precision: 2,
		});
	}, [accountBnbBalance]);

	const accountReadableBnbRewards = useMemo(() => {
		return getHumanReadableLargeNumber({
			number: +fromSolidityTokenFormat(accountClaimableBnbRewards, 18),
			precision: 4,
		});
	}, [accountClaimableBnbRewards]);

	const accountReadableWbnbRewards = useMemo(() => {
		return getHumanReadableLargeNumber({
			number: +fromSolidityTokenFormat(accountClaimableWbnbRewards, 18),
			precision: 4,
		});
	}, [accountClaimableWbnbRewards]);

	const accountReadableBusdRewards = useMemo(() => {
		return getHumanReadableLargeNumber({
			number: +fromSolidityTokenFormat(accountClaimableBusdRewards, 18),
			precision: 2,
		});
	}, [accountClaimableBusdRewards]);

	// Claim reward functions
	const claimWbnbRewards = useClaimLittleGhostsMarketplaceRewards(
		(receipt) => {
			setAccountClaimableWbnbRewards(0);
			getWbnbBalance(account || '').then((_balance) => {
				setAccountWbnbBalance(_balance);
			});
		}
	);

	const claimBnbRewards = useClaimPancakeSWAPMarketplaceRewards((receipt) => {
		setAccountClaimableBnbRewards(0);
		getBalance(account || '').then((_balance) => {
			setAccountBnbBalance(_balance);
		});
	});

	const claimBusdRewards = useClaimBusdRewards(() => {
		setAccountClaimableBusdRewards(0);
		getBusdBalance(account || '').then((_balance) => {
			setAccountBusdBalance(_balance);
		});
	});

	return (
		<div id='ClaimRewards'>
			<section className='assets-section'>
				<div className='title'>
					<Loading loading={!ready}>
						{t('wallets', {
							defaultValue: 'Wallets',
						})}
					</Loading>
				</div>
				<div className='assets'>
					<div className='asset-wrapper'>
						<div className='asset'>
							<div className='logo'>
								<ImageTag
									src={`${process.env.PUBLIC_URL}/assets/images/icons/token_icons/binance_32.webp`}
									width='30px'
									height='auto'
									alt='bnb'
								/>
							</div>
							<div className='label'>
								{accountReadableBnbBalance.number}
								{accountReadableBnbBalance.unit} BNB
							</div>
						</div>
					</div>
					<div className='asset-wrapper'>
						<div className='asset'>
							<div className='logo'>
								<ImageTag
									src={`${process.env.PUBLIC_URL}/assets/images/icons/token_icons/binance_32.webp`}
									width='30px'
									height='auto'
									alt='wbnb'
								/>
							</div>
							<div className='label'>
								{accountReadableWbnbBalance.number}
								{accountReadableWbnbBalance.unit} WBNB
							</div>
						</div>
					</div>
					<div className='asset-wrapper'>
						<div className='asset'>
							<div className='logo'>
								<ImageTag
									src={`${process.env.PUBLIC_URL}/assets/images/icons/token_icons/busd_32.webp`}
									width='30px'
									height='auto'
									alt='busd'
								/>
							</div>
							<div className='label'>
								{accountReadableBusdBalance.number}
								{accountReadableBusdBalance.unit} BUSD
							</div>
						</div>
					</div>
				</div>
			</section>
			<section className='rewards-section'>
				<div className='title'>
					<Loading loading={!ready}>
						{t('rewards', {
							defaultValue: 'Rewards',
						})}
					</Loading>
				</div>
				<div className='claimable-rewards'>
					<div className='claimable-reward'>
						<div className='claimable-description'>
							<Loading loading={!ready}>
								{t('official_marketplace', {
									defaultValue: 'Official Marketplace',
								})}
							</Loading>
						</div>
						<div className='claimable-amount'>
							{accountReadableWbnbRewards.number}
							{accountReadableWbnbRewards.unit} WBNB
						</div>

						<OutlinedButton
							className='claim-btn'
							onClick={() => {
								claimWbnbRewards();
							}}
						>
							<Loading loading={!ready}>
								{t('claim', {
									defaultValue: 'Claim',
								})}
							</Loading>
						</OutlinedButton>
					</div>
					<div className='claimable-reward'>
						<div className='claimable-description'>
							<Loading loading={!ready}>
								{t('third_party_sales', {
									defaultValue: 'Third Party Sales',
								})}
							</Loading>
						</div>
						<div className='claimable-amount'>
							{accountReadableBnbRewards.number}
							{accountReadableBnbRewards.unit} BNB
						</div>

						<OutlinedButton
							className='claim-btn'
							onClick={() => {
								claimBnbRewards();
							}}
						>
							<Loading loading={!ready}>
								{t('claim', {
									defaultValue: 'Claim',
								})}
							</Loading>
						</OutlinedButton>
					</div>
				</div>
			</section>
		</div>
	);
};

export default ClaimRewards;
