import './index.scss';

import { FormEvent, useEffect, useRef, useState } from 'react';
import {
	useUpdateOverlay,
	useUpdateUser,
	useUser,
} from '../../../state/application/hooks';

import { Grid } from '@mui/material';
import Input from '../../widgets/Input';
import Modal from '../../widgets/Modal';
import OutlinedButton from '../../widgets/Button/OutlinedButton';
import { RECAPTCHA_ENABLED, RECAPTCHA_SITE_KEY } from '../../../constants/recaptchaSiteKeys';
import ReCAPTCHA from 'react-google-recaptcha';
import recaptchaTypes from '../../../constants/recaptchaTypes';
import { updateEmail } from '../../../apis/web/web.api';
import { useHandleUnauthorizedResponse } from '../../../hooks/useAuth';
import { useSnackbar } from 'notistack';
import { validateEmail } from '../../../utils/emailUtil';

const EmailUpdateDialog = ({
	email,
	open,
	onClose,
}: {
	email: string;
	open: boolean;
	onClose: () => void;
}) => {
	const user = useUser();
	const updateUser = useUpdateUser();
	const { enqueueSnackbar } = useSnackbar();
	const updateOverlay = useUpdateOverlay();
	const handleUnauthorizedResponse = useHandleUnauthorizedResponse();

	const [recaptcha, setRecaptcha] = useState('');
	const [showRecaptcha, setShowRecaptcha] = useState(false);
	const [newEmail, setNewEmail] = useState('');
	const [isValidEmail, setIsValidEmail] = useState(false);
	const [emailConfirmation, setEmailConfirmation] = useState('');
	const [disableUpdate, setDisableUpdate] = useState(true);
	const recaptchaRef = useRef<any>();

	const onEmailUpdateFormSubmit = async (evt: FormEvent<HTMLFormElement>) => {
		evt.preventDefault();

		if (RECAPTCHA_ENABLED && !showRecaptcha) {
			setShowRecaptcha(true);
			return;
		}

		if (!newEmail || !isValidEmail || !emailConfirmation || (RECAPTCHA_ENABLED && !recaptcha)) {
			return;
		}

		updateOverlay(true);
		updateEmail({
			currentEmail: user?.email || '',
			newEmail,
			emailConfirmation,
			recaptcha,
			recaptchaType: recaptchaTypes.V2_CHECKBOX,
		})
			.then((res) => {
				const _user = res.data;
				const msg = res.msg;
				updateUser(_user);
				updateOverlay(false);
				enqueueSnackbar(msg, {
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
				newEmail &&
				isValidEmail &&
				emailConfirmation &&
				recaptcha &&
				newEmail === emailConfirmation
			) {
				setDisableUpdate(false);
				return () => {};
			}
		} else if (
			newEmail &&
			isValidEmail &&
			emailConfirmation &&
			newEmail === emailConfirmation
		) {
			setDisableUpdate(false);
			return () => {};
		}
		setDisableUpdate(true);
		return () => {};
	}, [newEmail, isValidEmail, emailConfirmation, recaptcha, showRecaptcha]);

	useEffect(() => {
		setIsValidEmail(validateEmail(newEmail));
	}, [newEmail]);

	useEffect(() => {
		setNewEmail(email);
	}, [email]);

	return (
		<Modal open={open} onClose={onClose} className='EmailUpdateDialog'>
			<div className='EmailUpdateDialog-Content scrollbar'>
				<form
					className='email-update-form'
					onSubmit={(evt) => {
						onEmailUpdateFormSubmit(evt);
					}}
				>
					<Grid container direction='column'>
						<Grid item className='mt-4'>
							<Input
								className='current-email'
								type='email'
								placeholder='Current email'
								value={user?.email || ''}
								disabled={true}
							/>
						</Grid>
						<Grid item className='mt-4'>
							{newEmail && !isValidEmail && (
								<div className='error'>Invalid email</div>
							)}

							<Input
								className='new-email'
								type='email'
								placeholder='New email'
								value={newEmail}
								onChange={(evt) => {
									setNewEmail(evt.currentTarget.value);
								}}
							/>
						</Grid>
						<Grid item className='mt-4'>
							<div className='email-confirmation-input'>
								{newEmail &&
									emailConfirmation &&
									newEmail !== emailConfirmation && (
										<div className='error'>
											Emails do not match
										</div>
									)}

								<Input
									className='email-confirmation'
									type='email'
									placeholder='Email confirmation'
									value={emailConfirmation}
									onChange={(evt) => {
										setEmailConfirmation(
											evt.currentTarget.value
										);
									}}
								/>
							</div>
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
								<span className='btn-text'>Update Email</span>
							</OutlinedButton>
						</Grid>
					</Grid>
				</form>
			</div>
		</Modal>
	);
};

export default EmailUpdateDialog;
