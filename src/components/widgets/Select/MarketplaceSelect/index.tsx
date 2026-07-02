import { DexImageTag, ImageTag } from '../../../../utils/ImageUtil';
import {
	FormControl,
	MenuItem,
	Select,
	SelectChangeEvent,
} from '@mui/material';

import Loading from '../../Loading';
import MarketplaceSelectValue from './types/MarketplaceSelectValue';
import { blockchains } from '../../../../constants/Blockchains';
import { useTranslation } from 'react-i18next';

const MarketplaceSelect = ({
	value,
	onChange,
}: {
	value: MarketplaceSelectValue;
	onChange: (event: SelectChangeEvent<MarketplaceSelectValue>) => void;
}) => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'widgets.MarketplaceSelect',
	});

	return (
		<div className='widget MarketplaceSelect'>
			<FormControl
				variant='outlined'
				style={{
					minWidth: '160px',
				}}
			>
				<Select value={value} onChange={onChange}>
					<MenuItem value='all'>
						<div>
							<Loading loading={!ready}>
								<span className='label ms-2'>
									{t('all', {
										defaultValue: 'All',
									})}
								</span>
							</Loading>
						</div>
					</MenuItem>
					<MenuItem value='littleghosts'>
						<div>
							<Loading loading={!ready}>
								<ImageTag
									height='22px'
									width='22px'
									src={`${process.env.PUBLIC_URL}/logo192.png`}
									alt='Phantasma Marketplace'
								/>

								<span className='label ms-2'>
									{t('littleghosts', {
										defaultValue: 'LittleGhosts',
									})}
								</span>
							</Loading>
						</div>
					</MenuItem>
					<MenuItem value='pancakeswap'>
						<div>
							<Loading loading={!ready} width='120px'>
								<DexImageTag
									chainID={blockchains.BSC}
									height={'22px'}
									width={'22px'}
									alt='pancakeswap'
								/>

								<span className='label ms-2'>
									{t('pancakeswap', {
										defaultValue: 'PancakeSwap',
									})}
								</span>
							</Loading>
						</div>
					</MenuItem>
				</Select>
			</FormControl>
		</div>
	);
};

export default MarketplaceSelect;
