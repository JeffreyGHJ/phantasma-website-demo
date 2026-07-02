import './index.scss';

import { Dialog as MuiDialog } from '@mui/material';

const Dialog = (props) => {
	const { open, onClose, className, children, ...attributes } = props;
	return (
		<MuiDialog
			className={`widget Dialog ${className || ''}`}
			open={open}
			onClose={onClose}
			style={{ textAlign: 'center' }}
			{...attributes}
		>
			{children}
		</MuiDialog>
	);
};

export default Dialog;
