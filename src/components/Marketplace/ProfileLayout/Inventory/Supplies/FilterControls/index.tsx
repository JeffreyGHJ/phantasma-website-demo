import { useTranslation } from "react-i18next";
import { supplyCollectionNameByType } from "../../../../constants/SupplyTypes";
import Loading from "../../../../../widgets/Loading";
import SaleTypeDropdown from "../../../../Shared/SaleTypeDropdown";
import SortTypeDropdown from "../../../../Shared/SortTypeDropdown";
import LayoutButtonGroup from "../../../../Shared/LayoutButtonGroup";
import FilterButton from "../../../../Shared/FilterButton";
import { useMediaQuery } from "@mui/material";

const FilterControls = ({
    supplies,
    supplyTypes,
    saleType,
    sortType,
    viewType,
    isAuction,
    handleSortTypeOnChange,
    handleSaleTypeOnChange,
    handleViewTypeChange,
    setShowFilterSidebar,
}) => {
    const smallDevice = useMediaQuery("(max-width:430px)");

    return (
        <section
            className={`filter-section ${
                smallDevice ? "small-device" : "large-device"
            }`}
        >
            {!smallDevice && (
                <>
                    <div className="left">
                        <Title
                            itemsCount={supplies.length}
                            supplyType={
                                supplyTypes.length > 1
                                    ? "Supplies"
                                    : supplyCollectionNameByType[supplyTypes[0]]
                            }
                        />
                        <SaleTypeDropdown
                            saleType={saleType}
                            handleSaleTypeOnChange={handleSaleTypeOnChange}
                        />
                    </div>
                    <div className="right">
                        <SortTypeDropdown
                            sortType={sortType}
                            handleSortTypeOnChange={handleSortTypeOnChange}
                            isAuction={isAuction}
                            saleType={saleType}
                        />
                        <div className="filter-btn-layout-wrapper">
                            <div className="filter-btn">
                                <FilterButton
                                    setShowFilterSidebar={setShowFilterSidebar}
                                />
                            </div>

                            <LayoutButtonGroup
                                handleViewTypeChange={handleViewTypeChange}
                                viewType={viewType}
                            />
                        </div>
                    </div>
                </>
            )}
            {smallDevice && (
                <>
                    <div className="etc-row row-center">
                        <Title
                            itemsCount={supplies.length}
                            supplyType={
                                supplyTypes.length > 1
                                    ? "Supplies"
                                    : supplyCollectionNameByType[supplyTypes[0]]
                            }
                        />
                    </div>
                    <div className="etc-row">
                        <SaleTypeDropdown
                            saleType={saleType}
                            handleSaleTypeOnChange={handleSaleTypeOnChange}
                        />
                        <div className="filter-btn">
                            <FilterButton
                                setShowFilterSidebar={setShowFilterSidebar}
                            />
                        </div>
                    </div>
                    <div className="etc-row">
                        <SortTypeDropdown
                            sortType={sortType}
                            handleSortTypeOnChange={handleSortTypeOnChange}
                            isAuction={isAuction}
                            saleType={saleType}
                        />
                        <LayoutButtonGroup
                            handleViewTypeChange={handleViewTypeChange}
                            viewType={viewType}
                        />
                    </div>
                </>
            )}
        </section>
    );
};

const Title = ({
    supplyType,
    itemsCount,
}: {
    supplyType: string;
    itemsCount: number;
}) => {
    const { t: t_nft, ready: ready_nft } = useTranslation("translation", {
        keyPrefix: "CollectionNames",
    });

    return (
        <div className="title">
            <Loading loading={!ready_nft}>
                {itemsCount}{" "}
                {t_nft(supplyType, {
                    defaultValue: supplyType,
                })}
            </Loading>
        </div>
    );
};

export default FilterControls;
