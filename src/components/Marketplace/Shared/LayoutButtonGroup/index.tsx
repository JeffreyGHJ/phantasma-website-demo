import './index.scss';

import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import OutlinedSquareIconButton from '../../../widgets/Button/IconButton/OutlinedSquareIconButton';
import { viewTypes } from '../../constants/viewTypes';

const LayoutButtonGroup = ({
	handleViewTypeChange,
	viewType,
}: {
	handleViewTypeChange: (evt: any) => void;
	viewType: string;
}) => {
	return (
		<div className='LayoutButtonGroup'>
			<OutlinedSquareIconButton
				onClick={() => {
					handleViewTypeChange(viewTypes.GRID_VIEW);
				}}
				className={`grid-view-btn ${
					viewType === viewTypes.GRID_VIEW ? 'selected' : ''
				}`}
			>
				<GridViewRoundedIcon />
			</OutlinedSquareIconButton>
			<OutlinedSquareIconButton
				className={`list-view-btn ${
					viewType === viewTypes.LIST_VIEW ? 'selected' : ''
				}`}
				onClick={() => {
					handleViewTypeChange(viewTypes.LIST_VIEW);
				}}
			>
				<FormatListBulletedRoundedIcon />
			</OutlinedSquareIconButton>
		</div>
	);
};

export default LayoutButtonGroup;
