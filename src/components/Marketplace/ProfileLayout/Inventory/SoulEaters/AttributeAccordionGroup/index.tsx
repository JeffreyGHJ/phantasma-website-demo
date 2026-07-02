import AttributeAccordionDetails from "../../../../../widgets/Accordion/AttributeAccordion/AttributeAccordionDetails";
import AttributeAccordionSummary from "../../../../../widgets/Accordion/AttributeAccordion/AttributeAccordionSummary";

import Loading from "../../../../../widgets/Loading";
import { useTranslation } from "react-i18next";
import AttributeAccordion from "../../../../../widgets/Accordion/AttributeAccordion";
import Label from "../../../../../widgets/Sidebar/FilterSidebar/styled/Label";
import Block from "../../../../../widgets/Sidebar/FilterSidebar/styled/Block";
import BlockContent from "../../../../../widgets/Sidebar/FilterSidebar/styled/BlockContent";
import { useEffect, useState } from "react";
import ControlledCheckboxGroup from "../ControlledCheckboxGroup";

const labelStyle = { display: "flex", alignItems: "center", gap: "1rem" };

const AttributeAccordionGroup = ({
    group,
    selectedFilters,
    handleFiltersChange,
}) => {
    const [checkedValues, setCheckedValues] = useState([]);

    const { t } = useTranslation("translation", {
        keyPrefix: "FilterSidebar",
    });
    const { t: t_trait, ready: ready_trait } = useTranslation("translation", {
        keyPrefix: "NftTraits",
    });

    useEffect(() => {
        let _checkedValues = [] as any;
        Object.entries(selectedFilters).map((entry: any) => {
            let trait = entry[0];
            let values = entry[1];
            if (values.selected === true) _checkedValues.push(trait);
        });
        // console.log("Checked VAlues: ", _checkedValues);
        setCheckedValues(_checkedValues);
    }, [selectedFilters]);

    return (
        <div className="all-filters scrollbar">
            <Block>
                <BlockContent>
                    <AttributeAccordion>
                        <AttributeAccordionSummary>
                            <Label>
                                <Loading loading={!ready_trait}>
                                    <div style={labelStyle}>
                                        {t_trait(group, {
                                            defaultValue: group,
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
                                    checkboxItems={Object.entries(
                                        selectedFilters
                                    ).map((entry: any) => {
                                        return {
                                            label: t_trait(entry[0], {
                                                defaultValue: entry[0],
                                            }),
                                            value: entry[0],
                                            count: entry[1].count,
                                        };
                                    })}
                                    onChange={(values) => {
                                        handleFiltersChange(group, values);
                                    }}
                                    checkedValues={checkedValues}
                                />
                            </Loading>
                        </AttributeAccordionDetails>
                    </AttributeAccordion>
                </BlockContent>
            </Block>
        </div>
    );
};

export default AttributeAccordionGroup;
