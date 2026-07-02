import "./index.scss";
import "../../../Marketplace/ProfileLayout/Inventory/index.scss";
import SyncIcon from "@mui/icons-material/Sync";
import { useEffect, useState } from "react";
import { viewTypes } from "../../../Marketplace/constants/viewTypes";
import TemporaryNftCard from "../../../widgets/Card/TemporaryNftCard";
import TemporaryNftDetailCard from "../../../widgets/Card/TemporaryNftDetailCard";
import { sortTypes } from "../../../Marketplace/constants/sortTypes";
import {
    useNftsPerPage,
    useOverrideNavbarStickiness,
    useResumeNavbarStickiess,
    useSouleaters,
} from "../../../../state/application/hooks";
import { cloneDeep } from "lodash";
import FilterControls from "../../../Marketplace/ProfileLayout/Inventory/SoulEaters/FilterControls";
import FilterSidebar from "../../../Marketplace/ProfileLayout/Inventory/SoulEaters/FilterSidebar";
import {
    buildFilters,
    filterItems,
    sortItems,
} from "../../../Marketplace/ProfileLayout/Inventory/SoulEaters/functions";
import JumpablePagination from "../../../widgets/JumpablePagination";
import QuickSetting from "../../../widgets/SpeedDial/QuickSetting";
import Loader from "../../../widgets/Loader";

const SoulEaters = () => {
    const [sortType, setSortType] = useState(sortTypes.HIGHEST_ID);
    const [viewType, setViewType] = useState(viewTypes.GRID_VIEW);
    const [items, setItems] = useState([] as any);

    const [pageCount, setPageCount] = useState(1);
    const [page, setPage] = useState(1);
    const nftsPerPage = useNftsPerPage();

    const [activeFilters, setActiveFilters] = useState({});
    const [showFilterSidebar, setShowFilterSidebar] = useState(false);

    const overrideStickiness = useOverrideNavbarStickiness();
    const resumeStickiness = useResumeNavbarStickiess();

    const soulEaters = useSouleaters();

    // rebuild filters if souleaters Changes
    useEffect(() => {
        if (!soulEaters) return;
        let filters = buildFilters(soulEaters);
        setActiveFilters(filters);
    }, [soulEaters]);

    // handle filters or sorting changes
    useEffect(() => {
        if (!soulEaters) return;
        let _items = filterItems(soulEaters, activeFilters);
        _items = sortItems(_items, sortType);
        setItems(_items);
    }, [soulEaters, sortType, activeFilters]);

    // set pages
    useEffect(() => {
        setPageCount(Math.ceil(items.length / nftsPerPage));
        setPage(1);
    }, [items, nftsPerPage]);

    // make navbar transparent when filter menu visible
    useEffect(() => {
        showFilterSidebar ? overrideStickiness() : resumeStickiness();
    }, [showFilterSidebar]);

    // HANDLERS
    const handleClearFilters = () => {
        let filters = cloneDeep(activeFilters);
        let traitTypes = Object.keys(filters);

        traitTypes.map((traitType) => {
            let traitValues = Object.keys(filters[traitType]);
            traitValues.map((trait) => {
                filters[traitType][trait].selected = false;
            });
        });

        setActiveFilters(filters);
    };

    const handleFiltersChange = (group, value) => {
        let filters = cloneDeep(activeFilters);
        filters[group][value].selected === false
            ? (filters[group][value].selected = true)
            : (filters[group][value].selected = false);
        setActiveFilters(filters);
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= pageCount) setPage(newPage);
    };

    const handleSortTypeOnChange = (e: any) => {
        setSortType(e.target.value);
    };

    const handleViewTypeChange = (type) => {
        setViewType(type);
    };

    return (
        <div id="Inventory" className="scrollbar souleaters">
            {/* <Loader show={isUpdating} /> */}
            <FilterControls
                soulEaters={items}
                sortType={sortType}
                viewType={viewType}
                handleSortTypeOnChange={handleSortTypeOnChange}
                handleViewTypeChange={handleViewTypeChange}
                setShowFilterSidebar={setShowFilterSidebar}
            />
            {/* {isDataMissing && (
                <div className="refresh-btn" onClick={() => updateMetadata()}>
                    Refresh Metadata
                    <SyncIcon
                        className={" sync-icon " + (isUpdating ? " spin " : "")}
                    />
                </div>
            )} */}
            <section className="nft-section">
                <div className={`nfts ${viewType}`}>
                    {items
                        .slice((page - 1) * nftsPerPage, page * nftsPerPage)
                        .map((item) => {
                            return viewType === viewTypes.GRID_VIEW ? (
                                <TemporaryNftCard
                                    key={`${item.name}-${item.tokenId}`}
                                    pathPrefix="/marketplace/souleater"
                                    item={item}
                                />
                            ) : (
                                <TemporaryNftDetailCard
                                    key={`${item.name}-${item.tokenId}`}
                                    pathPrefix="/marketplace/souleater"
                                    item={item}
                                />
                            );
                        })}
                </div>
                <JumpablePagination
                    currentPage={page}
                    pages={pageCount}
                    onChange={handlePageChange}
                />
            </section>
            {showFilterSidebar && (
                <FilterSidebar
                    activeFilters={activeFilters}
                    show={showFilterSidebar}
                    setShow={setShowFilterSidebar}
                    handleFiltersChange={handleFiltersChange}
                    handleClearFilters={handleClearFilters}
                />
            )}
            <QuickSetting />
        </div>
    );
};

export default SoulEaters;
