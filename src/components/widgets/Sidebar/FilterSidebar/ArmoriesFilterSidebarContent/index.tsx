import ArmoryTypeAccordion from "../shared/ArmoryTypeAccordion";
import AttributeAccordionGroup from "../shared/AttributeAccordionGroup";
import Block from "../styled/Block";
import BlockContent from "../styled/BlockContent";
import FilterHeader from "../shared/FilterHeader";
import FilterSidebarContent from "../styled/FilterSidebarContent";
import MarketplaceAccordion from "../shared/MarketplaceAccordion";

const ArmoriesFilterSidebarContent = ({
    handleClearFilter,
    marketplaces,
    handleMarketplaceChange,
    handleFiltersChange,
    selectedFilters,
    filters,
    armoryType,
    handleArmoryTypeChange,
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
    armoryType: string;
    handleArmoryTypeChange: (_armoryType: string) => void;
}) => {
    return (
        <FilterSidebarContent>
            <Block>
                <FilterHeader handleClearFilter={handleClearFilter} />
            </Block>
            <Block>
                <BlockContent>
                    <ArmoryTypeAccordion
                        armoryType={armoryType}
                        handleArmoryTypeChange={handleArmoryTypeChange}
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

export default ArmoriesFilterSidebarContent;
