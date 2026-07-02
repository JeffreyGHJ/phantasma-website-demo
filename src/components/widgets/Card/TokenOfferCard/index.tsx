import './index.scss';

import {
	getPaymentTokenDecimals,
	getPaymentTokenDisplay,
	getTokenPriceInUsd,
} from '../../../../utils/funcs';
import {
	useBnbPriceInUsd,
	useEctoPriceInUsd,
} from '../../../../state/application/hooks';

import { ImageTag } from '../../../../utils/ImageUtil';
import { Link } from 'react-router-dom';
import Loading from '../../Loading';
import NftImage from '../../Image/NftImage';
import OutlinedButton from '../../Button/OutlinedButton';
import TokenOffer from '../../../../constants/types/TokenOffer';
import { ectoContractAddress } from '../../../../constants/ContractAddresses';
import { fromSolidityTokenFormat } from '../../../../utils/MathUtil';
import { getHumanReadableLargeNumber } from '../../../../utils/NumberUtil';
import { isString } from 'lodash';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const marketplaceLogoSize = '40px';

const TokenOfferCard = ({
	item,
	pathPrefix,
	onView,
}: {
	item: TokenOffer;
	pathPrefix: string;
	onView: (offer: TokenOffer) => void;
}) => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'widgets.TokenOfferCard',
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
			to={`${pathPrefix}/${item.nftId}`}
			className='widget TokenOfferCard'
		>
			<div className='tokenOfferCard-header'>
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
							#{item.nftId}
						</Loading>
					</div>
					<div className='rank mb-3'>
						<Loading loading={!ready}>
							{t('rank', { defaultValue: 'Rank' })}:{' '}
							{item.nftInfo.rank}
						</Loading>
					</div>
					<TokenOfferCardPriceContent item={item} />
				</div>
			</div>
			<div className='tokenOfferCard-body'>
				<OutlinedButton onClick={handleOnViewClick}>
					<Loading loading={!ready}>
						{t('view', { defaultValue: 'View' })}
					</Loading>
				</OutlinedButton>
			</div>
		</Link>
	);
};

const TokenOfferCardPriceContent = ({ item }: { item: TokenOffer }) => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'widgets.TokenOfferCard',
	});

	const bnbPrice = useBnbPriceInUsd();
	const ectoPrice = useEctoPriceInUsd();

	const Footer = useMemo(() => {
		const paymentTokenDisplay = getPaymentTokenDisplay(
			item.tokenAddress || ''
		);

		const paymentTokenDecimals = getPaymentTokenDecimals(
			item.tokenAddress || ''
		);

		let paymentAmount =
			item.tokenAddress.toLowerCase() === ectoContractAddress
				? getHumanReadableLargeNumber({
						number: +fromSolidityTokenFormat(
							item.price || '',
							paymentTokenDecimals
						),
						precision: 0,
				  })
				: (+fromSolidityTokenFormat(
						item.price || '',
						paymentTokenDecimals
				  )).toLocaleString();

		if (!isString(paymentAmount)) {
			paymentAmount = `${paymentAmount.number}${paymentAmount.unit} `;
		}

		return (
			<div className='offer'>
				<div className='offer-wrapper'>
					<div className='offer-label'>
						<Loading loading={!ready}>
							{t('offer', { defaultValue: 'Offer' })}:
						</Loading>
					</div>
					<div className='offer-value'>
						<span>
							{paymentAmount} {paymentTokenDisplay}
						</span>
						<span className='usd'>
							($
							{getTokenPriceInUsd({
								address: item.tokenAddress,
								amount: item.price,
								ectoPrice,
								bnbPrice,
							})}
							)
						</span>
					</div>
				</div>
			</div>
		);
	}, [item, bnbPrice, ectoPrice, t, ready]);

	return <div>{Footer}</div>;
};

export default TokenOfferCard;
