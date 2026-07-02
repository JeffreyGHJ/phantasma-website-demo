import './index.scss';

import { AnchorHTMLAttributes, MouseEventHandler, ReactNode } from 'react';

import ExternalLink from '../../../ExternalLink/ExternalLink';
import { FilledButtonType } from '../types';
import InternalLink from '../../../InternalLink';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import PropTypes from 'prop-types';
import { SvgIconTypeMap } from '@mui/material';

const PurpleFilledButton = ({
	className,
	children,
	to,
	href,
	btnType,
	onClick,
	Icon,
	...attributes
}: {
	to?: string;
	href?: string;
	btnType?: FilledButtonType;
	onClick?: MouseEventHandler<
		HTMLButtonElement | HTMLAnchorElement | HTMLSpanElement
	>;
	className?: string;
	children: ReactNode;
	Icon?: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
		muiName: string;
	};
}) => {
	if (!btnType || btnType === 'button') {
		return (
			<button
				className={`widget PurpleFilledButton`}
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
				className={`widget PurpleFilledButton`}
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
				className={`widget PurpleFilledButton`}
				href={href}
				{...(attributes as AnchorHTMLAttributes<HTMLAnchorElement>)}
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
			</ExternalLink>
		);
	}

	return (
		<button
			className={`widget PurpleFilledButton`}
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

PurpleFilledButton.propTypes = {
	disabled: PropTypes.bool,
};

export default PurpleFilledButton;
