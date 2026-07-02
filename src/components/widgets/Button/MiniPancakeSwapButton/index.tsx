import './index.scss';

import { DexImageTag } from '../../../../utils/ImageUtil';
import PropTypes from 'prop-types';
import { blockchains } from '../../../../constants/Blockchains';

const MiniPancakeSwapButton = (props) => {
	const { children, className, ...attributes } = props;
	return (
		<span
			className={`widget MiniPancakeSwapButton round inline-flex ${
				className || ''
			}`}
			{...attributes}
		>
			<DexImageTag
				chainID={blockchains.BSC}
				height={'25px'}
				width={'25px'}
			/>
		</span>
	);
};

MiniPancakeSwapButton.propTypes = {
	id: PropTypes.string,
	href: PropTypes.string,
	className: PropTypes.string,
};

export default MiniPancakeSwapButton;
