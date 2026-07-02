import "./index.scss";

import { DexImageTag, ImageTag } from "../../../../utils/ImageUtil";
import { Menu, MenuItem } from "@mui/material";
import {
    SyntheticEvent,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
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
    usePreferredNftImageSize,
} from "../../../../state/application/hooks";

import IconButton from "../../Button/IconButton/IconButton";
import { Link } from "react-router-dom";
import Loading from "../../Loading";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import NftImage from "../../Image/NftImage";
import { blockchains } from "../../../../constants/Blockchains";
import { ectoContractAddress } from "../../../../constants/ContractAddresses";
import { fromSolidityTokenFormat } from "../../../../utils/MathUtil";
import { getHumanReadableLargeNumber } from "../../../../utils/NumberUtil";
import { getRecentlySoldDate } from "../../../../utils/DateUtil";
import { marketplaceTypes } from "../../../Marketplace/constants/marketplaceTypes";
import { useTranslation } from "react-i18next";
import { weiToBnb } from "../../../../utils/UnitUtil";

const marketplaceLogoSize = "40px";

type Action = {
    label: string;
    callback: (item?: any) => void;
};

const NftCard = ({
    item,
    pathPrefix,
    showAuctionDetail = false,
    actions,
    onClick,
}: {
    item: {
        auctionID?: number;
        marketplace?: string;
        token_id: number;
        name: string;
        rank?: number;
        rankable?: number;
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
        id?: number;
    };
    pathPrefix: string;
    showAuctionDetail?: boolean;
    actions?: Array<Action>;
    onClick?: () => void;
}) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "widgets.NftCard",
    });
    const { t: t_nft, ready: ready_nft } = useTranslation("translation", {
        keyPrefix: "CollectionNames",
    });
    const [moreAnchorEl, setMoreAnchorEl] = useState<any>(null);
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

    const handleOnClick = useCallback(
        (evt: any) => {
            if (
                evt.target.classList.contains("MuiBackdrop-root") ||
                evt.target.classList.contains("MuiMenuItem-root")
            ) {
                evt.stopPropagation();
                evt.preventDefault();
            }
            if (onClick) {
                onClick();
            }
        },
        [onClick]
    );

    const nftImageSize = usePreferredNftImageSize();

    const soldDate = useMemo(() => {
        if (!item.sold_timestamp) {
            return "";
        }
        return getRecentlySoldDate(item.sold_timestamp);
    }, [item.sold_timestamp]);

    const handleOnActionsClick = useCallback(
        (evt: SyntheticEvent<Element, Event>) => {
            evt.stopPropagation();
            evt.preventDefault();
            setMoreAnchorEl(evt.currentTarget);
        },
        []
    );

    const handleMoreActionMenuClose = useCallback(() => {
        setMoreAnchorEl(null);
    }, []);

    return (
        <Link
            to={
                pathPrefix
                    ? `${pathPrefix}/${item.id ? item.id : item.token_id}`
                    : ""
            }
            className="widget NftCard"
            onClick={handleOnClick}
            style={{
                height: `${nftImageSize}px`,
                width: `${nftImageSize * 0.8}px`,
            }}
        >
            {actions && !!actions.length && (
                <div className="actions">
                    <IconButton onClick={handleOnActionsClick}>
                        <MoreHorizIcon />
                    </IconButton>
                    <Menu
                        anchorEl={moreAnchorEl}
                        keepMounted
                        open={Boolean(moreAnchorEl)}
                        onClose={handleMoreActionMenuClose}
                    >
                        {actions.map((action, index) => {
                            return (
                                <MenuItem
                                    key={index}
                                    onClick={() => {
                                        action.callback(item);
                                        handleMoreActionMenuClose();
                                    }}
                                >
                                    {action.label}
                                </MenuItem>
                            );
                        })}
                    </Menu>
                </div>
            )}
            {item.sold_timestamp && (
                <div className="sold_timestamp">
                    {isString(soldDate) ? (
                        soldDate
                    ) : (
                        <Loading loading={!ready}>
                            {soldDate.days}{" "}
                            {t(soldDate.unit, { defaultValue: soldDate.unit })}
                        </Loading>
                    )}
                </div>
            )}

            <NftImage
                item={item}
                height={`${nftImageSize}px`}
                width={`${nftImageSize}px`}
            />

            <div
                className="nftCard-header"
                // style={{ maxWidth: `${nftImageSize}px` }}
            >
                <div className="id">
                    {/* <div className="marketplace-logo">{MarketplaceLogo}</div> */}
                    <Loading loading={!ready_nft}>
                        {/* {t_nft(item.name, { defaultValue: item.name })}  */}
                        #{item.id ? item.id : item.token_id}
                    </Loading>
                </div>
                {!!item.rankable && !isUndefined(item.rank) && (
                    <div className="rank">
                        <Loading loading={!ready}>
                            {t("rank", { defaultValue: "Rank" })}: {item.rank}
                        </Loading>
                    </div>
                )}

                {/* <div className="marketplace-logo">{MarketplaceLogo}</div> */}
            </div>

            <div className="nftCard-footer">
                <NftCardFooter
                    item={item}
                    showAuctionDetail={showAuctionDetail}
                />
            </div>
            {/* <div className="marketplace-logo-2">{MarketplaceLogo}</div> */}
        </Link>
    );
};

const NftCardFooter = ({
    item,
    showAuctionDetail,
}: {
    item: {
        auctionID?: number;
        marketplace?: string;
        token_id: number;
        name: string;
        rank?: number;
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
    };
    showAuctionDetail: boolean;
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
    }, [item.marketplace]);

    const Footer = useMemo(() => {
        if (!isOnSale && !isAuction) {
            return <div> </div>;
        }

        if (isOnSale) {
            const bnb = +(+weiToBnb({ wei: item.price || "" }).toFixed(3));
            return (
                <div className="on-sale">
                    <img
                        src={`${process.env.PUBLIC_URL}/assets/images/icons/token_icons/bnb.svg`}
                        className="bnb-icon"
                    />
                    <div className="price">{bnb} BNB</div>
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

        if (!showAuctionDetail) {
            return (
                <div className="auction">
                    <div className="current-bid">
                        <div className="current-bid-label">
                            {item.highestBidAmount && +item.highestBidAmount
                                ? "Top Bid"
                                : "Min Bid"}
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
    }, [
        isAuction,
        isOnSale,
        item,
        ectoPrice,
        bnbPrice,
        currentTime,
        showAuctionDetail,
        t,
        ready,
    ]);

    return <div>{Footer}</div>;
};

export default NftCard;
