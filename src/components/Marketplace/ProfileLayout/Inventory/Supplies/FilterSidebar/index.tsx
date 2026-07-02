import SidebarOverlay from "../../../../../widgets/Overlay/SidebarOverlay";
import FilterHeader from "../../../../../widgets/Sidebar/FilterSidebar/shared/FilterHeader";
import Block from "../../../../../widgets/Sidebar/FilterSidebar/styled/Block";
import BlockContent from "../../../../../widgets/Sidebar/FilterSidebar/styled/BlockContent";
import FilterSidebarContent from "../../../../../widgets/Sidebar/FilterSidebar/styled/FilterSidebarContent";
import RightDrawerSidebar from "../../../../../widgets/Sidebar/RightDrawerSidebar";
import SupplyTypeAccordion from "../SupplyTypeAccordion";
import "./index.scss";
import lootboxFilters from "../../../../constants/lootboxFilters";
import { useEffect, useState } from "react";
import {
    founderitemsGemFilters,
    founderitemsPotionFilters,
    founderitemsRareDropFilters,
    founderitemsUltraRareDropFilters,
} from "../../../../constants/foundersItemsFilters";
import { supplyTypes as _supplyTypes } from "../../../../constants/SupplyTypes";
import AttributeAccordionGroup from "../AttributeAccordionGroup";

const FilterSidebar = ({
    activeFilters,
    show,
    setShow,
    supplyTypes,
    handleSupplyTypeChange,
    handleFiltersChange,
    handleClearFilters,
}) => {
    const [filters, setFilters] = useState<any>({});

    useEffect(() => {
        let _filters = {};

        supplyTypes.map((supplyType) => {
            if (supplyType === _supplyTypes.FOUNDERS_LOOTBOXES) {
                _filters[supplyType] = lootboxFilters;
            } else if (supplyType === _supplyTypes.GEMS) {
                _filters[supplyType] = founderitemsGemFilters;
            } else if (supplyType === _supplyTypes.POTIONS) {
                _filters[supplyType] = founderitemsPotionFilters;
            } else if (supplyType === _supplyTypes.RARE_DROPS) {
                _filters[supplyType] = founderitemsRareDropFilters;
            } else if (supplyType === _supplyTypes.ULTRA_RARE_DROPS) {
                _filters[supplyType] = founderitemsUltraRareDropFilters;
            }
            return;
        });

        setFilters(_filters);
    }, [supplyTypes]);

    return (
        <>
            <RightDrawerSidebar className={`${show ? "show" : "clear"}`}>
                <FilterSidebarContent>
                    <Block>
                        <FilterHeader handleClearFilter={handleClearFilters} />
                    </Block>
                    <Block>
                        <BlockContent>
                            <SupplyTypeAccordion
                                supplyTypes={supplyTypes}
                                handleSupplyTypeChange={handleSupplyTypeChange}
                            />
                        </BlockContent>
                    </Block>
                    {Object.entries(filters).map((entry: any, index) => {
                        return (
                            <AttributeAccordionGroup
                                key={index}
                                selectedFilters={activeFilters[entry[0]] || {}}
                                filters={entry[1]}
                                handleFiltersChange={handleFiltersChange}
                                group={entry[0]}
                            />
                        );
                    })}
                </FilterSidebarContent>
            </RightDrawerSidebar>
            {show && (
                <SidebarOverlay
                    onClick={() => {
                        setShow(false);
                    }}
                />
            )}
        </>
    );
};

export default FilterSidebar;
