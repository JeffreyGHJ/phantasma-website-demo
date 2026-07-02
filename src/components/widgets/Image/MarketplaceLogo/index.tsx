import { DexImageTag, ImageTag } from '../../../../utils/ImageUtil';

import { blockchains } from '../../../../constants/Blockchains';
import { marketplaceTypes } from '../../../Marketplace/constants/marketplaceTypes';

export const MarketplaceLogo = ({
	marketplaceType,
	size,
}: {
	marketplaceType?: string;
	size?: string;
}) => {
	return marketplaceType === marketplaceTypes.LG_MARKETPLACE ? (
		<ImageTag
			height='auto'
			width={size || '22px'}
			src={`${process.env.PUBLIC_URL}/logo192.png`}
			alt='LittleGhosts Markerplace'
		/>
	) : marketplaceType === marketplaceTypes.PANCAKESWAP ? (
		<DexImageTag
			chainID={blockchains.BSC}
			height='auto'
			width={size || '22px'}
			alt='Pancakeswap Marketplace'
		/>
	) : (
		<></>
	);
};
