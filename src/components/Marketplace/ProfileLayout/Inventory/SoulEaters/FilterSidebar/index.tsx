import SidebarOverlay from "../../../../../widgets/Overlay/SidebarOverlay";
import FilterHeader from "../../../../../widgets/Sidebar/FilterSidebar/shared/FilterHeader";
import Block from "../../../../../widgets/Sidebar/FilterSidebar/styled/Block";
import FilterSidebarContent from "../../../../../widgets/Sidebar/FilterSidebar/styled/FilterSidebarContent";
import RightDrawerSidebar from "../../../../../widgets/Sidebar/RightDrawerSidebar";
import { supplyTypes as _supplyTypes } from "../../../../constants/SupplyTypes";
import AttributeAccordionGroup from "../AttributeAccordionGroup";

const FilterSidebar = ({
    activeFilters,
    show,
    setShow,
    handleFiltersChange,
    handleClearFilters,
}) => {
    return (
        <>
            <RightDrawerSidebar className={`${show ? "show" : "clear"}`}>
                <FilterSidebarContent>
                    <Block>
                        <FilterHeader handleClearFilter={handleClearFilters} />
                    </Block>
                    {Object.entries(activeFilters).map((entry: any, index) => {
                        return (
                            <AttributeAccordionGroup
                                key={index}
                                group={entry[0]}
                                selectedFilters={activeFilters[entry[0]] || {}}
                                handleFiltersChange={handleFiltersChange}
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
