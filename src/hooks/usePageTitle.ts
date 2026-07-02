import { useEffect } from 'react';

const usePageTitle = (title: string) => {
	useEffect(() => {
		document.title = title;

		return () => {
			document.title = 'Phantasma';
		};
	}, [title]);
};

export default usePageTitle;
