import AttributeAccordion from "../../../../Accordion/AttributeAccordion";
import AttributeAccordionDetails from "../../../../Accordion/AttributeAccordion/AttributeAccordionDetails";
import AttributeAccordionSummary from "../../../../Accordion/AttributeAccordion/AttributeAccordionSummary";
import Block from "../../styled/Block";
import BlockContent from "../../styled/BlockContent";
import ControlledCheckboxGroup from "../../../../Checkbox/ControlledCheckboxGroup";
import Label from "../../styled/Label";
import Loading from "../../../../Loading";
import { useTranslation } from "react-i18next";

const AttributeAccordionGroup = ({
    selectedFilters,
    filters,
    handleFiltersChange,
}: {
    selectedFilters: {};
    filters: Record<string, Array<string>>;
    handleFiltersChange: (
        attribute: string,
        selectedValues: Array<string>
    ) => void;
}) => {
    const { t } = useTranslation("translation", {
        keyPrefix: "FilterSidebar",
    });
    const { t: t_trait, ready: ready_trait } = useTranslation("translation", {
        keyPrefix: "NftTraits",
    });

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
                                            {t_trait(attribute, {
                                                defaultValue: attribute,
                                            })}
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
