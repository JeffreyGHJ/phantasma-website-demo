import './index.scss';

import { ImageTag } from '../../../../utils/ImageUtil';
import { Link } from 'react-router-dom';
import Loading from '../../Loading';
import NftImage from '../../Image/NftImage';
import NftOffer from '../../../../constants/types/NftOffer';
import OutlinedButton from '../../Button/OutlinedButton';
import { getNftDisplay } from '../../../../utils/funcs';
import { useTranslation } from 'react-i18next';

const marketplaceLogoSize = '40px';

const NftOfferCard = ({
	item,
	pathPrefix,
	onView,
}: {
	item: NftOffer;
	pathPrefix: string;
	onView: (offer: NftOffer) => void;
}) => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'widgets.NftOfferCard',
	});

	const { t: t_nft, ready: ready_nft } = useTranslation('translation', {
		keyPrefix: 'CollectionNames',
	});

	const handleOnViewClick = (
		evt: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		evt.preventDefault();
		onView(item);
	};

	return (
		<Link
			to={`${pathPrefix}/${item.wantedNftId}`}
			className='widget NftOfferCard'
		>
			<div className='nftOfferCard-header'>
				<div>
					<NftImage
						item={item.nftInfo}
						height='150px'
						width='150px'
					/>
				</div>
				<div>
					<ImageTag
						height={marketplaceLogoSize}
						width={marketplaceLogoSize}
						src={`${process.env.PUBLIC_URL}/logo192.png`}
					/>
					<div className='id mt-3'>
						<Loading loading={!ready_nft}>
							{t_nft(item.nftInfo.name, {
								defaultValue: item.nftInfo.name,
							})}{' '}
							#{item.wantedNftId}
						</Loading>
					</div>
					<div className='rank mb-3'>
						<Loading loading={!ready}>
							{t('rank', { defaultValue: 'Rank' })}:{' '}
							{item.nftInfo.rank}
						</Loading>
					</div>
				</div>
			</div>
			<div className='nftOfferCard-body'>
				<div className='offered-nft'>
					<Loading loading={!ready_nft}>
						{t_nft(getNftDisplay(item.soldNftAddress), {
							defaultValue: getNftDisplay(item.soldNftAddress),
						})}
						: {item.soldNftIds.map((x) => `#${x}`).join(', ')}
					</Loading>
				</div>
				<OutlinedButton onClick={handleOnViewClick}>
					<Loading loading={!ready}>
						{t('view', { defaultValue: 'View' })}
					</Loading>
				</OutlinedButton>
			</div>
		</Link>
	);
};

export default NftOfferCard;
