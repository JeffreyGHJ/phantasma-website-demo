import AttributeAccordionGroup from "../shared/AttributeAccordionGroup";
import Block from "../styled/Block";
import BlockContent from "../styled/BlockContent";
import FilterHeader from "../shared/FilterHeader";
import FilterSidebarContent from "../styled/FilterSidebarContent";
import MarketplaceAccordion from "../shared/MarketplaceAccordion";
import littleGhostsFilters from "../../../../Marketplace/constants/littleGhostsFilters";

const GhostsFilterSidebarContent = ({
    handleClearFilter,
    marketplaces,
    handleMarketplaceChange,
    isAuction,
    handleFiltersChange,
    filters,
}: {
    handleClearFilter: () => void;
    marketplaces: string[];
    handleMarketplaceChange: (_marketplace: string) => void;
    isAuction: boolean;
    handleFiltersChange: (
        attribute: string,
        selectedValues: Array<string>
    ) => void;
    filters: {};
}) => {
    return (
        <FilterSidebarContent className="sidebar-content">
            <Block>
                <FilterHeader handleClearFilter={handleClearFilter} />
            </Block>
            {/* <Block>
				<BlockContent>
					<MarketplaceAccordion
						marketplaces={marketplaces}
						handleMarketplaceChange={handleMarketplaceChange}
						showPancakeswapMarketplace={!isAuction}
					/>
				</BlockContent>
			</Block> */}
            <AttributeAccordionGroup
                selectedFilters={filters}
                filters={littleGhostsFilters}
                handleFiltersChange={handleFiltersChange}
            />
        </FilterSidebarContent>
    );
};

export default GhostsFilterSidebarContent;
