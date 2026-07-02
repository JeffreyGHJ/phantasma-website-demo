import './index.scss';

import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';

const AttributeAccordion = (props: AccordionProps) => {
	const { className, children, ...attributes } = props;
	return (
		<MuiAccordion
			className={`widget AttributeAccordion ${className || ''}`}
			{...attributes}
		>
			{children}
		</MuiAccordion>
	);
};

export default AttributeAccordion;
