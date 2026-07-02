import {
	FormControl,
	MenuItem,
	Select,
	SelectChangeEvent,
} from '@mui/material';

import { ImageTag } from '../../../../utils/ImageUtil';
import Loading from '../../Loading';
import NftSelectValue from './types/NftSelectValue';
import { useTranslation } from 'react-i18next';

const NftSelect = ({
	value,
	onChange,
}: {
	value: NftSelectValue;
	onChange: (event: SelectChangeEvent<NftSelectValue>) => void;
}) => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'widgets.NftSelect',
	});

	return (
		<div className='widget NftSelect'>
			<FormControl
				variant='outlined'
				style={{
					minWidth: '160px',
				}}
			>
				<Select value={value} onChange={onChange}>
					<MenuItem value='ghost'>
						<div className='tab'>
							<ImageTag
								src={`${process.env.PUBLIC_URL}/assets/images/icons/Ghosts.png`}
								height='auto'
								width='22px'
								alt='ghosts'
							/>
							<Loading loading={!ready}>
								<span className='label ms-2'>
									{t('ghosts', { defaultValue: 'Ghosts' })}
								</span>
							</Loading>
						</div>
					</MenuItem>
					<MenuItem value='skeleton'>
						<div className='tab'>
							<ImageTag
								src={`${process.env.PUBLIC_URL}/assets/images/icons/Ectoskeletons.png`}
								height='auto'
								width='22px'
								alt='skeleton'
							/>
							<Loading loading={!ready}>
								<span className='label ms-2'>
									{t('skeletons', {
										defaultValue: 'Skeletons',
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

export default NftSelect;
