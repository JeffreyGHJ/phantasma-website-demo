import {
	FormControl,
	MenuItem,
	Select,
	SelectChangeEvent,
} from '@mui/material';

import Token from '../../../../constants/types/Token';
import { paymentTokens } from '../../../../constants/constant';

const PaymentTokenSelect = ({
	paymentToken,
	setPaymentToken,
	disabled = false,
}: {
	paymentToken: Token;
	setPaymentToken?: React.Dispatch<React.SetStateAction<Token>>;
	disabled?: boolean;
}) => {
	const handlePaymentTokenOnChange = (evt: SelectChangeEvent<string>) => {
		const _token = paymentTokens.find(
			(x) => x.tokenAddress === evt.target.value
		);

		if (_token && setPaymentToken) {
			setPaymentToken(_token);
		}
	};
	return (
		<FormControl
			variant='outlined'
			style={{
				minWidth: '150px',
			}}
		>
			<Select
				value={paymentToken.tokenAddress}
				onChange={handlePaymentTokenOnChange}
				disabled={disabled}
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

export default PaymentTokenSelect;
