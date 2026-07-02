import { useTranslation } from "react-i18next";
import Loading from "../../../../../widgets/Loading";
import { saleTypes } from "../../../../constants/saleTypes";
import SortTypeDropdown from "../../../../Shared/SortTypeDropdown";
import { useMediaQuery } from "@mui/material";
import LayoutButtonGroup from "../../../../Shared/LayoutButtonGroup";
import FilterButton from "../../../../Shared/FilterButton";

const FilterControls = ({
    soulEaters,
    sortType,
    viewType,
    handleSortTypeOnChange,
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
                        <Title itemsCount={soulEaters.length} />
                        {/* <SaleTypeDropdown
                            saleType={saleType}
                            handleSaleTypeOnChange={handleSaleTypeOnChange}
                        /> */}
                    </div>
                    <div className="right">
                        <SortTypeDropdown
                            sortType={sortType}
                            handleSortTypeOnChange={handleSortTypeOnChange}
                            isAuction={false}
                            saleType={saleTypes.ALL}
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
                        <Title itemsCount={soulEaters.length} />
                    </div>
                    <div className="etc-row">
                        {/* <SaleTypeDropdown
                            saleType={saleType}
                            handleSaleTypeOnChange={handleSaleTypeOnChange}
                        /> */}
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
                            isAuction={false}
                            saleType={saleTypes.ALL}
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

const Title = ({ itemsCount }: { itemsCount: number }) => {
    const { t: t_nft, ready: ready_nft } = useTranslation("translation", {
        keyPrefix: "CollectionNames",
    });

    return (
        <div className="title">
            <Loading loading={!ready_nft}>
                {itemsCount}{" "}
                {t_nft("SoulEaters", {
                    defaultValue: "SoulEaters",
                })}
            </Loading>
        </div>
    );
};

export default FilterControls;
