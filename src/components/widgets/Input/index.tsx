import './index.scss';

import { HTMLProps } from 'react';

const Input = (props: HTMLProps<HTMLInputElement>) => {
	const { className, ...attributes } = props;
	return (
		<input className={`widget Input ${className || ''}`} {...attributes} />
	);
};

export default Input;
