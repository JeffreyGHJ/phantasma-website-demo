import "./index.scss";
import { useEffect, useState } from "react";
import { saleTypes } from "../../../constants/saleTypes";
import { sortTypes } from "../../../constants/sortTypes";
import { viewTypes } from "../../../constants/viewTypes";
import { supplyTypes as _supplyTypes } from "../../../constants/SupplyTypes";
import Loader from "../../../../widgets/Loader";
import NftCard from "../../../../widgets/Card/NftCard";
import NftDetailCard from "../../../../widgets/Card/NftDetailCard";
import { useActiveWeb3React } from "../../../../../hooks";
import FilterSidebar from "./FilterSidebar";
import {
    approveFounderLootbox,
    checkIfLootboxIsApprovedForClaim,
    claimFounderLootbox,
    filterItems,
    getPathPrefix,
    lootboxActions,
    lootboxesFirst,
    openFounderLootbox,
    sortItems,
    updateSupplyTypes,
} from "./functions";
import FilterControls from "./FilterControls";
import { cloneDeep } from "lodash";
import { useApproveClaimLootboxReward } from "../../../../../constants/abis/bsc/LootboxABI/hooks/useApproveClaimLootboxReward";
import { isLootboxApprovedForClaim } from "../../../../../constants/abis/bsc/LootboxABI/hooks/useIsLootboxApprovedForClaim";
import {
    useNftsPerPage,
    useOverrideNavbarStickiness,
    useResumeNavbarStickiess,
    useUpdateOverlay,
} from "../../../../../state/application/hooks";
import { useOpenLootbox } from "../../../../../constants/abis/bsc/LootboxABI/hooks/useOpenLootbox";
import { useClaimLootboxReward } from "../../../../../constants/abis/bsc/LootboxABI/hooks/useClaimLootboxReward";
import RewardSpinDialog from "../../../../shared/RewardSpinDialog";
import JumpablePagination from "../../../../widgets/JumpablePagination";
import React from "react";
import { useAllOwnedSupplies } from "../../../../../apis/web/web.hook";

const MemoizedSupplies = () => {
    const { account } = useActiveWeb3React();
    const {
        supplies: items,
        refreshSupplies,
        isFetching,
    } = useAllOwnedSupplies();
    const [supplies, setSupplies] = useState<Array<any>>([]);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [activeFilters, setActiveFilters] = useState({});

    const [supplyTypes, setSupplyTypes] = useState(Object.values(_supplyTypes));
    const [saleType, setSaleType] = useState(saleTypes.ALL);
    const [sortType, setSortType] = useState(sortTypes.HIGHEST_ID);
    const [viewType, setViewType] = useState(viewTypes.GRID_VIEW);

    const [pageCount, setPageCount] = useState(1);
    const [page, setPage] = useState(1);

    const [showFilterSidebar, setShowFilterSidebar] = useState(false);
    const [isSpinBoxOpen, setIsSpinBoxOpen] = useState(false);
    const [isLootboxApprovedToClaim, setIsLootboxApprovedToClaim] =
        useState(false);

    const approveLootboxForClaim = useApproveClaimLootboxReward();
    const claimLootboxRewards = useClaimLootboxReward();
    const openLootbox = useOpenLootbox();
    const updateOverlay = useUpdateOverlay();
    const overrideStickiness = useOverrideNavbarStickiness();
    const resumeStickiness = useResumeNavbarStickiess();
    const nftsPerPage = useNftsPerPage();

    // HANDLERS FOR FILTER CONTROLS
    const handleSaleTypeOnChange = (e: any) => {
        setSaleType(e.target.value);
    };

    const handleSortTypeOnChange = (e: any) => {
        setSortType(e.target.value);
    };

    const handleViewTypeChange = (_viewType: string) => {
        setViewType(_viewType);
    };

    const handleSupplyTypeChange = (slectedType: any) => {
        updateSupplyTypes(slectedType, supplyTypes, setSupplyTypes);
    };

    const handleClearFilters = () => {
        setActiveFilters({});
    };

    const handleFiltersChange = (group, attribute, selectedValues) => {
        let filters = cloneDeep(activeFilters);
        if (!filters[group]) filters[group] = {};
        filters[group][attribute] = selectedValues;
        setActiveFilters(filters);
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= pageCount) setPage(newPage);
    };

    // HANDLERS FOR LOOTBOX ACTIONS
    const handleApproveFounderLootbox = () => {
        approveFounderLootbox(
            isLootboxApprovedToClaim,
            setIsLootboxApprovedToClaim,
            approveLootboxForClaim
        );
    };

    const handleOpenFounderLootbox = (_item) => {
        openFounderLootbox(
            _item,
            updateOverlay,
            openLootbox,
            setIsSpinBoxOpen,
            refreshSupplies
        );
    };

    const handleClaimFounderLootbox = (_item?: any) => {
        claimFounderLootbox(
            _item,
            selectedItem,
            claimLootboxRewards,
            setIsSpinBoxOpen,
            refreshSupplies
        );
    };

    const handleCloseFounderLootbox = () => {
        setIsSpinBoxOpen(false);
    };

    const getLootboxActions = (item) => {
        return lootboxActions(
            item,
            isLootboxApprovedToClaim,
            setSelectedItem,
            handleApproveFounderLootbox,
            handleOpenFounderLootbox,
            handleClaimFounderLootbox
        );
    };

    // use items + filters to determine set of supplies
    useEffect(() => {
        let _items = filterItems(items, supplyTypes, activeFilters, saleType);
        sortItems(_items, sortType);
        _items = lootboxesFirst(_items);
        setSupplies(_items);
    }, [supplyTypes, saleType, activeFilters, sortType, items]);

    // handle account changes
    useEffect(() => {
        if (!account) {
            setSupplies([]);
            setSelectedItem(null);
            setIsLootboxApprovedToClaim(false);
            return;
        }
        checkIfLootboxIsApprovedForClaim(
            account,
            setIsLootboxApprovedToClaim,
            isLootboxApprovedForClaim
        );
    }, [account]);

    // make navbar transparent when filter menu visible
    useEffect(() => {
        showFilterSidebar ? overrideStickiness() : resumeStickiness();
    }, [showFilterSidebar]);

    // set pages
    useEffect(() => {
        setPageCount(Math.ceil(supplies.length / nftsPerPage));
        setPage(1);
    }, [supplies, nftsPerPage]);

    return (
        <div id="InventorySupply">
            <FilterControls
                supplies={supplies}
                supplyTypes={supplyTypes}
                saleType={saleType}
                sortType={sortType}
                viewType={viewType}
                isAuction={saleType === saleTypes.AUCTION}
                handleSortTypeOnChange={handleSortTypeOnChange}
                handleSaleTypeOnChange={handleSaleTypeOnChange}
                handleViewTypeChange={handleViewTypeChange}
                setShowFilterSidebar={setShowFilterSidebar}
            />
            <section className="nft-section">
                <Loader show={isFetching} />
                <div className={`nfts ${viewType}`}>
                    {supplies
                        .slice((page - 1) * nftsPerPage, page * nftsPerPage)
                        .map((item: any) => {
                            return viewType === viewTypes.GRID_VIEW ? (
                                <NftCard
                                    key={`${item.name}-${
                                        item.token_id | item.id
                                    }`}
                                    pathPrefix={getPathPrefix(item)}
                                    item={item}
                                    actions={getLootboxActions(item)}
                                    showAuctionDetail={
                                        saleType === saleTypes.AUCTION
                                    }
                                />
                            ) : (
                                <NftDetailCard
                                    key={`${item.name}-${
                                        item.token_id | item.id
                                    }`}
                                    pathPrefix={getPathPrefix(item)}
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
            {isSpinBoxOpen && selectedItem && (
                <RewardSpinDialog
                    open={isSpinBoxOpen}
                    onClose={handleCloseFounderLootbox}
                    itemID={selectedItem.token_id}
                    onClaim={handleClaimFounderLootbox}
                    isApproved={isLootboxApprovedToClaim}
                    onApprove={handleApproveFounderLootbox}
                />
            )}
            {showFilterSidebar && (
                <FilterSidebar
                    activeFilters={activeFilters}
                    show={showFilterSidebar}
                    setShow={setShowFilterSidebar}
                    supplyTypes={supplyTypes}
                    handleSupplyTypeChange={handleSupplyTypeChange}
                    handleFiltersChange={handleFiltersChange}
                    handleClearFilters={handleClearFilters}
                />
            )}
        </div>
    );
};

export const Supplies = React.memo(MemoizedSupplies);
