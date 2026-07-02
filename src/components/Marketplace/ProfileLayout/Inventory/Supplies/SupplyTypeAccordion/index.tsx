import AttributeAccordion from "../../../../../widgets/Accordion/AttributeAccordion";
import AttributeAccordionDetails from "../../../../../widgets/Accordion/AttributeAccordion/AttributeAccordionDetails";
import AttributeAccordionSummary from "../../../../../widgets/Accordion/AttributeAccordion/AttributeAccordionSummary";
import { ImageTag } from "../../../../../../utils/ImageUtil";
import { supplyTypes as _supplyTypes } from "../../../../../Marketplace/constants/SupplyTypes";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Checkbox from "../../../../../widgets/Checkbox/Checkbox";
import Loading from "../../../../../widgets/Loading";

const SupplyTypeAccordion = ({
    supplyTypes,
    handleSupplyTypeChange,
}: {
    supplyTypes: string[];
    handleSupplyTypeChange: (_supplyType: string) => void;
}) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "FilterSidebar",
    });

    const [supplyExpanded, setSupplyExpanded] = useState(true);

    return (
        <AttributeAccordion
            expanded={supplyExpanded}
            onChange={() => {
                setSupplyExpanded(!supplyExpanded);
            }}
        >
            <AttributeAccordionSummary>
                <div className="label">
                    <Loading loading={!ready}>
                        {t("suppliesDropdown.label", {
                            defaultValue: "Supplies",
                        })}
                    </Loading>
                </div>
            </AttributeAccordionSummary>
            <AttributeAccordionDetails>
                <div className="ms-3 me-3">
                    <div className="lootbox-collection">
                        <Checkbox
                            checked={supplyTypes.includes(
                                _supplyTypes.FOUNDERS_LOOTBOXES
                            )}
                            onChange={() => {
                                handleSupplyTypeChange(
                                    _supplyTypes.FOUNDERS_LOOTBOXES
                                );
                            }}
                            label={
                                <div className="label d-flex align-items-center gap-2">
                                    <ImageTag
                                        height="25px"
                                        width="25px"
                                        src={`${process.env.PUBLIC_URL}/assets/images/icons/Lootbox.png`}
                                    />
                                    <span className="ms-1">
                                        <Loading loading={!ready}>
                                            {t(
                                                "suppliesDropdown.selections.Lootboxes",
                                                {
                                                    defaultValue:
                                                        "Founder's Lootboxes",
                                                }
                                            )}
                                        </Loading>
                                    </span>
                                </div>
                            }
                        />
                    </div>
                    <div className="gems mt-4">
                        <Checkbox
                            checked={supplyTypes.includes(_supplyTypes.GEMS)}
                            onChange={() => {
                                handleSupplyTypeChange(_supplyTypes.GEMS);
                            }}
                            label={
                                <div className="label d-flex align-items-center gap-2">
                                    <ImageTag
                                        height="25px"
                                        width="25px"
                                        src={`${process.env.PUBLIC_URL}/assets/images/icons/gem.png`}
                                    />
                                    <span className="ms-1">
                                        <Loading loading={!ready}>
                                            {t(
                                                "suppliesDropdown.selections.Gems",
                                                {
                                                    defaultValue:
                                                        "Founder's Gems",
                                                }
                                            )}
                                        </Loading>
                                    </span>
                                </div>
                            }
                        />
                    </div>
                    <div className="potions mt-4">
                        <Checkbox
                            checked={supplyTypes.includes(_supplyTypes.POTIONS)}
                            onChange={() => {
                                handleSupplyTypeChange(_supplyTypes.POTIONS);
                            }}
                            label={
                                <div className="label d-flex align-items-center gap-2">
                                    <ImageTag
                                        height="25px"
                                        width="25px"
                                        src={`${process.env.PUBLIC_URL}/assets/images/icons/potion_1.png`}
                                    />
                                    <span className="ms-1">
                                        <Loading loading={!ready}>
                                            {t(
                                                "suppliesDropdown.selections.Potions",
                                                {
                                                    defaultValue:
                                                        "Founder's Potions",
                                                }
                                            )}
                                        </Loading>
                                    </span>
                                </div>
                            }
                        />
                    </div>
                    <div className="rare-drops mt-4">
                        <Checkbox
                            checked={supplyTypes.includes(
                                _supplyTypes.RARE_DROPS
                            )}
                            onChange={() => {
                                handleSupplyTypeChange(_supplyTypes.RARE_DROPS);
                            }}
                            label={
                                <div className="label d-flex align-items-center gap-2">
                                    <ImageTag
                                        height="25px"
                                        width="25px"
                                        src={`${process.env.PUBLIC_URL}/assets/images/icons/rare_drops/200x200/switch_transparent.png`}
                                    />
                                    <span className="ms-1">
                                        <Loading loading={!ready}>
                                            {t(
                                                "suppliesDropdown.selections.Rare_Drop",
                                                {
                                                    defaultValue:
                                                        "Founder's Rare Drop",
                                                }
                                            )}
                                        </Loading>
                                    </span>
                                </div>
                            }
                        />
                    </div>
                    <div className="ultra-rare-drops mt-4">
                        <Checkbox
                            checked={supplyTypes.includes(
                                _supplyTypes.ULTRA_RARE_DROPS
                            )}
                            onChange={() => {
                                handleSupplyTypeChange(
                                    _supplyTypes.ULTRA_RARE_DROPS
                                );
                            }}
                            label={
                                <div className="label d-flex align-items-center gap-2">
                                    <ImageTag
                                        height="25px"
                                        width="25px"
                                        src={`${process.env.PUBLIC_URL}/assets/images/icons/ultra_rare_drops/200x200/macbook_transparent.png`}
                                    />
                                    <span className="ms-1">
                                        <Loading loading={!ready}>
                                            {t(
                                                "suppliesDropdown.selections.Ultra_Rare_Drop",
                                                {
                                                    defaultValue:
                                                        "Founder's Ultra Rare Drop",
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

export default SupplyTypeAccordion;
