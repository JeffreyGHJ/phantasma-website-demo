import './index.scss';

import { ReactNode, useState } from 'react';

import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

const HoverTooltip = ({
	className,
	tooltip,
	children,
	anchorOriginVertical = 'top',
	anchorOriginHorizontal = 'left',
	transformOriginVertical = 'bottom',
	transformOriginHorizontal = 'left',
	...attributes
}: {
	className?: string;
	tooltip: string;
	children: ReactNode;
	anchorOriginVertical?: 'top' | 'center' | 'bottom' | number;
	anchorOriginHorizontal?: number | 'center' | 'left' | 'right';
	transformOriginVertical?: 'top' | 'center' | 'bottom' | number;
	transformOriginHorizontal?: number | 'center' | 'left' | 'right';
}) => {
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

	const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handlePopoverClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);

	return (
		<div className='widget HoverTooltip' {...attributes}>
			<div
				className='element-wrapper'
				onMouseEnter={handlePopoverOpen}
				onMouseLeave={handlePopoverClose}
			>
				{children}
			</div>
			<Popover
				id='HoverTooltip'
				sx={{
					pointerEvents: 'none',
				}}
				open={open}
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: anchorOriginVertical,
					horizontal: anchorOriginHorizontal,
				}}
				transformOrigin={{
					vertical: transformOriginVertical,
					horizontal: transformOriginHorizontal,
				}}
				onClose={handlePopoverClose}
				disableRestoreFocus
			>
				<Typography
					sx={{ p: 1, fontSize: '12px' }}
					className='break-word'
					style={{ maxWidth: '300px' }}
				>
					{tooltip}
				</Typography>
			</Popover>
		</div>
	);
};

export default HoverTooltip;
