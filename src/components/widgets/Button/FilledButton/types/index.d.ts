import {
	AnchorHTMLAttributes,
	ButtonHTMLAttributes,
	HTMLAttributes,
	ReactNode,
} from 'react';

import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material';

export type FilledButtonType = 'button' | 'link' | 'span';

export type FilledButtonSize = 'mini' | 'small' | 'medium' | 'large' | 'xl';

export type FilledButtonColor = 'primary' | 'secondary';

export type FilledButtonProps = {
	className?: string;
	children?: ReactNode;
	color?: FilledButtonColor;
	to?: string;
	href?: string;
	btnType?: FilledButtonType;
	size?: FilledButtonSize;
	Icon?: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
		muiName: string;
	};
	attributes?:
		| ButtonHTMLAttributes<HTMLButtonElement>
		| AnchorHTMLAttributes<HTMLAnchorElement>
		| HTMLAttributes<HTMLSpanElement>;
};
