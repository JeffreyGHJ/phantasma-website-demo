import './index.scss';

import { Slider, Stack } from '@mui/material';
import {
	usePreferredNftImageSize,
	useUpdatePreferredNftImageSize,
} from '../../../../state/application/hooks';

export const NftImageSizeSlider = () => {
	const preferredNftImageSize = usePreferredNftImageSize();
	const updatePreferredNftImageSize = useUpdatePreferredNftImageSize();

	return (
		<Stack spacing={2} direction='row' sx={{ mb: 1 }} alignItems='center'>
			<span className='slider-label'>200px</span>
			<Slider
				value={preferredNftImageSize}
				onChange={(evt, newValue) => {
					updatePreferredNftImageSize(+newValue);
				}}
				min={200}
				max={250}
				valueLabelDisplay='auto'
			/>
			<span className='slider-label'>250px</span>
		</Stack>
	);
};
