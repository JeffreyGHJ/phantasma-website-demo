import './index.scss';

import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded';
import Loading from '../../../widgets/Loading';
import OutlinedButton from '../../../widgets/Button/OutlinedButton';
import { useTranslation } from 'react-i18next';

const FilterButton = ({
	setShowFilterSidebar,
}: {
	setShowFilterSidebar: (value: React.SetStateAction<boolean>) => void;
}) => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'widgets.FilterButton',
	});

	return (
		<OutlinedButton
			onClick={() => {
				setShowFilterSidebar(true);
			}}
		>
			<FilterAltRoundedIcon fontSize='large' />
			<span className='label'>
				<Loading loading={!ready}>
					{t('filter', { defaultValue: 'Filter' })}
				</Loading>
			</span>
		</OutlinedButton>
	);
};

export default FilterButton;
