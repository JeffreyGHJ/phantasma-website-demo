import { FormControl, MenuItem, Select } from '@mui/material';

import Loading from '../../../widgets/Loading';
import { saleTypes } from '../../constants/saleTypes';
import { sortTypes } from '../../constants/sortTypes';
import { useTranslation } from 'react-i18next';

const SortTypeDropdown = ({
	sortType,
	handleSortTypeOnChange,
	isAuction,
	saleType,
	marketplaces,
}: {
	sortType: string;
	handleSortTypeOnChange: (evt: any) => void;
	isAuction: boolean;
	saleType: string;
	marketplaces?: Array<string>;
}) => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'widgets.SortTypeDropdown',
	});
	return (
		<div>
			<FormControl
				variant='outlined'
				style={{
					minWidth: '160px',
				}}
			>
				<Select value={sortType} onChange={handleSortTypeOnChange}>
					<MenuItem
						value={sortTypes.LOWEST_PRICE}
						className={
							isAuction ||
							saleType === saleTypes.ALL ||
							saleType === saleTypes.NOT_FOR_SALE
								? 'hide'
								: ''
						}
					>
						<Loading loading={!ready}>
							{t('lowest_price', {
								defaultValue: 'Lowest Price',
							})}
						</Loading>
					</MenuItem>
					<MenuItem
						value={sortTypes.HIGHEST_PRICE}
						className={
							isAuction ||
							saleType === saleTypes.ALL ||
							saleType === saleTypes.NOT_FOR_SALE
								? 'hide'
								: ''
						}
					>
						<Loading loading={!ready}>
							{t('highest_price', {
								defaultValue: 'Highest Price',
							})}
						</Loading>
					</MenuItem>
					<MenuItem
						value={sortTypes.LOWEST_BID}
						className={!isAuction ? 'hide' : ''}
					>
						<Loading loading={!ready}>
							{t('lowest_bid', {
								defaultValue: 'Lowest Bid',
							})}
						</Loading>
					</MenuItem>
					<MenuItem
						value={sortTypes.HIGHEST_BID}
						className={!isAuction ? 'hide' : ''}
					>
						<Loading loading={!ready}>
							{t('highest_bid', {
								defaultValue: 'Highest Bid',
							})}
						</Loading>
					</MenuItem>
					<MenuItem
						value={sortTypes.EXPIRE_DESC}
						className={!isAuction ? 'hide' : ''}
					>
						<Loading loading={!ready}>
							{t('expire_desc', {
								defaultValue: 'Expire (Desc)',
							})}
						</Loading>
					</MenuItem>
					<MenuItem
						value={sortTypes.EXPIRE_ASC}
						className={!isAuction ? 'hide' : ''}
					>
						<Loading loading={!ready}>
							{t('expire_asc', {
								defaultValue: 'Expire (Asc)',
							})}
						</Loading>
					</MenuItem>
					<MenuItem value={sortTypes.HIGHEST_ID}>
						<Loading loading={!ready}>
							{t('highest_id', {
								defaultValue: 'Higest ID',
							})}
						</Loading>
					</MenuItem>
					<MenuItem value={sortTypes.LOWEST_ID}>
						<Loading loading={!ready}>
							{t('lowest_id', {
								defaultValue: 'Lowest ID',
							})}
						</Loading>
					</MenuItem>
					<MenuItem value={sortTypes.LOWEST_RANK}>
						<Loading loading={!ready}>
							{t('lowest_rank', {
								defaultValue: 'Lowest Rank',
							})}
						</Loading>
					</MenuItem>
					<MenuItem value={sortTypes.HIGHEST_RANK}>
						<Loading loading={!ready}>
							{t('highest_rank', {
								defaultValue: 'Highest Rank',
							})}
						</Loading>
					</MenuItem>
					<MenuItem
						value={sortTypes.LATEST}
						className={!isAuction ? 'hide' : ''}
					>
						<Loading loading={!ready}>
							{t('latest', {
								defaultValue: 'Latest',
							})}
						</Loading>
					</MenuItem>
					<MenuItem
						value={sortTypes.LATEST}
						className={
							(isAuction || saleType === saleTypes.FOR_SALE) &&
							marketplaces &&
							marketplaces.length === 1
								? ''
								: 'hide'
						}
					>
						<Loading loading={!ready}>
							{t('latest', {
								defaultValue: 'Latest',
							})}
						</Loading>
					</MenuItem>
				</Select>
			</FormControl>
		</div>
	);
};

export default SortTypeDropdown;
