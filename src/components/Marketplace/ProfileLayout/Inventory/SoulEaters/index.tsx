import {
    useAccountSoulEaters,
    useNftsPerPage,
    useOverrideNavbarStickiness,
    useResumeNavbarStickiess,
    useSouleaters,
} from "../../../../../state/application/hooks";
import { useEffect, useState } from "react";
import { sortTypes } from "../../../constants/sortTypes";
import Loader from "../../../../widgets/Loader";
import JumpablePagination from "../../../../widgets/JumpablePagination";
import { viewTypes } from "../../../constants/viewTypes";
import FilterControls from "./FilterControls";
import {
    buildFilters,
    filterItems,
    getSEMetadataFromRedux,
    sortItems,
} from "./functions";
import TemporaryNftDetailCard from "../../../../widgets/Card/TemporaryNftDetailCard";
import TemporaryNftCard from "../../../../widgets/Card/TemporaryNftCard";
import { cloneDeep } from "lodash";
import FilterSidebar from "./FilterSidebar";

const InventorySoulEaters = () => {
    const [sortType, setSortType] = useState(sortTypes.HIGHEST_ID);
    const [viewType, setViewType] = useState(viewTypes.GRID_VIEW);
    const [soulEaters, setSoulEaters] = useState([] as any);
    const storedSoulEaters = useSouleaters();
    const [filteredItems, setFilteredItems] = useState([] as any);
    const [isFetching, setIsFetching] = useState(true);
    const accountSoulEaters = useAccountSoulEaters();

    const [pageCount, setPageCount] = useState(1);
    const [page, setPage] = useState(1);
    const nftsPerPage = useNftsPerPage();

    const [activeFilters, setActiveFilters] = useState({});
    const [showFilterSidebar, setShowFilterSidebar] = useState(false);

    const overrideStickiness = useOverrideNavbarStickiness();
    const resumeStickiness = useResumeNavbarStickiess();

    // reapply metadata if accountSoulEaters change
    useEffect(() => {
        setIsFetching(true);
        if (!storedSoulEaters || !storedSoulEaters.length) return;

        let timerId = setTimeout(() => {
            setSoulEaters(
                getSEMetadataFromRedux(accountSoulEaters, storedSoulEaters)
            );
            setIsFetching(false);
        }, 1500);

        return () => clearTimeout(timerId);
    }, [accountSoulEaters, storedSoulEaters]);

    // rebuild filters if souleaters Changes
    useEffect(() => {
        let filters = buildFilters(soulEaters);
        setActiveFilters(filters);
    }, [soulEaters]);

    // handle filters or sorting changes
    useEffect(() => {
        let _items = filterItems(soulEaters, activeFilters);
        _items = sortItems(_items, sortType);
        setFilteredItems(_items);
    }, [soulEaters, sortType, activeFilters]);

    // set pages
    useEffect(() => {
        setPageCount(Math.ceil(filteredItems.length / nftsPerPage));
        setPage(1);
    }, [filteredItems, nftsPerPage]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= pageCount) setPage(newPage);
    };

    const handleSortTypeOnChange = (e: any) => {
        setSortType(e.target.value);
    };

    const handleViewTypeChange = (type) => {
        setViewType(type);
    };

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

    // make navbar transparent when filter menu visible
    useEffect(() => {
        showFilterSidebar ? overrideStickiness() : resumeStickiness();
    }, [showFilterSidebar]);

    return (
        <div id="InventoryGhosts">
            <FilterControls
                soulEaters={filteredItems}
                sortType={sortType}
                viewType={viewType}
                handleSortTypeOnChange={handleSortTypeOnChange}
                handleViewTypeChange={handleViewTypeChange}
                setShowFilterSidebar={setShowFilterSidebar}
            />
            <section className="nft-section">
                <Loader show={isFetching} />
                <div className={`nfts ${viewType}`}>
                    {filteredItems
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
        </div>
    );
};

export default InventorySoulEaters;
