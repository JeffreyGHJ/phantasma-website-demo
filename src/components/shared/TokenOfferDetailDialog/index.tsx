import './index.scss';

import { Grid, Step, StepLabel, Stepper } from '@mui/material';
import {
	getPaymentTokenDecimals,
	getTokenPriceInUsd,
} from '../../../utils/funcs';
import {
	useBnbPriceInUsd,
	useEctoPriceInUsd,
} from '../../../state/application/hooks';
import { useEffect, useMemo, useState } from 'react';

import Input from '../../widgets/Input';
import Loading from '../../widgets/Loading';
import Modal from '../../widgets/Modal';
import OutlinedButton from '../../widgets/Button/OutlinedButton';
import PaymentTokenSelect from '../../widgets/Select/PaymentTokenSelect';
import TokenOffer from '../../../constants/types/TokenOffer';
import { fromSolidityTokenFormat } from '../../../utils/MathUtil';
import { paymentTokens } from '../../../constants/constant';
import { useActiveWeb3React } from '../../../hooks';
import { useTranslation } from 'react-i18next';

const TokenOfferDetailDialog = ({
	open,
	imageLink,
	onClose,
	offer,
	onAcceptOffer,
	onRejectOffer,
	onCancelOffer,
	onApprove,
	ownerAddress,
	approved,
}: {
	open: boolean;
	imageLink: string;
	onClose: () => void;
	offer: TokenOffer;
	onAcceptOffer: () => void;
	onRejectOffer: () => void;
	onCancelOffer: () => void;
	onApprove: () => void;
	ownerAddress: string;
	approved: boolean;
}) => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'Modals.TokenOfferDetailDialog',
	});

	const { account } = useActiveWeb3React();
	const ectoPrice = useEctoPriceInUsd();
	const bnbPrice = useBnbPriceInUsd();
	const [activeStep, setActiveStep] = useState(0);

	const paymentToken = useMemo(() => {
		const found = paymentTokens.find(
			(x) => x.tokenAddress === offer.tokenAddress.toLowerCase()
		);

		if (!found) {
			return {
				name: 'Unknown Token',
				decimals: 0,
				tokenAddress: '',
			};
		}
		return found;
	}, [offer.tokenAddress]);

	useEffect(() => {
		if (approved) {
			setActiveStep(1);
		} else {
			setActiveStep(0);
		}
	}, [approved]);

	return (
		<Modal open={open} onClose={onClose} className='TokenOfferDetailDialog'>
			<div className='TokenOfferDetailDialog-Content scrollbar'>
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
						{t('offer', { defaultValue: 'Offer' })}
					</Loading>
				</h2>

				<Grid
					container
					justifyContent='space-between'
					className='pt-4'
					gap={'2rem'}
					alignItems='center'
				>
					<Grid item>
						<h3>
							<Loading loading={!ready}>
								{t('payment_token', {
									defaultValue: 'Payment Token',
								})}
							</Loading>
						</h3>
					</Grid>
					<Grid item>
						<div>
							<PaymentTokenSelect
								paymentToken={paymentToken}
								disabled={true}
							/>
						</div>
					</Grid>
				</Grid>
				<Grid
					container
					justifyContent='space-between'
					className='pt-4'
					alignItems='center'
					gap='2rem'
				>
					<Grid item>
						<h3>
							<Loading loading={!ready}>
								{t('offer_amount', {
									defaultValue: 'Offer Amount',
								})}
							</Loading>
						</h3>
					</Grid>
					<Grid item>
						<div>
							<Input
								defaultValue={
									+fromSolidityTokenFormat(
										offer.price,
										getPaymentTokenDecimals(
											offer.tokenAddress
										)
									)
								}
								required
								disabled
							/>
						</div>
						<span>
							$
							{getTokenPriceInUsd({
								address: offer.tokenAddress,
								amount: offer.price,
								bnbPrice,
								ectoPrice,
							})}
						</span>
					</Grid>
				</Grid>
				<div className='cancel-reject'>
					{account &&
						account.toLowerCase() === offer.buyer.toLowerCase() && (
							<div>
								<OutlinedButton onClick={() => onCancelOffer()}>
									<Loading loading={!ready}>
										{t('cancel', {
											defaultValue: 'Cancel',
										})}
									</Loading>
								</OutlinedButton>
							</div>
						)}
					{account &&
						account.toLowerCase() ===
							ownerAddress.toLowerCase() && (
							<div>
								<OutlinedButton onClick={() => onRejectOffer()}>
									<Loading loading={!ready}>
										{t('reject', {
											defaultValue: 'Reject',
										})}
									</Loading>
								</OutlinedButton>
							</div>
						)}
				</div>
				{account &&
					account.toLowerCase() === ownerAddress.toLowerCase() && (
						<div className='full-width'>
							<div className='full-width mt-3'>
								<Stepper
									activeStep={activeStep}
									alternativeLabel
								>
									<Step>
										<StepLabel key={'Approve'}>
											{approved ? (
												<OutlinedButton disabled>
													<Loading loading={!ready}>
														{t('approved', {
															defaultValue:
																'Approved',
														})}
													</Loading>
												</OutlinedButton>
											) : (
												<OutlinedButton
													onClick={() => onApprove()}
												>
													<Loading loading={!ready}>
														{t('approve', {
															defaultValue:
																'Approve',
														})}
													</Loading>
												</OutlinedButton>
											)}
										</StepLabel>
									</Step>
									<Step>
										<StepLabel key={'Accept'}>
											{approved ? (
												<OutlinedButton
													onClick={() =>
														onAcceptOffer()
													}
												>
													<Loading loading={!ready}>
														{t('accept', {
															defaultValue:
																'Accept',
														})}
													</Loading>
												</OutlinedButton>
											) : (
												<OutlinedButton disabled>
													<Loading loading={!ready}>
														{t('accept', {
															defaultValue:
																'Accept',
														})}
													</Loading>
												</OutlinedButton>
											)}
										</StepLabel>
									</Step>
								</Stepper>
							</div>
						</div>
					)}
			</div>
		</Modal>
	);
};

export default TokenOfferDetailDialog;
