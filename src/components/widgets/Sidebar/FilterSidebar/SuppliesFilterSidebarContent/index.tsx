import AttributeAccordionGroup from "../shared/AttributeAccordionGroup";
import Block from "../styled/Block";
import BlockContent from "../styled/BlockContent";
import FilterHeader from "../shared/FilterHeader";
import FilterSidebarContent from "../styled/FilterSidebarContent";
import MarketplaceAccordion from "../shared/MarketplaceAccordion";
import SupplyTypeAccordion from "../shared/SupplyTypeAccordion";

const SuppliesFilterSidebarContent = ({
    handleClearFilter,
    marketplaces,
    handleMarketplaceChange,
    handleFiltersChange,
    selectedFilters,
    filters,
    supplyType,
    handleSupplyTypeChange,
}: {
    handleClearFilter: () => void;
    marketplaces: string[];
    handleMarketplaceChange: (_marketplace: string) => void;
    handleFiltersChange: (
        attribute: string,
        selectedValues: Array<string>
    ) => void;
    selectedFilters: {};
    filters: Record<string, Array<string>>;
    supplyType: string;
    handleSupplyTypeChange: (_supplyType: string) => void;
}) => {
    return (
        <FilterSidebarContent>
            <Block>
                <FilterHeader handleClearFilter={handleClearFilter} />
            </Block>
            <Block>
                <BlockContent>
                    <SupplyTypeAccordion
                        supplyType={supplyType}
                        handleSupplyTypeChange={handleSupplyTypeChange}
                    />
                </BlockContent>
            </Block>
            {/* <Block>
				<BlockContent>
					<MarketplaceAccordion
						marketplaces={marketplaces}
						handleMarketplaceChange={handleMarketplaceChange}
						showPancakeswapMarketplace={false}
					/>
				</BlockContent>
			</Block> */}
            <AttributeAccordionGroup
                selectedFilters={selectedFilters}
                filters={filters}
                handleFiltersChange={handleFiltersChange}
            />
        </FilterSidebarContent>
    );
};

export default SuppliesFilterSidebarContent;
