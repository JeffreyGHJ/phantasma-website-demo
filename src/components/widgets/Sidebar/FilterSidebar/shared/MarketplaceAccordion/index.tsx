import { DexImageTag, ImageTag } from '../../../../../../utils/ImageUtil';

import AttributeAccordion from '../../../../Accordion/AttributeAccordion';
import AttributeAccordionDetails from '../../../../Accordion/AttributeAccordion/AttributeAccordionDetails';
import AttributeAccordionSummary from '../../../../Accordion/AttributeAccordion/AttributeAccordionSummary';
import Checkbox from '../../../../Checkbox/Checkbox';
import Loading from '../../../../Loading';
import { blockchains } from '../../../../../../constants/Blockchains';
import { marketplaceTypes } from '../../../../../Marketplace/constants/marketplaceTypes';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const MarketplaceAccordion = ({
	marketplaces,
	handleMarketplaceChange,
	showPancakeswapMarketplace,
}: {
	marketplaces: string[];
	handleMarketplaceChange: (_marketplace: string) => void;
	showPancakeswapMarketplace: boolean;
}) => {
	const [marketplaceExpanded, setMarketplaceExpaned] = useState(true);

	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'FilterSidebar',
	});

	return (
		<AttributeAccordion
			expanded={marketplaceExpanded}
			onChange={() => {
				setMarketplaceExpaned(!marketplaceExpanded);
			}}
		>
			<AttributeAccordionSummary>
				<div className='label'>
					<Loading loading={!ready}>
						{t('marketplaceDropdown.label', {
							defaultValue: 'Marketplace',
						})}
					</Loading>
				</div>
			</AttributeAccordionSummary>
			<AttributeAccordionDetails>
				<div className='ms-3 me-3'>
					<div className='littleghost-mp'>
						<Checkbox
							checked={marketplaces.includes(
								marketplaceTypes.LG_MARKETPLACE
							)}
							onChange={() => {
								handleMarketplaceChange(
									marketplaceTypes.LG_MARKETPLACE
								);
							}}
							label={
								<div className='label d-flex align-items-center'>
									<ImageTag
										height='25px'
										width='25px'
										src={`${process.env.PUBLIC_URL}/logo192.png`}
									/>
									<span className='ms-1'>
										<Loading loading={!ready}>
											{t(
												'marketplaceDropdown.selections.lg',
												{
													defaultValue:
														'LittleGhosts',
												}
											)}
										</Loading>
									</span>
								</div>
							}
						/>
					</div>
					{showPancakeswapMarketplace && (
						<div className='pancakeswap-mp mt-4'>
							<Checkbox
								checked={marketplaces.includes(
									marketplaceTypes.PANCAKESWAP
								)}
								onChange={() => {
									handleMarketplaceChange(
										marketplaceTypes.PANCAKESWAP
									);
								}}
								label={
									<div className='d-flex align-items-center'>
										<DexImageTag
											chainID={blockchains.BSC}
											height={'25px'}
											width={'25px'}
										/>
										<div className='ms-1'>
											<Loading loading={!ready}>
												{t(
													'marketplaceDropdown.selections.pancakeSwap',
													{
														defaultValue:
															'PancakeSwap',
													}
												)}
											</Loading>
										</div>
									</div>
								}
							/>
						</div>
					)}
				</div>
			</AttributeAccordionDetails>
		</AttributeAccordion>
	);
};

export default MarketplaceAccordion;
