import InternalLink from '../../InternalLink';
import { MarketplaceLogo } from '../MarketplaceLogo';
import MarketplaceNftUri from '../../../../models/util_models/MarketplaceUtilModel/types/MarketplaceNftUri';
import MarketplaceType from '../../../../models/util_models/MarketplaceUtilModel/types/MarketplaceType';
import MarketplaceUtilModel from '../../../../models/util_models/MarketplaceUtilModel';
import RouteUtilModel from '../../../../models/util_models/RouteUtilModel';
import { useMemo } from 'react';

export const MarketplaceLogoInternalLink = ({
	marketplaceType,
	size,
	nftUri,
}: {
	marketplaceType: MarketplaceType;
	size?: string;
	nftUri: MarketplaceNftUri;
}) => {
	const linkTo = useMemo(() => {
		return `${RouteUtilModel.ROUTES.MARKETPLACE.get()}/${nftUri}?${
			MarketplaceUtilModel.MARKETPLACE_FILTER_KEY
		}=${marketplaceType}`;
	}, [marketplaceType, nftUri]);

	return (
		<InternalLink to={linkTo}>
			<MarketplaceLogo marketplaceType={marketplaceType} size={size} />
		</InternalLink>
	);
};
