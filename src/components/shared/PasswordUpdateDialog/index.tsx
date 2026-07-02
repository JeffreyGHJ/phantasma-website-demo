import './index.scss';

import { FormEvent, useEffect, useRef, useState } from 'react';
import {
	useUpdateOverlay,
	useUpdateUser,
} from '../../../state/application/hooks';

import { Grid } from '@mui/material';
import Input from '../../widgets/Input';
import Modal from '../../widgets/Modal';
import OutlinedButton from '../../widgets/Button/OutlinedButton';
import PasswordStrengthMeter from '../../widgets/PasswordStrengthMeter';
import { RECAPTCHA_ENABLED, RECAPTCHA_SITE_KEY } from '../../../constants/recaptchaSiteKeys';
import ReCAPTCHA from 'react-google-recaptcha';
import { updatePassword } from '../../../apis/web/web.api';
import { useHandleUnauthorizedResponse } from '../../../hooks/useAuth';
import { useSnackbar } from 'notistack';

const passingPasswordScore = 50;

const PasswordUpdateDialog = ({
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
}) => {
	const updateUser = useUpdateUser();
	const { enqueueSnackbar } = useSnackbar();
	const updateOverlay = useUpdateOverlay();
	const handleUnauthorizedResponse = useHandleUnauthorizedResponse();

	const [currentPassword, setCurrentPassword] = useState('');
	const [recaptcha, setRecaptcha] = useState('');
	const [showRecaptcha, setShowRecaptcha] = useState(false);
	const [password, setPassword] = useState('');
	const [passwordConfirmation, setPasswordConfirmation] = useState('');
	const [disableUpdate, setDisableUpdate] = useState(true);
	const [passwordScore, setPasswordScore] = useState(0);
	const recaptchaRef = useRef<any>();

	const onPasswordUpdateFormSubmit = async (
		evt: FormEvent<HTMLFormElement>
	) => {
		evt.preventDefault();

		if (RECAPTCHA_ENABLED && !showRecaptcha) {
			setShowRecaptcha(true);
			return;
		}

		if (!currentPassword || !password || (RECAPTCHA_ENABLED && !recaptcha)) {
			return;
		}

		updateOverlay(true);
		updatePassword({
			currentPassword,
			password,
			passwordConfirmation,
			recaptcha,
		})
			.then((_user) => {
				updateUser(_user);
				updateOverlay(false);
				enqueueSnackbar('Password updated successfully', {
					variant: 'success',
				});
				onClose();
			})
			.catch((error) => {
				if (error.response) {
					const err = error.response.data;
					enqueueSnackbar(err.errMsg || 'Unknown error', {
						variant: 'error',
					});

					if (error.response.status === 401) {
						handleUnauthorizedResponse();
					}
				} else {
					console.log(error);
					enqueueSnackbar('Unknown error', {
						variant: 'error',
					});
				}
				updateOverlay(false);
				if (recaptchaRef.current) {
					recaptchaRef.current.reset();
				}
			});
	};

	useEffect(() => {
		if (showRecaptcha) {
			if (
				currentPassword &&
				password &&
				passwordConfirmation &&
				recaptcha &&
				passwordScore >= passingPasswordScore &&
				password === passwordConfirmation
			) {
				setDisableUpdate(false);
				return () => {};
			}
		} else if (
			currentPassword &&
			password &&
			passwordConfirmation &&
			passwordScore >= passingPasswordScore &&
			password === passwordConfirmation
		) {
			setDisableUpdate(false);
			return () => {};
		}
		setDisableUpdate(true);
		return () => {};
	}, [
		currentPassword,
		password,
		passwordConfirmation,
		recaptcha,
		showRecaptcha,
		passwordScore,
	]);

	return (
		<Modal open={open} onClose={onClose} className='PasswordUpdateDialog'>
			<div className='PasswordUpdateDialog-Content scrollbar'>
				<form
					className='password-update-form'
					onSubmit={(evt) => {
						onPasswordUpdateFormSubmit(evt);
					}}
				>
					<Grid container direction='column'>
						<Grid item className='mt-4'>
							<Input
								className='current-password'
								type='password'
								placeholder='Current password'
								value={currentPassword}
								onChange={(evt) => {
									setCurrentPassword(evt.currentTarget.value);
								}}
							/>
						</Grid>
						<Grid item className='mt-4'>
							<Input
								className='password'
								type='password'
								placeholder='New password'
								value={password}
								onChange={(evt) => {
									setPassword(evt.currentTarget.value);
								}}
							/>
						</Grid>
						<Grid item className='mt-4'>
							<div className='password-confirmation-input'>
								{password &&
									passwordConfirmation &&
									password !== passwordConfirmation && (
										<div className='password-confirmation-error'>
											Passwords do not match
										</div>
									)}

								<Input
									className='password-confirmation'
									type='password'
									placeholder='Password confirmation'
									value={passwordConfirmation}
									onChange={(evt) => {
										setPasswordConfirmation(
											evt.currentTarget.value
										);
									}}
								/>
							</div>

							{password && (
								<PasswordStrengthMeter
									password={password}
									onChange={(_score) => {
										setPasswordScore(_score);
									}}
								/>
							)}
						</Grid>
						{RECAPTCHA_ENABLED && (
							<Grid
								item
								className={`mt-4 ${!showRecaptcha ? 'hide' : ''}`}
							>
								<ReCAPTCHA
									className='recaptcha'
									sitekey={RECAPTCHA_SITE_KEY}
									ref={recaptchaRef}
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
						)}
						<Grid item className='mt-5 text-center'>
							<OutlinedButton disabled={disableUpdate}>
								<span className='btn-text'>
									Update Password
								</span>
							</OutlinedButton>
						</Grid>
					</Grid>
				</form>
			</div>
		</Modal>
	);
};

export default PasswordUpdateDialog;
