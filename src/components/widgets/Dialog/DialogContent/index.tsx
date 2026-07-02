import './index.scss';

import { DialogContent as MuiDialogContent } from '@mui/material';

const DialogContent = (props) => {
	const { className, children, ...attributes } = props;
	return (
		<MuiDialogContent
			className={`widget DialogContent py-4 ${className || ''}`}
			style={{
				minWidth: '300px',
				backgroundColor: '#34343c',
			}}
			{...attributes}
		>
			{children}
		</MuiDialogContent>
	);
};

export default DialogContent;
