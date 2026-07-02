import { FormControl, MenuItem, Select } from '@mui/material';

import Loading from '../../../widgets/Loading';
import { saleTypes } from '../../constants/saleTypes';
import { useTranslation } from 'react-i18next';

const SaleTypeDropdown = ({
	saleType,
	handleSaleTypeOnChange,
}: {
	saleType: string;
	handleSaleTypeOnChange: (evt: any) => void;
}) => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'widgets.SaleTypeDropdown',
	});

	return (
		<div className='SaleTypeDropdown'>
			<FormControl
				variant='outlined'
				style={{
					minWidth: '150px',
				}}
			>
				<Select value={saleType} onChange={handleSaleTypeOnChange}>
					<MenuItem value={saleTypes.ALL}>
						<Loading loading={!ready}>
							{t('all', { defaultValue: 'All' })}
						</Loading>
					</MenuItem>
					<MenuItem value={saleTypes.FOR_SALE}>
						<Loading loading={!ready}>
							{t('for_sale', { defaultValue: 'For Sale' })}
						</Loading>
					</MenuItem>
					<MenuItem value={saleTypes.NOT_FOR_SALE}>
						<Loading loading={!ready}>
							{t('not_for_sale', {
								defaultValue: 'Not For Sale',
							})}
						</Loading>
					</MenuItem>
					<MenuItem value={saleTypes.AUCTION}>
						<Loading loading={!ready}>
							{t('auction', {
								defaultValue: 'Auction',
							})}
						</Loading>
					</MenuItem>
				</Select>
			</FormControl>
		</div>
	);
};

export default SaleTypeDropdown;
