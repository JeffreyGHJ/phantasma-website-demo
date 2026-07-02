import './index.scss';

import DeleteSweepRoundedIcon from '@mui/icons-material/DeleteSweepRounded';
import IconButton from '../../../../Button/IconButton/IconButton';
import Loading from '../../../../Loading';
import { useTranslation } from 'react-i18next';

const FilterHeader = ({
	handleClearFilter,
}: {
	handleClearFilter: () => void;
}) => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'FilterSidebar',
	});

	return (
		<div className='FilterHeader'>
			<div className='left'>
				<Loading loading={!ready}>
					{t('filters', { defaultValue: 'Filters' })}
				</Loading>
			</div>
			<div>
				<IconButton
					onClick={() => {
						handleClearFilter();
					}}
				>
					<DeleteSweepRoundedIcon fontSize='large' />
				</IconButton>
			</div>
		</div>
	);
};

export default FilterHeader;
