import './index.scss';

import { Box, Modal as MuiModal } from '@mui/material';

import { forwardRef } from 'react';

const Modal = forwardRef(
	(
		{
			open,
			onClose,
			className,
			children,
			style,
			...attributes
		}: {
			open: boolean;
			children: React.ReactNode;
			style?: any;
			onClose: () => void;
			className?: string;
		},
		ref: any
	) => {
		return (
			<MuiModal
				open={open}
				onClose={onClose}
				style={style}
				{...attributes}
			>
				<Box
					component='div'
					className={`widget Modal scrollbar ${className || ''}`}
					ref={ref}
				>
					{children}
				</Box>
			</MuiModal>
		);
	}
);

export default Modal;
