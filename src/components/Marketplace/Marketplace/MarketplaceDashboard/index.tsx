import "./index.scss";

import {
    Dispatch,
    SetStateAction,
    SyntheticEvent,
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    ectoSkeletonNFTAddress,
    littleGhostNFTAddress,
    littleGhostsMarketContractAddress,
    pancakeSwapNftMarketContractAddress,
} from "../../../../constants/ContractAddresses";
import { isNumber, isUndefined } from "lodash";
import {
    useBnbPriceInUsd,
    useNftsPerPage,
} from "../../../../state/application/hooks";
import {
    useCollectionData,
    useCollectionDayData,
    useTransactionData,
} from "../../../../apis/subgraphs/lg_pcs_marketplace/hook";

import CollectionStatTabs from "../../../widgets/Tab/CollectionStatTabs";
import { ImageTag } from "../../../../utils/ImageUtil";
import JumpablePagination from "../../../widgets/JumpablePagination";
import LayoutButtonGroup from "../../Shared/LayoutButtonGroup";
import Loading from "../../../widgets/Loading";
import MarketplaceSelect from "../../../widgets/Select/MarketplaceSelect";
import MarketplaceSelectValue from "../../../widgets/Select/MarketplaceSelect/types/MarketplaceSelectValue";
import NftCard from "../../../widgets/Card/NftCard";
import NftDetailCard from "../../../widgets/Card/NftDetailCard";
import NftSelect from "../../../widgets/Select/NftSelect";
import NftSelectValue from "../../../widgets/Select/NftSelect/types/NftSelectValue";
import QuickSetting from "../../../widgets/SpeedDial/QuickSetting";
import RecentlySoldCollectionItem from "../../../../state/application/types/RecentlySoldCollectionItem";
import { SelectChangeEvent } from "@mui/material";
import SubgraphCollection from "../../../../constants/types/SubgraphCollection";
import SubgraphCollectionDay from "../../../../constants/types/SubgraphCollectionDay";
import SubgraphTransaction from "../../../../constants/types/SubgraphTransaction";
import Web3 from "web3";
import { blockchains } from "../../../../constants/Blockchains";
import { fetchRecentlySoldCollectionItems } from "../../../../apis/web/web.api";
import { getHumanReadableLargeNumber } from "../../../../utils/NumberUtil";
import { marketplaceTypes } from "../../constants/marketplaceTypes";
import timeframes from "../../../widgets/Tab/CollectionStatTabs/constants/timeframes";
import { useTranslation } from "react-i18next";
import { viewTypes } from "../../constants/viewTypes";

const day = 86400;
const now = Math.floor(Date.now() / 1000);
const previousDay = now - day;
const previousWeek = now - day * 7;
const previousMonth = now - day * 30;

const MarketplaceDashboard = () => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "MarketplaceDashboard",
    });

    // #region timeframe tab
    const [timeFrametab, setTimeFrameTab] = useState(0);
    const handleTimeFrameTabChange = (
        event: SyntheticEvent<Element, Event>,
        newValue: number
    ) => {
        setTimeFrameTab(newValue);
    };
    // #endregion

    // #region NFT Select
    const [nft, setNft] = useState<NftSelectValue>("ghost");
    const handleNftChange = (event: SelectChangeEvent<NftSelectValue>) => {
        setNft(event.target.value as NftSelectValue);
    };
    // #endregion

    // #region Marketplace Select
    const [marketplace, setMarketplace] =
        useState<MarketplaceSelectValue>("littleghosts");
    const handleMarketplaceChange = (
        event: SelectChangeEvent<MarketplaceSelectValue>
    ) => {
        setMarketplace(event.target.value as MarketplaceSelectValue);
    };
    // #endregion

    // #region LittleGhosts (LG Marketplace) data
    const littleGhostsLgData = useCollectionData({
        marketplace: "littleghosts",
        collectionAddress: littleGhostNFTAddress,
    });
    const littleGhosts24HrLgData = useTransactionData({
        marketplace: "littleghosts",
        collectionAddress: littleGhostNFTAddress,
        from: previousDay,
        to: now,
    });
    const littleGhosts7dayLgData = useCollectionDayData({
        marketplace: "littleghosts",
        collectionAddress: littleGhostNFTAddress,
        from: previousWeek,
        to: now,
    });
    const littleGhosts30dayLgData = useCollectionDayData({
        marketplace: "littleghosts",
        collectionAddress: littleGhostNFTAddress,
        from: previousMonth,
        to: now,
    });
    // #endregion

    // #region Skeleton (LG Marketplace) data
    const skeletonLgData = useCollectionData({
        marketplace: "littleghosts",
        collectionAddress: ectoSkeletonNFTAddress,
    });
    const skeleton24HrLgData = useTransactionData({
        marketplace: "littleghosts",
        collectionAddress: ectoSkeletonNFTAddress,
        from: previousDay,
        to: now,
    });
    const skeleton7dayLgData = useCollectionDayData({
        marketplace: "littleghosts",
        collectionAddress: ectoSkeletonNFTAddress,
        from: previousWeek,
        to: now,
    });
    const skeleton30dayLgData = useCollectionDayData({
        marketplace: "littleghosts",
        collectionAddress: ectoSkeletonNFTAddress,
        from: previousMonth,
        to: now,
    });
    // #endregion

    // #region LittleGhosts (Pancake Marketplace) data
    const littleGhostsPcsData = useCollectionData({
        marketplace: "pancakeswap",
        collectionAddress: littleGhostNFTAddress,
    });
    const littleGhosts24HrPcsData = useTransactionData({
        marketplace: "pancakeswap",
        collectionAddress: littleGhostNFTAddress,
        from: previousDay,
        to: now,
    });
    const littleGhosts7dayPcsData = useCollectionDayData({
        marketplace: "pancakeswap",
        collectionAddress: littleGhostNFTAddress,
        from: previousWeek,
        to: now,
    });

    const littleGhosts30dayPcsData = useCollectionDayData({
        marketplace: "pancakeswap",
        collectionAddress: littleGhostNFTAddress,
        from: previousMonth,
        to: now,
    });
    // #endregion

    // #region EctoSkeletons (Pancake Marketplace) data
    const skeletonPcsData = useCollectionData({
        marketplace: "pancakeswap",
        collectionAddress: ectoSkeletonNFTAddress,
    });
    const skeleton24HrPcsData = useTransactionData({
        marketplace: "pancakeswap",
        collectionAddress: ectoSkeletonNFTAddress,
        from: previousDay,
        to: now,
    });

    const skeleton7dayPcsData = useCollectionDayData({
        marketplace: "pancakeswap",
        collectionAddress: ectoSkeletonNFTAddress,
        from: previousWeek,
        to: now,
    });

    const skeleton30dayPcsData = useCollectionDayData({
        marketplace: "pancakeswap",
        collectionAddress: ectoSkeletonNFTAddress,
        from: previousMonth,
        to: now,
    });
    // #endregion

    // #region (Display)
    const [totalSales, setTotalSales] = useState<number | undefined>();
    const [totalVolumes, setTotalVolumes] = useState<number | undefined>();
    // #endregion

    return (
        <div id="MarketplaceDashboard" className="scrollbar">
            <div className="container">
                <div className="title-wrapper">
                    <div className="title">
                        <Loading loading={!ready}>
                            {t("dashboard", {
                                defaultValue: "Dashboard",
                            })}
                        </Loading>
                    </div>
                    <section className="marketplace-filter">
                        <div>
                            <div className="select-label">
                                <Loading loading={!ready}>
                                    {t("marketplace", {
                                        defaultValue: "Marketplace",
                                    })}
                                </Loading>
                            </div>
                            <MarketplaceSelect
                                value={marketplace}
                                onChange={handleMarketplaceChange}
                            />
                        </div>
                    </section>
                </div>
                <section className="marketplace-stat">
                    <div className="stat-wrapper">
                        <div className="stat">
                            <div className="logo">
                                <ImageTag
                                    src={`${process.env.PUBLIC_URL}/assets/images/icons/sale.svg`}
                                    width="50px"
                                    height="auto"
                                    alt="sale"
                                />
                            </div>
                            <MarketplaceTotalSale
                                marketplace={marketplace}
                                littleGhostsLgData={littleGhostsLgData}
                                littleGhostsPcsData={littleGhostsPcsData}
                                skeletonLgData={skeletonLgData}
                                skeletonPcsData={skeletonPcsData}
                            />
                        </div>
                    </div>
                    <div className="stat-wrapper">
                        <div className="stat">
                            <div className="logo">
                                <ImageTag
                                    src={`${process.env.PUBLIC_URL}/assets/images/icons/token_icons/bnb.svg`}
                                    width="50px"
                                    height="auto"
                                    alt="bnb"
                                />
                            </div>
                            <MarketplaceTotalVolume
                                marketplace={marketplace}
                                littleGhostsLgData={littleGhostsLgData}
                                littleGhostsPcsData={littleGhostsPcsData}
                                skeletonLgData={skeletonLgData}
                                skeletonPcsData={skeletonPcsData}
                            />
                        </div>
                    </div>
                </section>
                <section className="collection-stat">
                    <div className="collection-stat-header">
                        <CollectionStatTabs
                            tab={timeFrametab}
                            handleTabChange={handleTimeFrameTabChange}
                        />

                        <NftSelect value={nft} onChange={handleNftChange} />
                    </div>

                    <div className="stats">
                        <NftTotalSale
                            nft={nft}
                            marketplace={marketplace}
                            timeframe={timeFrametab}
                            littleGhostsLgData={littleGhostsLgData}
                            littleGhostsPcsData={littleGhostsPcsData}
                            skeletonLgData={skeletonLgData}
                            skeletonPcsData={skeletonPcsData}
                            littleGhosts24HrLgData={littleGhosts24HrLgData}
                            littleGhosts7dayLgData={littleGhosts7dayLgData}
                            littleGhosts30dayLgData={littleGhosts30dayLgData}
                            skeleton24HrLgData={skeleton24HrLgData}
                            skeleton7dayLgData={skeleton7dayLgData}
                            skeleton30dayLgData={skeleton30dayLgData}
                            littleGhosts24HrPcsData={littleGhosts24HrPcsData}
                            littleGhosts7dayPcsData={littleGhosts7dayPcsData}
                            littleGhosts30dayPcsData={littleGhosts30dayPcsData}
                            skeleton24HrPcsData={skeleton24HrPcsData}
                            skeleton7dayPcsData={skeleton7dayPcsData}
                            skeleton30dayPcsData={skeleton30dayPcsData}
                            onChange={setTotalSales}
                        />
                        <NftTotalVolume
                            nft={nft}
                            marketplace={marketplace}
                            timeframe={timeFrametab}
                            littleGhostsLgData={littleGhostsLgData}
                            littleGhostsPcsData={littleGhostsPcsData}
                            skeletonLgData={skeletonLgData}
                            skeletonPcsData={skeletonPcsData}
                            littleGhosts24HrLgData={littleGhosts24HrLgData}
                            littleGhosts7dayLgData={littleGhosts7dayLgData}
                            littleGhosts30dayLgData={littleGhosts30dayLgData}
                            skeleton24HrLgData={skeleton24HrLgData}
                            skeleton7dayLgData={skeleton7dayLgData}
                            skeleton30dayLgData={skeleton30dayLgData}
                            littleGhosts24HrPcsData={littleGhosts24HrPcsData}
                            littleGhosts7dayPcsData={littleGhosts7dayPcsData}
                            littleGhosts30dayPcsData={littleGhosts30dayPcsData}
                            skeleton24HrPcsData={skeleton24HrPcsData}
                            skeleton7dayPcsData={skeleton7dayPcsData}
                            skeleton30dayPcsData={skeleton30dayPcsData}
                            onChange={setTotalVolumes}
                        />
                        <NftAveragePrice
                            nft={nft}
                            totalSales={totalSales}
                            totalVolume={totalVolumes}
                        />
                    </div>
                    <RecentlySold nft={nft} marketplace={marketplace} />
                </section>
                <QuickSetting />
            </div>
        </div>
    );
};

const MarketplaceTotalSale = ({
    marketplace,
    littleGhostsLgData,
    littleGhostsPcsData,
    skeletonLgData,
    skeletonPcsData,
}: {
    marketplace: MarketplaceSelectValue;
    littleGhostsLgData: SubgraphCollection | null;
    littleGhostsPcsData: SubgraphCollection | null;
    skeletonLgData: SubgraphCollection | null;
    skeletonPcsData: SubgraphCollection | null;
}) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "MarketplaceDashboard",
    });

    const totalSale = useMemo(() => {
        if (
            marketplace === "littleghosts" &&
            littleGhostsLgData &&
            skeletonLgData
        ) {
            return (
                +littleGhostsLgData.totalTrades + +skeletonLgData.totalTrades
            );
        } else if (marketplace === "pancakeswap" && littleGhostsPcsData) {
            let _totalSale = +littleGhostsPcsData.totalTrades;
            if (skeletonPcsData) {
                _totalSale += +skeletonPcsData.totalTrades;
            }
            return _totalSale;
        } else if (
            marketplace === "all" &&
            littleGhostsLgData &&
            skeletonLgData &&
            littleGhostsPcsData
        ) {
            let _totalSale =
                +littleGhostsPcsData.totalTrades +
                +skeletonLgData.totalTrades +
                +littleGhostsLgData.totalTrades;
            if (skeletonPcsData) {
                _totalSale += +skeletonPcsData.totalTrades;
            }
            return _totalSale;
        }
        return undefined;
    }, [
        marketplace,
        littleGhostsLgData,
        littleGhostsPcsData,
        skeletonLgData,
        skeletonPcsData,
    ]);

    return (
        <div className="label-and-value">
            <div className="label">
                <Loading loading={!ready}>
                    {t("total_sale", {
                        defaultValue: "Total Sale",
                    })}
                </Loading>
            </div>
            <div className="value">
                <Loading loading={isUndefined(totalSale)}>
                    {totalSale?.toLocaleString()}
                </Loading>
            </div>
        </div>
    );
};

const MarketplaceTotalVolume = ({
    marketplace,
    littleGhostsLgData,
    littleGhostsPcsData,
    skeletonLgData,
    skeletonPcsData,
}: {
    marketplace: MarketplaceSelectValue;
    littleGhostsLgData: SubgraphCollection | null;
    littleGhostsPcsData: SubgraphCollection | null;
    skeletonLgData: SubgraphCollection | null;
    skeletonPcsData: SubgraphCollection | null;
}) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "MarketplaceDashboard",
    });

    const bnbPrice = useBnbPriceInUsd();
    const totalVolume: number | undefined = useMemo(() => {
        if (
            marketplace === "littleghosts" &&
            littleGhostsLgData &&
            skeletonLgData
        ) {
            return (
                +littleGhostsLgData.totalVolumeBNB +
                +skeletonLgData.totalVolumeBNB
            );
        } else if (marketplace === "pancakeswap" && littleGhostsPcsData) {
            let _totalVolume = +littleGhostsPcsData.totalVolumeBNB;
            if (skeletonPcsData) {
                _totalVolume += +skeletonPcsData.totalVolumeBNB;
            }
            return _totalVolume;
        } else if (
            marketplace === "all" &&
            littleGhostsLgData &&
            skeletonLgData &&
            littleGhostsPcsData
        ) {
            let _totalVolume =
                +littleGhostsLgData.totalVolumeBNB +
                +skeletonLgData.totalVolumeBNB +
                +littleGhostsPcsData.totalVolumeBNB;
            if (skeletonPcsData) {
                _totalVolume += +skeletonPcsData.totalVolumeBNB;
            }
            return _totalVolume;
        }
        return undefined;
    }, [
        marketplace,
        littleGhostsLgData,
        littleGhostsPcsData,
        skeletonLgData,
        skeletonPcsData,
    ]);

    const usd = useMemo(() => {
        if (bnbPrice && totalVolume) {
            return getHumanReadableLargeNumber({
                number: bnbPrice * totalVolume,
                precision: 2,
            });
        }
        return undefined;
    }, [bnbPrice, totalVolume]);

    return (
        <div className="label-and-value">
            <div className="label">
                <Loading loading={!ready}>
                    {t("total_volume", {
                        defaultValue: "Total Volume",
                    })}
                </Loading>
            </div>
            <div className="value">
                <Loading loading={isUndefined(totalVolume)}>
                    <span>Ξ</span>
                    <span className="volume">{totalVolume?.toFixed(2)}</span>
                </Loading>
                <span className="usd">
                    <Loading loading={isUndefined(usd)}>
                        ${usd?.number}
                        {usd?.unit}
                    </Loading>
                </span>
            </div>
        </div>
    );
};

const NftTotalSale = ({
    nft,
    marketplace,
    timeframe,
    littleGhostsLgData,
    littleGhostsPcsData,
    skeletonLgData,
    skeletonPcsData,
    littleGhosts24HrLgData,
    littleGhosts7dayLgData,
    littleGhosts30dayLgData,
    skeleton24HrLgData,
    skeleton7dayLgData,
    skeleton30dayLgData,
    littleGhosts24HrPcsData,
    littleGhosts7dayPcsData,
    littleGhosts30dayPcsData,
    skeleton24HrPcsData,
    skeleton7dayPcsData,
    skeleton30dayPcsData,
    onChange,
}: {
    nft: NftSelectValue;
    marketplace: MarketplaceSelectValue;
    timeframe: number;
    littleGhostsLgData: SubgraphCollection | null;
    littleGhostsPcsData: SubgraphCollection | null;
    skeletonLgData: SubgraphCollection | null;
    skeletonPcsData: SubgraphCollection | null;
    littleGhosts24HrLgData: Array<SubgraphTransaction> | null;
    littleGhosts7dayLgData: Array<SubgraphCollectionDay> | null;
    littleGhosts30dayLgData: Array<SubgraphCollectionDay> | null;
    skeleton24HrLgData: Array<SubgraphTransaction> | null;
    skeleton7dayLgData: Array<SubgraphCollectionDay> | null;
    skeleton30dayLgData: Array<SubgraphCollectionDay> | null;
    littleGhosts24HrPcsData: Array<SubgraphTransaction> | null;
    littleGhosts7dayPcsData: Array<SubgraphCollectionDay> | null;
    littleGhosts30dayPcsData: Array<SubgraphCollectionDay> | null;
    skeleton24HrPcsData: Array<SubgraphTransaction> | null;
    skeleton7dayPcsData: Array<SubgraphCollectionDay> | null;
    skeleton30dayPcsData: Array<SubgraphCollectionDay> | null;
    onChange: Dispatch<SetStateAction<number | undefined>>;
}) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "MarketplaceDashboard",
    });

    const totalSale = useMemo(() => {
        if (marketplace === "littleghosts") {
            if (nft === "ghost") {
                if (timeframe === timeframes.all && littleGhostsLgData) {
                    return +littleGhostsLgData.totalTrades;
                } else if (
                    timeframe === timeframes.hr24 &&
                    littleGhosts24HrLgData
                ) {
                    return littleGhosts24HrLgData.length;
                } else if (
                    timeframe === timeframes.day7 &&
                    littleGhosts7dayLgData
                ) {
                    return littleGhosts7dayLgData.reduce((prev, curr) => {
                        return prev + +curr.dailyTrades;
                    }, 0);
                } else if (
                    timeframe === timeframes.day30 &&
                    littleGhosts30dayLgData
                ) {
                    return littleGhosts30dayLgData.reduce((prev, curr) => {
                        return prev + +curr.dailyTrades;
                    }, 0);
                }
            } else if (nft === "skeleton") {
                if (timeframe === timeframes.all && skeletonLgData) {
                    return +skeletonLgData.totalTrades;
                } else if (
                    timeframe === timeframes.hr24 &&
                    skeleton24HrLgData
                ) {
                    return skeleton24HrLgData.length;
                } else if (
                    timeframe === timeframes.day7 &&
                    skeleton7dayLgData
                ) {
                    return skeleton7dayLgData.reduce((prev, curr) => {
                        return prev + +curr.dailyTrades;
                    }, 0);
                } else if (
                    timeframe === timeframes.day30 &&
                    skeleton30dayLgData
                ) {
                    return skeleton30dayLgData.reduce((prev, curr) => {
                        return prev + +curr.dailyTrades;
                    }, 0);
                }
            }
        } else if (marketplace === "pancakeswap") {
            if (nft === "ghost") {
                if (timeframe === timeframes.all && littleGhostsPcsData) {
                    return +littleGhostsPcsData.totalTrades;
                } else if (
                    timeframe === timeframes.hr24 &&
                    littleGhosts24HrPcsData
                ) {
                    return littleGhosts24HrPcsData.length;
                } else if (
                    timeframe === timeframes.day7 &&
                    littleGhosts7dayPcsData
                ) {
                    return littleGhosts7dayPcsData.reduce((prev, curr) => {
                        return prev + +curr.dailyTrades;
                    }, 0);
                } else if (
                    timeframe === timeframes.day30 &&
                    littleGhosts30dayPcsData
                ) {
                    return littleGhosts30dayPcsData.reduce((prev, curr) => {
                        return prev + +curr.dailyTrades;
                    }, 0);
                }
            } else if (nft === "skeleton") {
                if (timeframe === timeframes.all && skeletonPcsData) {
                    return +skeletonPcsData.totalTrades;
                } else if (
                    timeframe === timeframes.hr24 &&
                    skeleton24HrPcsData
                ) {
                    return skeleton24HrPcsData.length;
                } else if (
                    timeframe === timeframes.day7 &&
                    skeleton7dayPcsData
                ) {
                    return skeleton7dayPcsData.reduce((prev, curr) => {
                        return prev + +curr.dailyTrades;
                    }, 0);
                } else if (
                    timeframe === timeframes.day30 &&
                    skeleton30dayPcsData
                ) {
                    return skeleton30dayPcsData.reduce((prev, curr) => {
                        return prev + +curr.dailyTrades;
                    }, 0);
                }
                return 0;
            }
        } else if (marketplace === "all") {
            if (nft === "ghost") {
                if (
                    timeframe === timeframes.all &&
                    littleGhostsLgData &&
                    littleGhostsPcsData
                ) {
                    return (
                        +littleGhostsLgData.totalTrades +
                        +littleGhostsPcsData.totalTrades
                    );
                } else if (
                    timeframe === timeframes.hr24 &&
                    littleGhosts24HrLgData &&
                    littleGhosts24HrPcsData
                ) {
                    return (
                        littleGhosts24HrLgData.length +
                        littleGhosts24HrPcsData.length
                    );
                } else if (
                    timeframe === timeframes.day7 &&
                    littleGhosts7dayLgData &&
                    littleGhosts7dayPcsData
                ) {
                    return (
                        littleGhosts7dayLgData.reduce((prev, curr) => {
                            return prev + +curr.dailyTrades;
                        }, 0) +
                        littleGhosts7dayPcsData.reduce((prev, curr) => {
                            return prev + +curr.dailyTrades;
                        }, 0)
                    );
                } else if (
                    timeframe === timeframes.day30 &&
                    littleGhosts30dayLgData &&
                    littleGhosts30dayPcsData
                ) {
                    return (
                        littleGhosts30dayLgData.reduce((prev, curr) => {
                            return prev + +curr.dailyTrades;
                        }, 0) +
                        littleGhosts30dayPcsData.reduce((prev, curr) => {
                            return prev + +curr.dailyTrades;
                        }, 0)
                    );
                }
            } else if (nft === "skeleton") {
                if (timeframe === timeframes.all && skeletonLgData) {
                    if (!skeletonPcsData) {
                        return +skeletonLgData.totalTrades;
                    }
                    return (
                        +skeletonLgData.totalTrades +
                        +skeletonPcsData.totalTrades
                    );
                } else if (
                    timeframe === timeframes.hr24 &&
                    skeleton24HrLgData
                ) {
                    if (!skeleton24HrPcsData) {
                        return skeleton24HrLgData.length;
                    }
                    return (
                        skeleton24HrLgData.length + skeleton24HrPcsData.length
                    );
                } else if (
                    timeframe === timeframes.day7 &&
                    skeleton7dayLgData &&
                    skeleton7dayPcsData
                ) {
                    if (!skeleton7dayPcsData) {
                        return skeleton7dayLgData.reduce((prev, curr) => {
                            return prev + +curr.dailyTrades;
                        }, 0);
                    }
                    return (
                        skeleton7dayLgData.reduce((prev, curr) => {
                            return prev + +curr.dailyTrades;
                        }, 0) +
                        skeleton7dayPcsData.reduce((prev, curr) => {
                            return prev + +curr.dailyTrades;
                        }, 0)
                    );
                } else if (
                    timeframe === timeframes.day30 &&
                    skeleton30dayLgData
                ) {
                    if (!skeleton7dayPcsData) {
                        return skeleton30dayLgData.reduce((prev, curr) => {
                            return prev + +curr.dailyTrades;
                        }, 0);
                    }
                    return (
                        skeleton30dayLgData.reduce((prev, curr) => {
                            return prev + +curr.dailyTrades;
                        }, 0) +
                        skeleton7dayPcsData.reduce((prev, curr) => {
                            return prev + +curr.dailyTrades;
                        }, 0)
                    );
                }
            }
        }
        return undefined;
    }, [
        nft,
        marketplace,
        timeframe,
        littleGhostsLgData,
        littleGhostsPcsData,
        skeletonLgData,
        skeletonPcsData,
        littleGhosts24HrLgData,
        littleGhosts7dayLgData,
        littleGhosts30dayLgData,
        skeleton24HrLgData,
        skeleton7dayLgData,
        skeleton30dayLgData,
        littleGhosts24HrPcsData,
        littleGhosts7dayPcsData,
        littleGhosts30dayPcsData,
        skeleton24HrPcsData,
        skeleton7dayPcsData,
        skeleton30dayPcsData,
    ]);

    useEffect(() => {
        if (onChange) {
            onChange(totalSale);
        }
    }, [totalSale, onChange]);
    return (
        <div className="stat">
            <div className="icon">
                <ImageTag
                    src={`${process.env.PUBLIC_URL}/assets/images/icons/sale.svg`}
                    width="50px"
                    height="auto"
                    alt="sale"
                />
            </div>
            <div className="label-and-value">
                <div className="label">
                    <Loading loading={!ready}>
                        {t("total_sale", {
                            defaultValue: "Total Sale",
                        })}
                    </Loading>
                </div>
                <div className="value">
                    <Loading loading={isUndefined(totalSale)}>
                        {totalSale?.toLocaleString()}
                    </Loading>
                </div>
            </div>
        </div>
    );
};

const NftTotalVolume = ({
    nft,
    marketplace,
    timeframe,
    littleGhostsLgData,
    littleGhostsPcsData,
    skeletonLgData,
    skeletonPcsData,
    littleGhosts24HrLgData,
    littleGhosts7dayLgData,
    littleGhosts30dayLgData,
    skeleton24HrLgData,
    skeleton7dayLgData,
    skeleton30dayLgData,
    littleGhosts24HrPcsData,
    littleGhosts7dayPcsData,
    littleGhosts30dayPcsData,
    skeleton24HrPcsData,
    skeleton7dayPcsData,
    skeleton30dayPcsData,
    onChange,
}: {
    nft: NftSelectValue;
    marketplace: MarketplaceSelectValue;
    timeframe: number;
    littleGhostsLgData: SubgraphCollection | null;
    littleGhostsPcsData: SubgraphCollection | null;
    skeletonLgData: SubgraphCollection | null;
    skeletonPcsData: SubgraphCollection | null;
    littleGhosts24HrLgData: Array<SubgraphTransaction> | null;
    littleGhosts7dayLgData: Array<SubgraphCollectionDay> | null;
    littleGhosts30dayLgData: Array<SubgraphCollectionDay> | null;
    skeleton24HrLgData: Array<SubgraphTransaction> | null;
    skeleton7dayLgData: Array<SubgraphCollectionDay> | null;
    skeleton30dayLgData: Array<SubgraphCollectionDay> | null;
    littleGhosts24HrPcsData: Array<SubgraphTransaction> | null;
    littleGhosts7dayPcsData: Array<SubgraphCollectionDay> | null;
    littleGhosts30dayPcsData: Array<SubgraphCollectionDay> | null;
    skeleton24HrPcsData: Array<SubgraphTransaction> | null;
    skeleton7dayPcsData: Array<SubgraphCollectionDay> | null;
    skeleton30dayPcsData: Array<SubgraphCollectionDay> | null;
    onChange: Dispatch<SetStateAction<number | undefined>>;
}) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "MarketplaceDashboard",
    });

    const bnbPrice = useBnbPriceInUsd();
    const totalVolume = useMemo(() => {
        if (marketplace === "littleghosts") {
            if (nft === "ghost") {
                if (timeframe === timeframes.all && littleGhostsLgData) {
                    return +littleGhostsLgData.totalVolumeBNB;
                } else if (
                    timeframe === timeframes.hr24 &&
                    littleGhosts24HrLgData
                ) {
                    return littleGhosts24HrLgData.reduce((prev, curr) => {
                        return prev + +curr.askPrice;
                    }, 0);
                } else if (
                    timeframe === timeframes.day7 &&
                    littleGhosts7dayLgData
                ) {
                    return littleGhosts7dayLgData.reduce((prev, curr) => {
                        return prev + +curr.dailyVolumeBNB;
                    }, 0);
                } else if (
                    timeframe === timeframes.day30 &&
                    littleGhosts30dayLgData
                ) {
                    return littleGhosts30dayLgData.reduce((prev, curr) => {
                        return prev + +curr.dailyVolumeBNB;
                    }, 0);
                }
            } else if (nft === "skeleton") {
                if (timeframe === timeframes.all && skeletonLgData) {
                    return +skeletonLgData.totalVolumeBNB;
                } else if (
                    timeframe === timeframes.hr24 &&
                    skeleton24HrLgData
                ) {
                    return skeleton24HrLgData.reduce((prev, curr) => {
                        return prev + +curr.askPrice;
                    }, 0);
                } else if (
                    timeframe === timeframes.day7 &&
                    skeleton7dayLgData
                ) {
                    return skeleton7dayLgData.reduce((prev, curr) => {
                        return prev + +curr.dailyVolumeBNB;
                    }, 0);
                } else if (
                    timeframe === timeframes.day30 &&
                    skeleton30dayLgData
                ) {
                    return skeleton30dayLgData.reduce((prev, curr) => {
                        return prev + +curr.dailyVolumeBNB;
                    }, 0);
                }
            }
        } else if (marketplace === "pancakeswap") {
            if (nft === "ghost") {
                if (timeframe === timeframes.all && littleGhostsPcsData) {
                    return +littleGhostsPcsData.totalVolumeBNB;
                } else if (
                    timeframe === timeframes.hr24 &&
                    littleGhosts24HrPcsData
                ) {
                    return littleGhosts24HrPcsData.reduce((prev, curr) => {
                        return prev + +curr.askPrice;
                    }, 0);
                } else if (
                    timeframe === timeframes.day7 &&
                    littleGhosts7dayPcsData
                ) {
                    return littleGhosts7dayPcsData.reduce((prev, curr) => {
                        return prev + +curr.dailyVolumeBNB;
                    }, 0);
                } else if (
                    timeframe === timeframes.day30 &&
                    littleGhosts30dayPcsData
                ) {
                    return littleGhosts30dayPcsData.reduce((prev, curr) => {
                        return prev + +curr.dailyVolumeBNB;
                    }, 0);
                }
            } else if (nft === "skeleton") {
                if (timeframe === timeframes.all && skeletonPcsData) {
                    return +skeletonPcsData.totalVolumeBNB;
                } else if (
                    timeframe === timeframes.hr24 &&
                    skeleton24HrPcsData
                ) {
                    return skeleton24HrPcsData.reduce((prev, curr) => {
                        return prev + +curr.askPrice;
                    }, 0);
                } else if (
                    timeframe === timeframes.day7 &&
                    skeleton7dayPcsData
                ) {
                    return skeleton7dayPcsData.reduce((prev, curr) => {
                        return prev + +curr.dailyVolumeBNB;
                    }, 0);
                } else if (
                    timeframe === timeframes.day30 &&
                    skeleton30dayPcsData
                ) {
                    return skeleton30dayPcsData.reduce((prev, curr) => {
                        return prev + +curr.dailyVolumeBNB;
                    }, 0);
                }
                return 0;
            }
        } else if (marketplace === "all") {
            if (nft === "ghost") {
                if (
                    timeframe === timeframes.all &&
                    littleGhostsLgData &&
                    littleGhostsPcsData
                ) {
                    return (
                        +littleGhostsLgData.totalVolumeBNB +
                        +littleGhostsPcsData.totalVolumeBNB
                    );
                } else if (
                    timeframe === timeframes.hr24 &&
                    littleGhosts24HrLgData &&
                    littleGhosts24HrPcsData
                ) {
                    return (
                        littleGhosts24HrLgData.reduce((prev, curr) => {
                            return prev + +curr.askPrice;
                        }, 0) +
                        littleGhosts24HrPcsData.reduce((prev, curr) => {
                            return prev + +curr.askPrice;
                        }, 0)
                    );
                } else if (
                    timeframe === timeframes.day7 &&
                    littleGhosts7dayLgData &&
                    littleGhosts7dayPcsData
                ) {
                    return (
                        littleGhosts7dayLgData.reduce((prev, curr) => {
                            return prev + +curr.dailyVolumeBNB;
                        }, 0) +
                        littleGhosts7dayPcsData.reduce((prev, curr) => {
                            return prev + +curr.dailyVolumeBNB;
                        }, 0)
                    );
                } else if (
                    timeframe === timeframes.day30 &&
                    littleGhosts30dayLgData &&
                    littleGhosts30dayPcsData
                ) {
                    return (
                        littleGhosts30dayLgData.reduce((prev, curr) => {
                            return prev + +curr.dailyVolumeBNB;
                        }, 0) +
                        littleGhosts30dayPcsData.reduce((prev, curr) => {
                            return prev + +curr.dailyVolumeBNB;
                        }, 0)
                    );
                }
            } else if (nft === "skeleton") {
                if (timeframe === timeframes.all && skeletonLgData) {
                    if (!skeletonPcsData) {
                        return +skeletonLgData.totalVolumeBNB;
                    }
                    return (
                        +skeletonLgData.totalVolumeBNB +
                        +skeletonPcsData.totalVolumeBNB
                    );
                } else if (
                    timeframe === timeframes.hr24 &&
                    skeleton24HrLgData
                ) {
                    if (!skeleton24HrPcsData) {
                        return skeleton24HrLgData.reduce((prev, curr) => {
                            return prev + +curr.askPrice;
                        }, 0);
                    }
                    return (
                        skeleton24HrLgData.reduce((prev, curr) => {
                            return prev + +curr.askPrice;
                        }, 0) +
                        skeleton24HrPcsData.reduce((prev, curr) => {
                            return prev + +curr.askPrice;
                        }, 0)
                    );
                } else if (
                    timeframe === timeframes.day7 &&
                    skeleton7dayLgData &&
                    skeleton7dayPcsData
                ) {
                    if (!skeleton7dayPcsData) {
                        return skeleton7dayLgData.reduce((prev, curr) => {
                            return prev + +curr.dailyVolumeBNB;
                        }, 0);
                    }
                    return (
                        skeleton7dayLgData.reduce((prev, curr) => {
                            return prev + +curr.dailyVolumeBNB;
                        }, 0) +
                        skeleton7dayPcsData.reduce((prev, curr) => {
                            return prev + +curr.dailyVolumeBNB;
                        }, 0)
                    );
                } else if (
                    timeframe === timeframes.day30 &&
                    skeleton30dayLgData
                ) {
                    if (!skeleton7dayPcsData) {
                        return skeleton30dayLgData.reduce((prev, curr) => {
                            return prev + +curr.dailyVolumeBNB;
                        }, 0);
                    }
                    return (
                        skeleton30dayLgData.reduce((prev, curr) => {
                            return prev + +curr.dailyVolumeBNB;
                        }, 0) +
                        skeleton7dayPcsData.reduce((prev, curr) => {
                            return prev + +curr.dailyVolumeBNB;
                        }, 0)
                    );
                }
            }
        }
        return undefined;
    }, [
        nft,
        marketplace,
        timeframe,
        littleGhostsLgData,
        littleGhostsPcsData,
        skeletonLgData,
        skeletonPcsData,
        littleGhosts24HrLgData,
        littleGhosts7dayLgData,
        littleGhosts30dayLgData,
        skeleton24HrLgData,
        skeleton7dayLgData,
        skeleton30dayLgData,
        littleGhosts24HrPcsData,
        littleGhosts7dayPcsData,
        littleGhosts30dayPcsData,
        skeleton24HrPcsData,
        skeleton7dayPcsData,
        skeleton30dayPcsData,
    ]);

    const totalVolumeReadble = useMemo(() => {
        if (isUndefined(totalVolume)) {
            return undefined;
        }
        return getHumanReadableLargeNumber({
            number: totalVolume,
            precision: 2,
        });
    }, [totalVolume]);

    const totalVolumeUsd = useMemo(() => {
        if (isUndefined(totalVolume) || !bnbPrice) {
            return undefined;
        }
        return getHumanReadableLargeNumber({
            number: totalVolume * bnbPrice,
            precision: 2,
        });
    }, [totalVolume, bnbPrice]);

    useEffect(() => {
        if (onChange) {
            onChange(totalVolume);
        }
    }, [totalVolume, onChange]);
    return (
        <div className="stat">
            <div className="icon">
                <ImageTag
                    src={`${process.env.PUBLIC_URL}/assets/images/icons/token_icons/bnb.svg`}
                    width="50px"
                    height="auto"
                    alt="bnb"
                />
            </div>
            <div className="label-and-value">
                <div className="label">
                    <Loading loading={!ready}>
                        {t("total_volume", { defaultValue: "Total Volume" })}
                    </Loading>
                </div>
                <div className="value">
                    <Loading loading={isUndefined(totalVolumeReadble)}>
                        <span>Ξ</span>
                        <span className="volume">
                            {totalVolumeReadble?.number}
                            {totalVolumeReadble?.unit}
                        </span>
                    </Loading>
                    <span className="usd">
                        <Loading loading={isUndefined(totalVolumeReadble)}>
                            ${totalVolumeUsd?.number}
                            {totalVolumeUsd?.unit}
                        </Loading>
                    </span>
                </div>
            </div>
        </div>
    );
};

const NftAveragePrice = ({
    nft,
    totalSales,
    totalVolume,
}: {
    nft: NftSelectValue;
    totalSales: number | undefined;
    totalVolume: number | undefined;
}) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "MarketplaceDashboard",
    });

    const bnbPrice = useBnbPriceInUsd();

    const averageBnbPrice = useMemo(() => {
        if (isNumber(totalSales) && isNumber(totalVolume)) {
            if (totalSales === 0) {
                return 0;
            }
            return getHumanReadableLargeNumber({
                number: totalVolume / totalSales,
                precision: 2,
            });
        }
        return undefined;
    }, [totalSales, totalVolume]);

    const averageUsdPrice = useMemo(() => {
        if (isNumber(totalSales) && isNumber(totalVolume) && bnbPrice) {
            if (totalSales === 0) {
                return 0;
            }
            return getHumanReadableLargeNumber({
                number: (totalVolume / totalSales) * bnbPrice,
                precision: 2,
            });
        }
        return undefined;
    }, [totalSales, totalVolume, bnbPrice]);

    return (
        <div className="stat">
            <div className="icon">
                {nft === "ghost" ? (
                    <ImageTag
                        src={`${process.env.PUBLIC_URL}/assets/images/icons/Ghosts_filled.svg`}
                        width="50px"
                        height="auto"
                        alt="ghost"
                    />
                ) : (
                    <ImageTag
                        src={`${process.env.PUBLIC_URL}/assets/images/icons/Skeletons_filled.png`}
                        width="50px"
                        height="auto"
                        alt="skeleton"
                    />
                )}
            </div>
            <div className="label-and-value">
                <div className="label">
                    <Loading loading={!ready}>
                        {t("average_price", { defaultValue: "Average Price" })}
                    </Loading>
                </div>
                <div className="value">
                    <Loading loading={isUndefined(averageBnbPrice)}>
                        <span>Ξ</span>
                        <span className="volume">
                            {averageBnbPrice === 0 ? (
                                0
                            ) : (
                                <>
                                    {averageBnbPrice?.number}
                                    {averageBnbPrice?.unit}
                                </>
                            )}
                        </span>
                    </Loading>
                    <span className="usd">
                        <Loading loading={isUndefined(averageUsdPrice)}>
                            $
                            {averageUsdPrice === 0 ? (
                                0
                            ) : (
                                <>
                                    {averageUsdPrice?.number}
                                    {averageUsdPrice?.unit}
                                </>
                            )}
                        </Loading>
                    </span>
                </div>
            </div>
        </div>
    );
};

const RecentlySold = ({
    nft,
    marketplace,
}: {
    nft: NftSelectValue;
    marketplace: MarketplaceSelectValue;
}) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "MarketplaceDashboard",
    });

    const [viewType, setViewType] = useState(viewTypes.GRID_VIEW);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const [nfts, setNfts] = useState([] as Array<RecentlySoldCollectionItem>);

    const nftsPerPage = useNftsPerPage();

    useEffect(() => {
        if (!marketplace || !page || !nft) {
            return () => {};
        }

        const collection =
            nft === "ghost"
                ? littleGhostNFTAddress
                : nft === "skeleton"
                ? ectoSkeletonNFTAddress
                : "";
        if (!collection) {
            return () => {};
        }
        let mounted = true;
        fetchRecentlySoldCollectionItems({
            blockchain: blockchains.BSC,
            marketplace,
            collection,
            params: {
                limit: nftsPerPage,
                offset: (page - 1) * nftsPerPage,
            },
        }).then((res) => {
            if (mounted) {
                setNfts(res.data ?? []);
                setPages(res.pages ?? 0);
            }
        }).catch(() => {});

        return () => {
            mounted = false;
        };
    }, [marketplace, page, nft, nftsPerPage]);

    return (
        <div className="RecentlySold">
            <div className="header">
                <div className="title">
                    <Loading loading={!ready}>
                        {t("recently_sold", { defaultValue: "Recently Sold" })}
                    </Loading>
                </div>
                <LayoutButtonGroup
                    viewType={viewType}
                    handleViewTypeChange={(_viewType) => {
                        setViewType(_viewType);
                    }}
                />
            </div>
            <section className="nft-section">
                <div className={`nfts ${viewType}`}>
                    {(nfts ?? []).map((nft) => {
                        return viewType === viewTypes.GRID_VIEW ? (
                            <NftCard
                                key={`${nft.blockchain_id}-${nft.transaction_hash}`}
                                pathPrefix={`/marketplace/${
                                    nft.collection_address ===
                                    littleGhostNFTAddress
                                        ? "ghost"
                                        : nft.collection_address ===
                                          ectoSkeletonNFTAddress
                                        ? "skeleton"
                                        : ""
                                }`}
                                item={{
                                    marketplace:
                                        nft.marketplace_address ===
                                        littleGhostsMarketContractAddress
                                            ? marketplaceTypes.LG_MARKETPLACE
                                            : nft.marketplace_address ===
                                              pancakeSwapNftMarketContractAddress
                                            ? marketplaceTypes.PANCAKESWAP
                                            : "",
                                    token_id: nft.id,
                                    name: nft.collection_name,
                                    rank: nft.rank,
                                    price: Web3.utils.toWei(nft.ask_price),
                                    image_3d: nft.image_3d,
                                    image_png: nft.image_png,
                                    image_gif: nft.image_gif,
                                    token_image_ext: nft.token_image_ext,
                                    sold_timestamp: nft.timestamp,
                                }}
                            />
                        ) : (
                            <NftDetailCard
                                key={`${nft.blockchain_id}-${nft.transaction_hash}`}
                                pathPrefix={`/marketplace/${
                                    nft.collection_address ===
                                    littleGhostNFTAddress
                                        ? "ghost"
                                        : nft.collection_address ===
                                          ectoSkeletonNFTAddress
                                        ? "skeleton"
                                        : ""
                                }`}
                                item={{
                                    marketplace:
                                        nft.marketplace_address ===
                                        littleGhostsMarketContractAddress
                                            ? marketplaceTypes.LG_MARKETPLACE
                                            : nft.marketplace_address ===
                                              pancakeSwapNftMarketContractAddress
                                            ? marketplaceTypes.PANCAKESWAP
                                            : "",
                                    token_id: nft.id,
                                    name: nft.collection_name,
                                    rank: nft.rank,
                                    trait_type_value: nft.trait_type_value,
                                    price: Web3.utils.toWei(nft.ask_price),
                                    image_3d: nft.image_3d,
                                    image_png: nft.image_png,
                                    image_gif: nft.image_gif,
                                    token_image_ext: nft.token_image_ext,
                                    sold_timestamp: nft.timestamp,
                                }}
                            />
                        );
                    })}
                </div>
                <JumpablePagination
                    currentPage={page}
                    pages={pages}
                    onChange={(newPage) => {
                        setPage(newPage);
                    }}
                />
            </section>
        </div>
    );
};
export default MarketplaceDashboard;
