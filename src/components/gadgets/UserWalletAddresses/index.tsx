import './index.scss';

import { useCallback, useRef, useState } from 'react';
import { useUpdateOverlay, useUser } from '../../../state/application/hooks';

import AccountModel from '../../../models/AccountModel';
import EditIcon from '@mui/icons-material/Edit';
import HoverTooltip from '../../widgets/Tooltip/HoverTooltip';
import IconButton from '../../widgets/Button/IconButton/IconButton';
import MergeAccountConfirmationDialog from '../../shared/MergeAccountConfirmationDialog';
import OutlinedButton from '../../widgets/Button/OutlinedButton';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import WebErrorResponse from '../../../constants/types/WebErrorResponse';
import authErrorReasons from '../../../constants/errorReasons/authErrorReasons';
import { displayAddress } from '../../../utils/StringUtil';
import { useActiveWeb3React } from '../../../hooks';
import { useHandleUnauthorizedResponse } from '../../../hooks/useAuth';
import { useSnackbar } from 'notistack';
import { useUpdateUserAddresses } from '../../../state/application/hooks/user';

const UserWalletAddresses = ({
	recaptchaToken,
	canSubmitRecaptcha,
	recaptchaSuccess,
	recaptchaError,
}) => {
	const updateOverlay = useUpdateOverlay();
	const [mode, setMode] = useState<'view' | 'edit'>('view');
	const { account, library } = useActiveWeb3React();
	const user = useUser();
	const updateUserWalletAddresses = useUpdateUserAddresses();

	const handleOnEdit = () => {
		setMode(mode === 'edit' ? 'view' : 'edit');
	};

	const { enqueueSnackbar } = useSnackbar();
	const handleUnauthorizedResponse = useHandleUnauthorizedResponse();

	const [
		mergeAccountConfirmationDialogOpen,
		setMergeAccountConfirmationDialogOpen,
	] = useState(false);

	const bindAddress = useCallback(async () => {
		if (!library || !account) {
			return;
		}

		if (!canSubmitRecaptcha()) return;

		const signer = library.getSigner();
		const signature = await signer.signMessage(
			`Bind ${account.toLowerCase()}\n\n`
		);

		if (!signature) {
			enqueueSnackbar('No signature was provided', {
				variant: 'error',
			});
		}

		updateOverlay(true);
		AccountModel.bindWalletAddress({
			walletAddress: account,
			recaptcha: recaptchaToken,
			signature,
		})
			.then((walletAddresses) => {
				updateUserWalletAddresses(walletAddresses);
				updateOverlay(false);
				enqueueSnackbar('Address binded successfully', {
					variant: 'success',
				});
				recaptchaSuccess();
			})
			.catch((error) => {
				if (error.response) {
					const errorResponse = error.response
						.data as WebErrorResponse;
					if (
						errorResponse.errReason &&
						errorResponse.errReason ===
							authErrorReasons.BIND_BY_MERGE
					) {
						// Handle bind by merge
						setMergeAccountConfirmationDialogOpen(true);
						recaptchaSuccess();
					} else {
						enqueueSnackbar(
							errorResponse.errMsg || 'Unknown error',
							{
								variant: 'error',
							}
						);
						recaptchaError();
					}
					if (error.response.status === 401) {
						handleUnauthorizedResponse();
					}
				} else {
					console.log(error);
					enqueueSnackbar('Unknown error', {
						variant: 'error',
					});
					recaptchaError();
				}
				updateOverlay(false);
			});
	}, [
		library,
		account,
		enqueueSnackbar,
		recaptchaToken,
		handleUnauthorizedResponse,
		updateOverlay,
		updateUserWalletAddresses,
	]);

	const unbindAddress = useCallback(
		async (address: string) => {
			if (!canSubmitRecaptcha()) return;

			updateOverlay(true);
			AccountModel.unbindWalletAddress({
				walletAddress: address,
				recaptcha: recaptchaToken,
			})
				.then((walletAddresses) => {
					updateUserWalletAddresses(walletAddresses);
					updateOverlay(false);
					enqueueSnackbar('Address unbinded successfully', {
						variant: 'success',
					});
					recaptchaSuccess();
				})
				.catch((error) => {
					if (error.response) {
						const errorResponse = error.response
							.data as WebErrorResponse;

						enqueueSnackbar(
							errorResponse.errMsg || 'Unknown error',
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
					recaptchaError();
				});
		},
		[
			enqueueSnackbar,
			recaptchaToken,
			handleUnauthorizedResponse,
			updateOverlay,
			updateUserWalletAddresses,
		]
	);

	return (
		<div
			className={`gadget UserWalletAddresses ${mode} d-flex align-items-center flex-wrap gap-2 ${
				mode === 'edit' ? 'flex-column' : ''
			} ${user?.wallet_addresses.length === 0 ? 'empty' : ''}`}
		>
			{!!user?.wallet_addresses.length && (
				<div className="UserWalletAddresses--address-box scrollbar pe-3">
					{user?.wallet_addresses.map((wallet_address, index) => {
						return (
							<div
								className="d-flex align-items-center flex-wrap gap-2 justify-content-between UserWalletAddresses--address-box--item"
								key={wallet_address.wallet_address}
							>
								<div className="UserWalletAddresses--address">
									<HoverTooltip
										tooltip={wallet_address.wallet_address}
									>
										<div className="d-flex align-items-center flex-wrap gap-2">
											<div>{index + 1}.</div>
											<div>
												{displayAddress(
													wallet_address.wallet_address,
													4,
													4
												)}
											</div>
										</div>
									</HoverTooltip>
								</div>
								{mode === 'edit' && (
									<div>
										<IconButton
											onClick={() => {
												unbindAddress(
													wallet_address.wallet_address
												);
											}}
										>
											<RemoveCircleIcon />
										</IconButton>
									</div>
								)}
							</div>
						);
					})}
				</div>
			)}
			<div
				className={`cta ${mode === 'edit' ? 'mt-2 pt-2' : ''} ${
					user?.wallet_addresses.length === 0 && mode === 'edit'
						? 'mb-2 pb-2'
						: ''
				}`}
			>
				{mode === 'edit' ? (
					<div className="d-flex align-items-center gap-4 flex-wrap">
						<OutlinedButton
							className="flex-auto"
							disabled={!library || !account || (user && user?.wallet_addresses.length > 0)}
							// disabled={!library || !account || !user}
							onClick={bindAddress}
						>
							Add
						</OutlinedButton>
						<OutlinedButton
							className="flex-auto"
							onClick={handleOnEdit}
						>
							Cancel
						</OutlinedButton>
					</div>
				) : (
					<IconButton onClick={handleOnEdit}>
						<EditIcon />
					</IconButton>
				)}
			</div>
			<MergeAccountConfirmationDialog
				open={mergeAccountConfirmationDialogOpen}
				onClose={() => {
					setMergeAccountConfirmationDialogOpen(false);
				}}
			/>
		</div>
	);
};

export default UserWalletAddresses;
