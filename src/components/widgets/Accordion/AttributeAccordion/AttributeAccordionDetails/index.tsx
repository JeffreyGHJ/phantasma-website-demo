import './index.scss';

import MuiAccordionDetails from '@mui/material/AccordionDetails';

const AttributeAccordionDetails = (props: any) => {
	const { className, children, ...attributes } = props;
	return (
		<MuiAccordionDetails
			className={`widget AttributeAccordionDetails ${className || ''}`}
			{...attributes}
		>
			{children}
		</MuiAccordionDetails>
	);
};

export default AttributeAccordionDetails;
