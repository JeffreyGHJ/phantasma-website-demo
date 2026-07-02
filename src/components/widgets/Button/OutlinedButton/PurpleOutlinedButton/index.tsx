import './index.scss';

import {
	AnchorHTMLAttributes,
	ButtonHTMLAttributes,
	HTMLAttributes,
	MouseEventHandler,
	ReactNode,
} from 'react';

import ExternalLink from '../../../ExternalLink/ExternalLink';
import InternalLink from '../../../InternalLink';
import OutlinedButtonType from '../types/OutlinedButtonType';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material';

const PurpleOutlinedButton = ({
	className = '',
	children,
	to,
	href,
	btnType,
	Icon,
	onClick,
	...attributes
}: {
	className?: string;
	children: ReactNode;
	to?: string;
	href?: string;
	btnType?: OutlinedButtonType;
	Icon?: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
		muiName: string;
	};
	onClick?: MouseEventHandler<
		HTMLButtonElement | HTMLAnchorElement | HTMLSpanElement
	>;
	attributes?:
		| ButtonHTMLAttributes<HTMLButtonElement>
		| AnchorHTMLAttributes<HTMLAnchorElement>
		| HTMLAttributes<HTMLSpanElement>;
}) => {
	if (!btnType || btnType === 'button') {
		return (
			<button
				className={`widget PurpleOutlinedButton ${className}`}
				onClick={onClick}
				{...attributes}
			>
				{Icon ? (
					<div className='d-flex flex-wrap gap-2 align-items-center'>
						<div>{children}</div>
						<div>
							<Icon />
						</div>
					</div>
				) : (
					children
				)}
			</button>
		);
	}

	if (to && btnType === 'link') {
		return (
			<InternalLink
				className={`widget PurpleOutlinedButton ${className}`}
				to={to}
				{...attributes}
			>
				{Icon ? (
					<div className='d-flex flex-wrap gap-2 align-items-center'>
						<div>{children}</div>
						<div>
							<Icon />
						</div>
					</div>
				) : (
					children
				)}
			</InternalLink>
		);
	}

	if (href && btnType === 'link') {
		return (
			<ExternalLink
				className={`widget PurpleOutlinedButton ${className}`}
				href={href}
				{...(attributes as AnchorHTMLAttributes<HTMLAnchorElement>)}
			>
				{Icon ? (
					<div className='flex flex-wrap gap-2 items-center'>
						<div>{children}</div>
						<div>
							<Icon />
						</div>
					</div>
				) : (
					children
				)}
			</ExternalLink>
		);
	}

	return (
		<button
			className={`widget PurpleOutlinedButton ${className}`}
			onClick={onClick}
			{...attributes}
		>
			{Icon ? (
				<div className='d-flex flex-wrap gap-2 align-items-center'>
					<div>{children}</div>
					<div>
						<Icon />
					</div>
				</div>
			) : (
				children
			)}
		</button>
	);
};

export default PurpleOutlinedButton;
