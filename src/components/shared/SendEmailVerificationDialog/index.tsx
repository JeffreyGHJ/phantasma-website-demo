import './index.scss';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { RECAPTCHA_SITE_KEY_ALT } from '../../../constants/recaptchaSiteKeys';

import { Grid } from '@mui/material';
import Modal from '../../widgets/Modal';
import OutlinedButton from '../../widgets/Button/OutlinedButton';
import ReCAPTCHA from 'react-google-recaptcha';
import { sendEmailVerification } from '../../../apis/web/web.api';
import { useSnackbar } from 'notistack';
import { useUpdateOverlay } from '../../../state/application/hooks';
import { validateEmail } from '../../../utils/emailUtil';

const SendEmailVerificationDialog = ({
	email,
	open,
	onClose,
}: {
	email: string;
	open: boolean;
	onClose: () => void;
}) => {
	const updateOverlay = useUpdateOverlay();
	const { enqueueSnackbar } = useSnackbar();
	const [recaptcha, setRecaptcha] = useState('');
	const [showRecaptcha, setShowRecaptcha] = useState(false);
	const [disableSend, setDisableSend] = useState(true);
	const [timer, setTimer] = useState(0);
	const [timerInterval, setTimerInterval] = useState<any>();
	const [isValidEmail, setIsValidEmail] = useState(false);

	const setCountDownTimer = useCallback(() => {
		const time = 60;
		let count = 0;

		if (timerInterval) {
			clearInterval(timerInterval);
		}

		const interval = setInterval(() => {
			setTimer(time - count);
			count = count + 1;
		}, 1000);

		setTimerInterval(interval);
	}, [timerInterval]);

	const onSendEmailVerificationFormSubmit = async (
		evt: FormEvent<HTMLFormElement>
	) => {
		evt.preventDefault();

		if (!showRecaptcha) {
			setShowRecaptcha(true);
			return;
		}

		if (!email || !recaptcha) {
			return;
		}
		setCountDownTimer();
		updateOverlay(true);
		sendEmailVerification({
			email,
			recaptcha,
		})
			.then((response) => {
				updateOverlay(false);
				enqueueSnackbar('Verification email sent.', {
					variant: 'success',
				});
			})
			.catch((err) => {
				console.log(err);
				updateOverlay(false);
				enqueueSnackbar(
					'Verification email failed to send. Please try again later',
					{ variant: 'error' }
				);
			});
	};

	useEffect(() => {
		setIsValidEmail(validateEmail(email));
	}, [email]);

	useEffect(() => {
		if (showRecaptcha) {
			if (email && recaptcha && isValidEmail) {
				setDisableSend(false);
				return () => {};
			}
		} else if (email && isValidEmail) {
			setDisableSend(false);
			return () => {};
		}
		setDisableSend(true);
		return () => {};
	}, [email, recaptcha, showRecaptcha, isValidEmail]);

	return (
		<Modal
			open={open}
			onClose={onClose}
			className='SendEmailVerificationDialog'
		>
			<div className='SendEmailVerificationDialog-Content'>
				<form
					className='send-email-verification-form'
					onSubmit={(evt) => {
						onSendEmailVerificationFormSubmit(evt);
					}}
				>
					<Grid container direction='column'>
						<Grid item className='mt-5 title'>
							Your email is not yet verified. Please check your
							email for an activation link.
						</Grid>
						<Grid
							item
							className={`mt-4 ${!showRecaptcha ? 'hide' : ''}`}
						>
							<ReCAPTCHA
								className='recaptcha mt-4'
								sitekey={RECAPTCHA_SITE_KEY_ALT}
								onChange={(token) => {
									if (token) {
										setRecaptcha(token);
									}
								}}
								onExpired={() => {
									setRecaptcha('');
								}}
							/>
						</Grid>
						{timer > 0 && (
							<Grid item className='mt-5 countdown'>
								{timer}
							</Grid>
						)}
						{timer <= 0 && (
							<Grid item className='mt-5'>
								<OutlinedButton
									className='send'
									disabled={disableSend}
								>
									<span className='btn-text'>
										Send Verification Email
									</span>
								</OutlinedButton>
							</Grid>
						)}
					</Grid>
				</form>
			</div>
		</Modal>
	);
};

export default SendEmailVerificationDialog;
