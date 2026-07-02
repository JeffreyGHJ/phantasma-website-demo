import './AuctionDialog.scss';

import { Checkbox, FormControl, Grid, MenuItem, Select } from '@mui/material';
import {
	useBnbPriceInUsd,
	useEctoPriceInUsd,
} from '../../../state/application/hooks';
import { useCallback, useState } from 'react';

import Input from '../../widgets/Input';
import Loading from '../../widgets/Loading';
import Modal from '../../widgets/Modal';
import OutlinedButton from '../../widgets/Button/OutlinedButton';
import Translation from '../../widgets/Translation';
import { durations } from '../../../utils/AuctionUtil';
import { getTokenPriceInUsd } from '../../../utils/funcs';
import { paymentTokens } from '../../../constants/constant';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

const AuctionDialog = ({
	open,
	imageLink,
	onClose,
	onCreateAuction,
	approved,
	onApprove = () => {},
}: {
	open: boolean;
	imageLink: string;
	onClose: () => void;
	onCreateAuction: ({
		paymentToken,
		bidOnly,
		buyoutAmount,
		duration,
		startingBid,
	}) => void;
	approved: boolean;
	onApprove: () => void;
}) => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'Modals.AuctionDialog',
	});

	const { enqueueSnackbar } = useSnackbar();
	const [paymentToken, setPaymentToken] = useState(paymentTokens[0]);
	const [duration, setDuration] = useState(durations[0]);
	const [bidOnly, setBidOnly] = useState(false);
	const [buyoutAmount, setBuyoutAmount] = useState(0);
	const [startingBid, setStartingBid] = useState(0);
	const ectoPrice = useEctoPriceInUsd();
	const bnbPrice = useBnbPriceInUsd();

	const handleOnCreateAuction = useCallback(() => {
		if (!bidOnly) {
			if (!buyoutAmount) {
				enqueueSnackbar(
					t('ERROR_MESSAGES.INVALID_BUYOUT_PRICE', {
						defaultValue: 'Please enter a valid buyout price',
					}),
					{
						variant: 'error',
					}
				);
				return;
			}

			if (buyoutAmount <= startingBid) {
				enqueueSnackbar(
					t('ERROR_MESSAGES.BUYTOUT_LESS_THAN_STARTING_BID', {
						defaultValue:
							'Buyout amount must be greater than the starting bid',
					}),
					{
						variant: 'error',
					}
				);
				return;
			}
		}

		onCreateAuction({
			paymentToken,
			bidOnly,
			buyoutAmount,
			duration: duration.seconds,
			startingBid,
		});
	}, [
		paymentToken,
		bidOnly,
		buyoutAmount,
		startingBid,
		duration,
		onCreateAuction,
		enqueueSnackbar,
		t,
	]);

	return (
		<Modal open={open} onClose={onClose} className='AuctionDialog'>
			<div className='AuctionDialog-Content'>
				<div>
					<img
						src={imageLink}
						alt=''
						height='200px'
						width='200px'
						style={{ objectFit: 'cover', borderRadius: '100%' }}
					/>
				</div>

				<h2>
					<Loading loading={!ready}>
						{t('title', { defaultValue: 'Auction' })}{' '}
					</Loading>
				</h2>

				<Grid
					container
					justifyContent='space-between'
					className='pt-4'
					gap='3rem'
				>
					<Grid item style={{ alignSelf: 'center' }}>
						<Translation ready={ready}>
							<h3>{t('payment_token')}</h3>
						</Translation>
					</Grid>
					<Grid item>
						<div>
							<PaymentTokenSelect
								paymentToken={paymentToken}
								setPaymentToken={setPaymentToken}
							/>
						</div>
					</Grid>
				</Grid>
				<Grid
					container
					justifyContent='space-between'
					className='pt-4'
					gap='3rem'
				>
					<Grid item style={{ alignSelf: 'center' }}>
						<h3>
							<Loading loading={!ready}>
								{t('duration', { defaultValue: 'Duration' })}
							</Loading>
						</h3>
					</Grid>
					<Grid item>
						<div>
							<DurationSelect
								duration={duration}
								setDuration={setDuration}
								ready={ready}
								t={t}
							/>
						</div>
					</Grid>
				</Grid>
				<Grid
					container
					justifyContent='space-between'
					className='pt-4'
					gap='3rem'
				>
					<Grid item style={{ alignSelf: 'center' }}>
						<h3>
							<Loading loading={!ready}>
								{t('bid_only', {
									defaultValue: 'Bid Only',
								})}
							</Loading>
						</h3>
					</Grid>
					<Grid item>
						<div>
							<Checkbox
								checked={bidOnly}
								onChange={(event) => {
									setBidOnly(event.target.checked);
								}}
								inputProps={{ 'aria-label': 'controlled' }}
								sx={{
									'& .MuiSvgIcon-root': { fontSize: 28 },
								}}
							/>
						</div>
					</Grid>
				</Grid>
				{!bidOnly && (
					<Grid
						container
						justifyContent='space-between'
						className='pt-4'
						gap='3rem'
					>
						<Grid item style={{ alignSelf: 'center' }}>
							<h3>
								<Loading loading={!ready}>
									{t('buyout_amount', {
										defaultValue: 'Buyout Amount',
									})}
								</Loading>
							</h3>
						</Grid>
						<Grid item>
							<div>
								<Input
									required
									onChange={(event) =>
										setBuyoutAmount(
											+event.currentTarget.value
										)
									}
								/>
							</div>
							<span>
								$
								{getTokenPriceInUsd({
									address: paymentToken.tokenAddress,
									amount: buyoutAmount,
									ectoPrice,
									bnbPrice,
									solidityFormat: false,
								})}
							</span>
						</Grid>
					</Grid>
				)}
				<Grid
					container
					justifyContent='space-between'
					className='pt-4'
					gap='3rem'
				>
					<Grid item style={{ alignSelf: 'center' }}>
						<h3>
							<Loading loading={!ready}>
								{t('starting_bid', {
									defaultValue: 'Starting Bid',
								})}
							</Loading>
						</h3>
					</Grid>
					<Grid item>
						<div>
							<Input
								required
								onChange={(event) =>
									setStartingBid(+event.currentTarget.value)
								}
							/>
						</div>
						<span>
							$
							{getTokenPriceInUsd({
								address: paymentToken.tokenAddress,
								amount: startingBid,
								ectoPrice,
								bnbPrice,
								solidityFormat: false,
							})}
						</span>
					</Grid>
				</Grid>
				<div className='d-flex justify-content-center pt-3'>
					<div className='button-wrapper'>
						{approved ? (
							<OutlinedButton
								onClick={() => handleOnCreateAuction()}
							>
								<Loading loading={!ready}>
									{t('create_auction', {
										defaultValue: 'Create Auction',
									})}
								</Loading>
							</OutlinedButton>
						) : (
							<OutlinedButton onClick={() => onApprove()}>
								<Loading loading={!ready}>
									{t('approve', {
										defaultValue: 'Approve',
									})}
								</Loading>
							</OutlinedButton>
						)}
					</div>
				</div>
			</div>
		</Modal>
	);
};

const PaymentTokenSelect = ({ paymentToken, setPaymentToken }) => {
	return (
		<FormControl
			variant='outlined'
			style={{
				minWidth: '180px',
			}}
		>
			<Select
				value={paymentToken.tokenAddress}
				onChange={(evt) => {
					setPaymentToken(
						paymentTokens.find(
							(x) => x.tokenAddress === evt.target.value
						)
					);
				}}
			>
				{paymentTokens.map((t) => {
					return (
						<MenuItem key={t.tokenAddress} value={t.tokenAddress}>
							{t.name}
						</MenuItem>
					);
				})}
			</Select>
		</FormControl>
	);
};

//TODO: Convert this to a widget
const DurationSelect = ({ duration, setDuration, ready, t }) => {
	return (
		<FormControl
			variant='outlined'
			style={{
				minWidth: '180px',
			}}
		>
			<Select
				value={duration.seconds}
				onChange={(evt) => {
					setDuration(
						durations.find((x) => x.seconds === evt.target.value)
					);
				}}
			>
				{durations.map((d) => {
					return (
						<MenuItem key={d.seconds} value={d.seconds}>
							<Loading loading={!ready}>
								{`${d.count} ${t(d.unit.toLowerCase())}`}
							</Loading>
						</MenuItem>
					);
				})}
			</Select>
		</FormControl>
	);
};

export default AuctionDialog;
