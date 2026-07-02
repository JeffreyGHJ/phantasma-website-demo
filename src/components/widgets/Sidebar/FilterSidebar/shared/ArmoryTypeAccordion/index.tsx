import AttributeAccordion from '../../../../Accordion/AttributeAccordion';
import AttributeAccordionDetails from '../../../../Accordion/AttributeAccordion/AttributeAccordionDetails';
import AttributeAccordionSummary from '../../../../Accordion/AttributeAccordion/AttributeAccordionSummary';
import Checkbox from '../../../../Checkbox/Checkbox';
import { ImageTag } from '../../../../../../utils/ImageUtil';
import Loading from '../../../../Loading';
import { armoryTypes } from '../../../../../Marketplace/constants/armoryTypes';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ArmoryTypeAccordion = ({
	armoryType,
	handleArmoryTypeChange,
}: {
	armoryType: string;
	handleArmoryTypeChange: (_armoryType: string) => void;
}) => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'FilterSidebar',
	});

	const [armoryExpanded, setArmoryExpanded] = useState(true);

	return (
		<AttributeAccordion
			expanded={armoryExpanded}
			onChange={() => {
				setArmoryExpanded(!armoryExpanded);
			}}
		>
			<AttributeAccordionSummary>
				<div className='label'>
					<Loading loading={!ready}>
						{t('armoriesDropdown.label', {
							defaultValue: 'Armory',
						})}
					</Loading>
				</div>
			</AttributeAccordionSummary>
			<AttributeAccordionDetails>
				<div className='ms-3 me-3'>
					<div className='founders-armory-collection'>
						<Checkbox
							checked={armoryType === armoryTypes.FOUNDERS_ARMORY}
							onChange={() => {
								handleArmoryTypeChange(
									armoryTypes.FOUNDERS_ARMORY
								);
							}}
							label={
								<div className='label d-flex align-items-center gap-2'>
									<ImageTag
										height='25px'
										width='25px'
										src={`${process.env.PUBLIC_URL}/assets/images/icons/Sword.png`}
									/>
									<span className='ms-1'>
										<Loading loading={!ready}>
											{t(
												'armoriesDropdown.selections.founders_armory',
												{
													defaultValue:
														"Founder's Armory",
												}
											)}
										</Loading>
									</span>
								</div>
							}
						/>
					</div>
				</div>
			</AttributeAccordionDetails>
		</AttributeAccordion>
	);
};

export default ArmoryTypeAccordion;
