import "./index.scss";

import { DexImageTag, ImageTag } from "../../../../utils/ImageUtil";
import {
    getAuctionExpireDisplay,
    getBidPriceInUsd,
    getBuyoutPriceInUsd,
} from "../../../../utils/AuctionUtil";
import {
    getPaymentTokenDecimals,
    getPaymentTokenDisplay,
} from "../../../../utils/funcs";
import { isString, isUndefined } from "lodash";
import {
    useBnbPriceInUsd,
    useEctoPriceInUsd,
} from "../../../../state/application/hooks";
import { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";
import Loading from "../../Loading";
import NftImage from "../../Image/NftImage";
import { blockchains } from "../../../../constants/Blockchains";
import { ectoContractAddress } from "../../../../constants/ContractAddresses";
import { fromSolidityTokenFormat } from "../../../../utils/MathUtil";
import { getHumanReadableLargeNumber } from "../../../../utils/NumberUtil";
import { getRecentlySoldDate } from "../../../../utils/DateUtil";
import { marketplaceTypes } from "../../../Marketplace/constants/marketplaceTypes";
import { useTranslation } from "react-i18next";
import { weiToBnb } from "../../../../utils/UnitUtil";
import BnbIcon from "../../../Icons/BnbIcon";

const marketplaceLogoSize = "40px";

const NftDetailCard = ({
    item,
    pathPrefix,
}: {
    item: {
        auctionID?: number;
        marketplace?: string;
        token_id: number;
        name: string;
        rank?: number;
        rankable?: number;
        trait_type_value: Record<string, string>;
        price?: string;
        paymentToken?: string;
        auction_price?: string;
        highestBidAmount?: string;
        minimumBidAmount?: string;
        bidOnly?: number;
        image_3d?: string;
        image_png?: string;
        image_gif?: string;
        token_image_ext: string;
        endBlock?: number;
        sold_timestamp?: number;
        status?: string;
        id?: number;
    };
    pathPrefix: string;
}) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "widgets.NftCard",
    });
    const { t: t_nft, ready: ready_nft } = useTranslation("translation", {
        keyPrefix: "CollectionNames",
    });
    const { t: t_trait, ready: ready_trait } = useTranslation("translation", {
        keyPrefix: "NftTraits",
    });
    const MarketplaceLogo = useMemo(() => {
        if (item.auctionID) {
            return (
                <ImageTag
                    height={marketplaceLogoSize}
                    width={marketplaceLogoSize}
                    src={`${process.env.PUBLIC_URL}/assets/images/icons/Hammer.png`}
                />
            );
        }
        if (item.marketplace === marketplaceTypes.LG_MARKETPLACE) {
            return (
                <ImageTag
                    height={marketplaceLogoSize}
                    width={marketplaceLogoSize}
                    src={`${process.env.PUBLIC_URL}/logo192.png`}
                />
            );
        }
        if (item.marketplace === marketplaceTypes.PANCAKESWAP) {
            return (
                <DexImageTag
                    chainID={blockchains.BSC}
                    height={marketplaceLogoSize}
                    width={marketplaceLogoSize}
                />
            );
        }
        return <></>;
    }, [item]);

    const soldDate = useMemo(() => {
        if (!item.sold_timestamp) {
            return "";
        }
        return getRecentlySoldDate(item.sold_timestamp);
    }, [item.sold_timestamp]);

    return (
        <Link
            to={`${pathPrefix}/${item.id ? item.id : item.token_id}`}
            className="widget NftDetailCard"
        >
            {item.sold_timestamp && (
                <div className="sold_timestamp">
                    {isString(soldDate) ? (
                        soldDate
                    ) : (
                        <>
                            {soldDate.days} {soldDate.unit} ago
                        </>
                    )}
                </div>
            )}
            <div className="nftDetailCard-header">
                <div>
                    <NftImage item={item} height="150px" width="150px" />
                </div>
                <div>
                    {MarketplaceLogo}
                    <div className="id mt-3">
                        <Loading loading={!ready_nft}>
                            {t_nft(item.name, { defaultValue: item.name })} #
                            {item.id ? item.id : item.token_id}
                        </Loading>
                    </div>
                    {!!item.rankable && !isUndefined(item.rank) && (
                        <div className="rank mb-3">
                            <Loading loading={!ready}>
                                {t("rank", { defaultValue: "Rank" })}:{" "}
                                {item.rank}
                            </Loading>
                        </div>
                    )}
                    {item.status && (
                        <div className="status mb-3">
                            <Loading loading={!ready}>
                                {t("status", { defaultValue: "Status" })}:{" "}
                                {item.status}
                            </Loading>
                        </div>
                    )}
                    <NftDetailCardPriceContent item={item} />
                </div>
            </div>
            <div className="nftDetailCard-body">
                {Object.keys(item.trait_type_value)
                    .sort()
                    .map((key) => {
                        return (
                            <div className="attribute-row">
                                <div>
                                    <Loading loading={!ready_trait}>
                                        {t_trait(key, { defaultValue: key })}
                                    </Loading>
                                </div>
                                <div>
                                    <Loading loading={!ready_trait}>
                                        {t_trait(item.trait_type_value[key], {
                                            defaultValue:
                                                item.trait_type_value[key],
                                        })}
                                    </Loading>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </Link>
    );
};

const NftDetailCardPriceContent = ({
    item,
}: {
    item: {
        auctionID?: number;
        marketplace?: string;
        price?: string;
        paymentToken?: string;
        auction_price?: string;
        highestBidAmount?: string;
        minimumBidAmount?: string;
        bidOnly?: number;
        endBlock?: number;
    };
}) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "widgets.NftCard",
    });

    const [currentTime, setCurrentTime] = useState(new Date().getTime());
    const bnbPrice = useBnbPriceInUsd();
    const ectoPrice = useEctoPriceInUsd();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date().getTime());
        }, 60000); // a minute

        return () => {
            clearInterval(interval);
        };
    }, []);

    const isAuction = useMemo(() => {
        if (item.auctionID) {
            return true;
        }
        return false;
    }, [item.auctionID]);

    const isOnSale = useMemo(() => {
        if (item.marketplace) {
            return true;
        }
        return false;
    }, [item]);

    const Footer = useMemo(() => {
        if (!isOnSale && !isAuction) {
            return <div> </div>;
        }

        if (isOnSale) {
            const bnb = +(+weiToBnb({ wei: item.price || "" }).toFixed(3));
            return (
                <div className="on-sale">
                    <BnbIcon /> {bnb}
                    {/* <span className="usd">
                        $
                        {
                            +(
                                bnbPrice * +weiToBnb({ wei: item.price || "" })
                            ).toFixed(2)
                        }
                    </span> */}
                </div>
            );
        }

        const auctionExpiredDisplay = getAuctionExpireDisplay({
            item,
            currentTime,
        });

        const paymentTokenDisplay = getPaymentTokenDisplay(
            item.paymentToken || ""
        );

        const paymentTokenDecimals = getPaymentTokenDecimals(
            item.paymentToken || ""
        );

        const paymentAmount =
            item.paymentToken?.toLowerCase() === ectoContractAddress
                ? getHumanReadableLargeNumber({
                      number: +fromSolidityTokenFormat(
                          item.auction_price || "",
                          paymentTokenDecimals
                      ),
                      precision: 0,
                  })
                : (+fromSolidityTokenFormat(
                      item.auction_price || "",
                      paymentTokenDecimals
                  )).toLocaleString();

        let bidAmount =
            item.paymentToken?.toLowerCase() === ectoContractAddress
                ? getHumanReadableLargeNumber({
                      number:
                          item.highestBidAmount && +item.highestBidAmount
                              ? +fromSolidityTokenFormat(
                                    item.highestBidAmount || "",
                                    paymentTokenDecimals
                                )
                              : +fromSolidityTokenFormat(
                                    item.minimumBidAmount || "",
                                    paymentTokenDecimals
                                ),
                      precision: 0,
                  })
                : (+fromSolidityTokenFormat(
                      item.highestBidAmount && +item.highestBidAmount
                          ? item.highestBidAmount
                          : item.minimumBidAmount || 0,
                      paymentTokenDecimals
                  )).toLocaleString();
        if (!isString(bidAmount)) {
            bidAmount = `${bidAmount.number}${bidAmount.unit} `;
        }

        return (
            <div className="auction">
                <div className="expires">
                    <div className="expires-label">
                        <Loading loading={!ready}>
                            {t("expires", { defaultValue: "Expires" })}:
                        </Loading>
                    </div>
                    <div className="expires-value">
                        <Loading loading={!ready}>
                            {auctionExpiredDisplay === "Expired"
                                ? t("expired", { defaultValue: "Expired" })
                                : `${auctionExpiredDisplay} ${t("hrs", {
                                      defaultValue: "hrs",
                                  })}`}
                        </Loading>
                    </div>
                </div>
                <div className="buyout">
                    <div className="buyout-label">
                        <Loading loading={!ready}>
                            {t("buyout", { defaultValue: "Buyout" })}:
                        </Loading>
                    </div>
                    <div className="buyout-value">
                        {item.bidOnly ? (
                            "N/A"
                        ) : (
                            <>
                                {paymentAmount + " $" + paymentTokenDisplay}
                                <span className="usd">
                                    ($
                                    {getBuyoutPriceInUsd(
                                        item,
                                        ectoPrice,
                                        bnbPrice
                                    )}
                                    )
                                </span>
                            </>
                        )}
                    </div>
                </div>
                <div className="current-bid">
                    <div className="current-bid-label">
                        <Loading loading={!ready}>
                            {item.highestBidAmount && +item.highestBidAmount
                                ? t("top_bid", { defaultValue: "Top Bid" })
                                : t("min_bid", { defaultValue: "Min Bid" })}
                            :
                        </Loading>
                    </div>
                    <div className="current-bid-value">
                        {bidAmount + " $" + paymentTokenDisplay}
                        <span className="usd">
                            ($
                            {getBidPriceInUsd(item, ectoPrice, bnbPrice)})
                        </span>
                    </div>
                </div>
            </div>
        );
    }, [isAuction, isOnSale, item, bnbPrice, currentTime, ectoPrice, ready, t]);

    return <div>{Footer}</div>;
};

export default NftDetailCard;
