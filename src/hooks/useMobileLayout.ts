import { Theme, useMediaQuery } from '@mui/material';

import { bootstrapBreakPoints } from '../constants/styles/constants';

const useMobileLayout = () => {
	const mobileLayout = useMediaQuery((theme: Theme) =>
		theme.breakpoints.down(bootstrapBreakPoints.md)
	);

	return mobileLayout;
};

export default useMobileLayout;
