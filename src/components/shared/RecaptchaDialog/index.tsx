import './index.scss';

import { Dispatch, SetStateAction } from 'react';

import Modal from '../../widgets/Modal';
import { RECAPTCHA_ENABLED, RECAPTCHA_SITE_KEY } from '../../../constants/recaptchaSiteKeys';
import ReCAPTCHA from 'react-google-recaptcha';

const RecaptchaDialog = ({
	setRecaptcha,
	open,
	onClose,
}: {
	setRecaptcha: Dispatch<SetStateAction<string>>;
	open: boolean;
	onClose: () => void;
}) => {
	return (
		<Modal open={open} onClose={onClose} className='RecaptchaDialog'>
			<div className='RecaptchaDialog-Content'>
				{RECAPTCHA_ENABLED && (
					<ReCAPTCHA
						className='recaptcha'
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
				)}
			</div>
		</Modal>
	);
};

export default RecaptchaDialog;
