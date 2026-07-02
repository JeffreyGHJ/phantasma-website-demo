import AttributeAccordionDetails from "../../../../../widgets/Accordion/AttributeAccordion/AttributeAccordionDetails";
import AttributeAccordionSummary from "../../../../../widgets/Accordion/AttributeAccordion/AttributeAccordionSummary";
import ControlledCheckboxGroup from "../../../../../widgets/Checkbox/ControlledCheckboxGroup";
import Loading from "../../../../../widgets/Loading";
import { useTranslation } from "react-i18next";
import AttributeAccordion from "../../../../../widgets/Accordion/AttributeAccordion";
import Label from "../../../../../widgets/Sidebar/FilterSidebar/styled/Label";
import Block from "../../../../../widgets/Sidebar/FilterSidebar/styled/Block";
import BlockContent from "../../../../../widgets/Sidebar/FilterSidebar/styled/BlockContent";
import { useEffect, useState } from "react";

const labelStyle = { display: "flex", alignItems: "center", gap: "1rem" };
const imgStyle = { transform: "translateY(-0.25rem)" };
const lootboxImg = "/assets/images/icons/Lootbox.png";
const gemsImg = "/assets/images/icons/gem.png";
const potionsImg = "/assets/images/icons/potion_1.png";
const rareDropsImg =
    "/assets/images/icons/rare_drops/200x200/switch_transparent.png";
const ultraRareDropsImg =
    "/assets/images/icons/ultra_rare_drops/200x200/macbook_transparent.png";

const AttributeAccordionGroup = ({
    selectedFilters,
    filters,
    handleFiltersChange,
    group,
}: {
    selectedFilters: {};
    filters: Record<string, Array<string>>;
    handleFiltersChange: (
        group: string,
        attribute: string,
        selectedValues: Array<string>
    ) => void;
    group: string;
}) => {
    const [filterIcon, setFilterIcon] = useState("");

    const { t } = useTranslation("translation", {
        keyPrefix: "FilterSidebar",
    });
    const { t: t_trait, ready: ready_trait } = useTranslation("translation", {
        keyPrefix: "NftTraits",
    });

    useEffect(() => {
        if (Object.entries(filters).length > 1) setFilterIcon(lootboxImg);
        if (Object.keys(filters)[0] === "Founder's Gems")
            setFilterIcon(gemsImg);
        if (Object.keys(filters)[0] === "Founder's Potions")
            setFilterIcon(potionsImg);
        if (Object.keys(filters)[0] === "Founder's Rare Drop")
            setFilterIcon(rareDropsImg);
        if (Object.keys(filters)[0] === "Founder's Ultra Rare Drop")
            setFilterIcon(ultraRareDropsImg);
    }, [filters]);

    return (
        <div className="all-filters scrollbar">
            {Object.keys(filters).map((attribute) => {
                return (
                    <Block key={attribute}>
                        <BlockContent>
                            <AttributeAccordion>
                                <AttributeAccordionSummary>
                                    <Label>
                                        <Loading loading={!ready_trait}>
                                            <div style={labelStyle}>
                                                {filterIcon && (
                                                    <img
                                                        style={imgStyle}
                                                        src={filterIcon}
                                                        height={22}
                                                        width={22}
                                                        alt={"image"}
                                                    />
                                                )}

                                                {t_trait(attribute, {
                                                    defaultValue: attribute,
                                                })}
                                            </div>
                                        </Loading>
                                    </Label>
                                </AttributeAccordionSummary>
                                <AttributeAccordionDetails className="scrollbar">
                                    <Loading
                                        loading={!ready_trait}
                                        width="100%"
                                        height="60px"
                                    >
                                        <ControlledCheckboxGroup
                                            className="ms-3 me-3"
                                            placeholder={t("filter", {
                                                defaultValue: "Filter",
                                            })}
                                            checkboxItems={filters[
                                                attribute
                                            ].map((attr) => {
                                                return {
                                                    label: t_trait(attr, {
                                                        defaultValue: attr,
                                                    }),

                                                    value: attr,
                                                };
                                            })}
                                            onChange={(values) => {
                                                handleFiltersChange(
                                                    group,
                                                    attribute,
                                                    values
                                                );
                                            }}
                                            checkedValues={
                                                selectedFilters[attribute] || []
                                            }
                                        />
                                    </Loading>
                                </AttributeAccordionDetails>
                            </AttributeAccordion>
                        </BlockContent>
                    </Block>
                );
            })}
        </div>
    );
};

export default AttributeAccordionGroup;
