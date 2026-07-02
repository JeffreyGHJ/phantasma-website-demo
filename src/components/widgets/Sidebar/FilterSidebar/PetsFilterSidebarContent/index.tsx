import AttributeAccordionGroup from "../shared/AttributeAccordionGroup";
import Block from "../styled/Block";
import BlockContent from "../styled/BlockContent";
import FilterHeader from "../shared/FilterHeader";
import FilterSidebarContent from "../styled/FilterSidebarContent";
import MarketplaceAccordion from "../shared/MarketplaceAccordion";
import PetTypeAccordion from "../shared/PetTypeAccordion";
import { petTypes } from "../../../../Marketplace/constants/petTypes";

const PetsFilterSidebarContent = ({
    handleClearFilter,
    marketplaces,
    handleMarketplaceChange,
    isAuction,
    handleFiltersChange,
    selectedFilters,
    filters,
    petType,
    handlePetTypeChange,
}: {
    handleClearFilter: () => void;
    marketplaces: string[];
    handleMarketplaceChange: (_marketplace: string) => void;
    isAuction: boolean;
    handleFiltersChange: (
        attribute: string,
        selectedValues: Array<string>
    ) => void;
    selectedFilters: {};
    filters: Record<string, Array<string>>;
    petType: string;
    handlePetTypeChange: (_petType: string) => void;
}) => {
    return (
        <FilterSidebarContent className="sidebar-content">
            <Block>
                <FilterHeader handleClearFilter={handleClearFilter} />
            </Block>
            <Block>
                <BlockContent>
                    <PetTypeAccordion
                        petType={petType}
                        handlePetTypeChange={handlePetTypeChange}
                    />
                </BlockContent>
            </Block>
            {/* <Block>
				<BlockContent>
					<MarketplaceAccordion
						marketplaces={marketplaces}
						handleMarketplaceChange={handleMarketplaceChange}
						showPancakeswapMarketplace={
							!isAuction && petType !== petTypes.ECTOSKELETONS
						}
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

export default PetsFilterSidebarContent;
