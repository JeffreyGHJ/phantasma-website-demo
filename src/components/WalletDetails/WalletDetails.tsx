import "./WalletDetails.scss";

import {
    FormControl,
    Grid,
    Menu,
    MenuItem,
    Select,
    Typography,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { blockchainNames, blockchains } from "../../constants/Blockchains";
import {
    busdTokenAddress,
    ectoContractAddress,
    ectoSkeletonNFTAddress,
    littleGhostNFTAddress,
    wbnbTokenAddress,
} from "../../constants/ContractAddresses";
import {
    getPaymentTokenDecimals,
    getPaymentTokenDisplay,
} from "../../utils/funcs";
import { useEctoPriceInUsd, useView3d } from "../../state/application/hooks";
import { useEffect, useState } from "react";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Collection } from "./types/Collection";
import GalleryButton from "../widgets/Button/GalleryButton";
import axios from "axios";
import { collectionItemImageUrl } from "../../utils/collectionitemUtils";
import { fetchCollectionItemsByAddress } from "../../apis/web/web.api";
import { fromSolidityTokenFormat } from "../../utils/MathUtil";
import { useWalletDetails } from "../../state/wallet_details/useWalletDetails";
import web3 from "web3";

const weiToBnb = (wei) => {
    return +(+web3.utils.fromWei(wei, "ether")).toFixed(3);
};

const collections: Array<Collection> = [
    {
        name: "LittleGhosts",
        address: littleGhostNFTAddress,
    },
    {
        name: "ECTOSkeletons",
        address: ectoSkeletonNFTAddress,
    },
];

const getTokenString = (address, id) => {
    return `/marketplace/${address}/details/${id}`;
};

const getCurrentBid = (_item) => {
    return +_item.highestBidAmount
        ? +fromSolidityTokenFormat(
              _item.highestBidAmount,
              getPaymentTokenDecimals(_item.paymentToken)
          )
        : +fromSolidityTokenFormat(
              _item.minimumBidAmount,
              getPaymentTokenDecimals(_item.paymentToken)
          );
};

const getBuyoutPriceInUsd = (_item, ectoPrice, bnbPrice) => {
    const address = _item.paymentToken.toLowerCase();
    if (address === ectoContractAddress.toLowerCase()) {
        return getCurrentBid(_item) * +ectoPrice;
    } else if (address === busdTokenAddress.toLowerCase()) {
        return getCurrentBid(_item);
    } else if (address === wbnbTokenAddress.toLowerCase()) {
        return getCurrentBid(_item) * +bnbPrice;
    }
    return 0;
};

const VIEWS = {
    OWNED: 1,
    LISTED: 2,
    AUCTIONED: 3,
};

const WalletDetails = () => {
    const { address } = useParams();
    const [showListed, setShowListed] = useState(false);
    const [tokens, setTokens] = useState([] as Array<any>);
    const [listedTokens, setListedTokens] = useState([] as Array<any>);
    const [auctionedTokens, setAuctionedTokens] = useState([] as Array<any>);
    const [view, setView] = useState(VIEWS.OWNED);
    const view3d = useView3d();
    const {
        bnbPrice,
        collectionAddress,
        setCollectionAddress,
        collectionDetail,
    } = useWalletDetails();

    const refreshTokens = () => {
        if (address && collectionAddress) {
            fetchCollectionItemsByAddress({
                blockchain: blockchains.BSC,
                collection: collectionAddress,
                address,
            }).then((response: any) => {
                setTokens(response.data.ownedItems);
                setListedTokens(response.data.listedItems);
                setAuctionedTokens(response.data.auctionedItems);
            });
        }
    };

    const [listAnchorEl, setListAnchorEl] = useState(null);

    const ectoPrice = useEctoPriceInUsd();

    const handleListClick = (event) => {
        setListAnchorEl(event.currentTarget);
    };

    const handleListMenuClose = (_view) => {
        setListAnchorEl(null);
        if (_view) {
            setView(_view);
        }
    };

    useEffect(() => {
        setCollectionAddress(collections[0].address);
    }, []);

    useEffect(() => {
        refreshTokens();
    }, [address, collectionAddress]);

    return (
        <>
            <div id="WalletDetails">
                <div className="header my-5">
                    <div className="container title_wrapper py-3 d-flex justify-content-between">
                        <p className="title">
                            {address?.substring(0, 10) + "..."}{" "}
                            {collectionDetail.name} ({tokens.length})
                        </p>
                        <p
                            id="ListedDropdown"
                            className="title"
                            onClick={handleListClick}
                        >
                            Listed (
                            {listedTokens.length + auctionedTokens.length}){" "}
                            <ArrowDropDownIcon fontSize="large" />
                        </p>
                        <Menu
                            anchorEl={listAnchorEl}
                            keepMounted
                            open={Boolean(listAnchorEl)}
                            onClose={() => {
                                handleListMenuClose(null);
                            }}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "center",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "center",
                            }}
                        >
                            <MenuItem
                                onClick={() => {
                                    handleListMenuClose(VIEWS.OWNED);
                                }}
                            >
                                Unlisted ({tokens.length})
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    handleListMenuClose(VIEWS.LISTED);
                                }}
                            >
                                Listed ({listedTokens.length})
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    handleListMenuClose(VIEWS.AUCTIONED);
                                }}
                            >
                                Auction ({auctionedTokens.length})
                            </MenuItem>
                        </Menu>
                    </div>
                </div>
                <Grid
                    className="container"
                    container
                    justifyContent="space-between"
                >
                    <Grid item>
                        <div>
                            <FormControl
                                variant="outlined"
                                style={{
                                    minWidth: "180px",
                                }}
                            >
                                <Select
                                    value={collectionAddress}
                                    onChange={(evt) => {
                                        setCollectionAddress(evt.target.value);
                                    }}
                                >
                                    {collections.map((col: any, index) => {
                                        return (
                                            <MenuItem
                                                value={col.address}
                                                key={index}
                                            >
                                                <em>{col.name}</em>
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                        </div>
                    </Grid>
                    {address && (
                        <Grid item>
                            <div>
                                <GalleryButton address={address} />
                            </div>
                        </Grid>
                    )}
                </Grid>
                {view === VIEWS.OWNED && (
                    <Grid
                        container
                        className="container"
                        justifyContent="space-around"
                        gap="2rem 10rem"
                    >
                        {tokens.map((token, i) => {
                            return (
                                <Grid
                                    item
                                    key={token.id}
                                    className="gif-wrapper mt-5"
                                >
                                    <div>
                                        <Link
                                            to={getTokenString(
                                                collectionAddress,
                                                token.id
                                            )}
                                        >
                                            <img
                                                src={collectionItemImageUrl({
                                                    item: token,
                                                    view3d,
                                                })}
                                                alt="gif"
                                                height="250"
                                                width="250"
                                                style={{ objectFit: "cover" }}
                                            />
                                        </Link>
                                        <div className="text-center">
                                            <p>
                                                {collectionDetail.name} #
                                                {token.id}
                                            </p>
                                        </div>
                                    </div>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
                {view === VIEWS.LISTED && (
                    <Grid
                        container
                        className="container"
                        justifyContent="space-around"
                        gap="2rem 10rem"
                    >
                        {listedTokens.map((token, i) => {
                            return (
                                <Grid
                                    item
                                    key={token.id}
                                    className="gif-wrapper mt-5"
                                >
                                    <div>
                                        <Link
                                            to={getTokenString(
                                                collectionAddress,
                                                token.id
                                            )}
                                        >
                                            <img
                                                src={collectionItemImageUrl({
                                                    item: token,
                                                    view3d,
                                                })}
                                                alt="gif"
                                                height="250"
                                                width="250"
                                                style={{ objectFit: "cover" }}
                                            />
                                        </Link>
                                        <div className="text-center">
                                            <p>
                                                {collectionDetail.name} #
                                                {token.id}
                                            </p>
                                            <Typography
                                                variant="h6"
                                                style={{
                                                    display: "inline-block",
                                                    fontSize: "2rem",
                                                    fontFamily:
                                                        "Butter Haunted",
                                                    color: "white",
                                                }}
                                            >
                                                BNB:
                                                {weiToBnb(token.price)}
                                                {bnbPrice ? (
                                                    <span
                                                        style={{
                                                            paddingLeft:
                                                                "0.5rem",
                                                            fontSize: "1.5rem",
                                                        }}
                                                    >
                                                        $
                                                        {(
                                                            weiToBnb(
                                                                token.price
                                                            ) * +bnbPrice
                                                        ).toFixed()}
                                                    </span>
                                                ) : (
                                                    " "
                                                )}
                                            </Typography>
                                        </div>
                                    </div>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}

                {view === VIEWS.AUCTIONED && (
                    <Grid
                        container
                        className="container"
                        justifyContent="space-around"
                        gap="2rem 10rem"
                    >
                        {auctionedTokens.map((token, i) => {
                            return (
                                <Grid
                                    item
                                    key={token.id}
                                    className="gif-wrapper mt-5"
                                >
                                    <div>
                                        <Link
                                            to={getTokenString(
                                                collectionAddress,
                                                token.id
                                            )}
                                        >
                                            <img
                                                src={collectionItemImageUrl({
                                                    item: token,
                                                    view3d,
                                                })}
                                                alt="gif"
                                                height="250"
                                                width="250"
                                                style={{ objectFit: "cover" }}
                                            />
                                        </Link>
                                        <div className="text-center">
                                            <p>
                                                {collectionDetail.name} #
                                                {token.id}
                                            </p>
                                            <Typography
                                                variant="h6"
                                                style={{
                                                    display: "inline-block",
                                                    fontSize: "2rem",
                                                    fontFamily:
                                                        "Butter Haunted",
                                                    color: "white",
                                                }}
                                            >
                                                {getPaymentTokenDisplay(
                                                    token.paymentToken
                                                )}
                                                :
                                                {getCurrentBid(
                                                    token
                                                ).toLocaleString()}
                                                {bnbPrice ? (
                                                    <span
                                                        style={{
                                                            fontSize: "1.2rem",
                                                        }}
                                                    >
                                                        &nbsp;($
                                                        {getBuyoutPriceInUsd(
                                                            token,
                                                            ectoPrice,
                                                            bnbPrice
                                                        ).toFixed()}
                                                        )
                                                    </span>
                                                ) : (
                                                    " "
                                                )}
                                            </Typography>
                                        </div>
                                    </div>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </div>
        </>
    );
};

export default WalletDetails;
