import { useEffect, useState } from 'react';

import ScreenUtilModel from '..';

const useWindowSize = () => {
	const [windowSize, setWindowSize] = useState(
		ScreenUtilModel.getWindowSize()
	);

	useEffect(() => {
		const handleResize = () => {
			setWindowSize(ScreenUtilModel.getWindowSize());
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return windowSize;
};

export default useWindowSize;
