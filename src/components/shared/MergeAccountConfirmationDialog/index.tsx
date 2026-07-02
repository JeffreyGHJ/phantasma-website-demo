import './index.scss';

import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import {
	useUpdateOverlay,
	useUpdateUser,
	useUser,
} from '../../../state/application/hooks';

import { Grid } from '@mui/material';
import Modal from '../../widgets/Modal';
import OutlinedButton from '../../widgets/Button/OutlinedButton';
import { RECAPTCHA_SITE_KEY } from '../../../constants/recaptchaSiteKeys';
import ReCAPTCHA from 'react-google-recaptcha';
import { mergeAccount } from '../../../apis/web/web.api';
import { useActiveWeb3React } from '../../../hooks';
import { useHandleUnauthorizedResponse } from '../../../hooks/useAuth';
import { useSnackbar } from 'notistack';

const MergeAccountConfirmationDialog = ({
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
}) => {
	const updateOverlay = useUpdateOverlay();
	const { enqueueSnackbar } = useSnackbar();
	const [recaptcha, setRecaptcha] = useState('');
	const [disableConfirm, setDisableConfirm] = useState(true);
	const { account, library } = useActiveWeb3React();
	const user = useUser();
	const updateUser = useUpdateUser();
	const handleUnauthorizedResponse = useHandleUnauthorizedResponse();
	const recaptchaRef = useRef<any>();

	const onConfirmAccountMerge = async (evt: FormEvent<HTMLFormElement>) => {
		evt.preventDefault();

		if (!account || !library || !recaptcha || !user) {
			return;
		}

		const signer = library.getSigner();
		const signature = await signer.signMessage(
			`Merge ${account.toLowerCase()}\n\n`
		);

		if (!signature) {
			enqueueSnackbar('No signature was provided', {
				variant: 'error',
			});
		}

		updateOverlay(true);
		mergeAccount({
			walletAddress: account,
			recaptcha,
			signature,
		})
			.then((user) => {
				updateUser(user);
				updateOverlay(false);
				enqueueSnackbar('Account merged successfully', {
					variant: 'success',
				});
				handleClose();
			})
			.catch((error) => {
				if (error.response) {
					enqueueSnackbar(
						error.response.data.errMsg || 'Unknown error',
						{
							variant: 'error',
						}
					);
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
		if (recaptcha && account && library && user) {
			setDisableConfirm(false);
			return;
		}
		setDisableConfirm(true);
		return () => {};
	}, [recaptcha, account, library, user]);

	const handleClose = useCallback(() => {
		onClose();
		if (recaptchaRef.current) {
			recaptchaRef.current.reset();
		}
	}, [recaptchaRef, onClose]);

	return (
		<Modal
			open={open}
			onClose={() => {
				handleClose();
			}}
			className='MergeAccountConfirmationDialog'
		>
			<div className='MergeAccountConfirmationDialog-Content'>
				<form
					className='send-email-verification-form'
					onSubmit={(evt) => {
						onConfirmAccountMerge(evt);
					}}
				>
					<Grid container direction='column'>
						<Grid item className='mt-5 title'>
							{account && library && user ? (
								<>
									<div className='break-word'>
										Account merge confirmation. This action
										can't be reverted!
									</div>
									<div className='mt-5 break-word'>
										You are about to merge account with
										address {account} into the account with
										email {user.email}
									</div>
								</>
							) : (
								<div className='break-word'>
									Account merge confirmation. Please make sure
									you are logged in and you are connected to a
									wallet
								</div>
							)}
						</Grid>
						<Grid item className='mt-4'>
							<ReCAPTCHA
								ref={recaptchaRef}
								className='recaptcha mt-4'
								sitekey={RECAPTCHA_SITE_KEY}
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
						<Grid item className='mt-5'>
							<OutlinedButton
								className='send'
								disabled={disableConfirm}
							>
								<span className='btn-text'>Confirm Merge</span>
							</OutlinedButton>
						</Grid>
					</Grid>
				</form>
			</div>
		</Modal>
	);
};

export default MergeAccountConfirmationDialog;
