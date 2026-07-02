import "./index.scss";
import { Grid } from "@mui/material";
import { SingleCollectionItem } from "../../../../../state/application/types/SingleCollectionItem";
import _ from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ExternalLink from "../../../../widgets/ExternalLink/ExternalLink";
import HoverTooltip from "../../../../widgets/Tooltip/HoverTooltip";
import IconButton from "../../../../widgets/Button/IconButton/IconButton";
import { ImageTag } from "../../../../../utils/ImageUtil";
import Input from "../../../../widgets/Input";
import InternalLink from "../../../../widgets/InternalLink";
import Loader from "../../../../widgets/Loader";
import Loading from "../../../../widgets/Loading";
import LootboxSingleItem from "../../../../../models/util_models/LootboxUtilModel/types/LootboxSingleItem";
import OutlinedButton from "../../../../widgets/Button/OutlinedButton";
import QuickSetting from "../../../../widgets/SpeedDial/QuickSetting";
import RouteUtilModel from "../../../../../models/util_models/RouteUtilModel";
import SearchIcon from "@mui/icons-material/Search";
import { useActiveWeb3React } from "../../../../../hooks";
import usePageTitle from "../../../../../hooks/usePageTitle";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { souleatersContractAddress } from "../../../../../constants/ContractAddresses";
import { getOwnerOfToken } from "../../../../../hooks/contract/useOwnerOfToken";
import { blockchains } from "../../../../../constants/Blockchains";
import { useSouleaters } from "../../../../../state/application/hooks";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export const CollectionItem = () => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "CollectionItemDetails",
    });
    usePageTitle("Phantasma Marketplace");
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const { account } = useActiveWeb3React();
    const [userOwnItem, setUserOwnItem] = useState(false);
    const [ownerAddress, setOwnerAddress] = useState<
        undefined | null | string
    >();

    const { asset, id } = useParams();
    const soulEaters = useSouleaters();
    const [item, setItem] = useState<any>(null);
    const [traitCounts, setTraitCounts] = useState({});

    const collectionAddress = souleatersContractAddress;

    const [searchId, setSearchId] = useState(id || 0);
    const [showIdSearch, setShowIdSearch] = useState(false);
    const handleOnSearchIdSubmit = useCallback(
        (evt?: React.FormEvent<HTMLFormElement>) => {
            if (evt) {
                evt.preventDefault();
            }
            if (!collectionAddress) {
                return;
            }
            // Validation
            if (item) {
                if (searchId && searchId === item.id) {
                    enqueueSnackbar(
                        t("ERROR_MESSAGES.You_are_already_here", {
                            defaultValue: "You_are_already_here",
                        }),
                        {
                            variant: "error",
                        }
                    );
                    return;
                } else if (+searchId < 0 || +searchId > item.collection_total) {
                    enqueueSnackbar("ID out of range", { variant: "error" });
                    return;
                }
            }
            navigate(`/marketplace/souleater/${searchId}`);
        },
        [searchId, item, collectionAddress, asset, navigate, enqueueSnackbar, t]
    );
    const handleOnSearchIconClick = useCallback(() => {
        if (!showIdSearch) {
            setShowIdSearch(true);
            return;
        }
        handleOnSearchIdSubmit();
    }, [showIdSearch, setShowIdSearch, handleOnSearchIdSubmit]);
    const handleOnSearchIdChange = useCallback(
        (evt: React.ChangeEvent<HTMLInputElement>) => {
            setSearchId(+evt.currentTarget.value);
        },
        [setSearchId]
    );

    useEffect(() => {
        if (!id || !collectionAddress) return;
        getOwnerOfToken(collectionAddress, +id, blockchains.POLYGON).then(
            (owner) => setOwnerAddress(owner)
        );
    }, [id, collectionAddress]);

    useEffect(() => {
        setUserOwnItem(ownerAddress === account);
    }, [account, ownerAddress]);

    useEffect(() => {
        if (
            !id ||
            !soulEaters ||
            !soulEaters[id] ||
            !Object.keys(traitCounts).length
        )
            return;
        let _rank = soulEaters[id].rank;
        let _attributes = {};

        Object.entries(soulEaters[id].trait_type_value).map((trait: any) => {
            let count = null;
            let [traitType, traitValue] = [...trait];
            if (traitCounts[traitType] && traitCounts[traitType][traitValue]) {
                count = traitCounts[traitType][traitValue];
            }
            _attributes[traitType] = {
                trait_value: traitValue,
                trait_count: count,
            };
        });

        let item: any = {
            attributes: _attributes,
            rank: _rank,
            rankable: !!_rank,
            id: id,
            token_Id: id,
            collection_total: Object.keys(soulEaters).length,
            address: souleatersContractAddress,
        };

        console.log(item);
        setItem(item);
    }, [id, traitCounts]);

    useEffect(() => {
        let traitCounter = {};
        Object.values(soulEaters).map((souleater: any) => {
            Object.entries(souleater.trait_type_value).map((t) => {
                // create entry for this traitType if not already exist
                let trait_type = t[0];
                let trait_value = t[1];
                if (!traitCounter[trait_type]) traitCounter[trait_type] = {};

                let traits = traitCounter[trait_type];

                // update the count of the traitValue by 1 or start at 1
                traits[trait_value] = traits[trait_value]
                    ? traits[trait_value] + 1
                    : 1;
            });
        });

        console.log(traitCounter);
        setTraitCounts(traitCounter);
    }, [soulEaters]);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(ownerAddress || "");
            enqueueSnackbar("Copied.", {
                variant: "info",
                preventDuplicate: true,
                autoHideDuration: 1500,
            });
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    return (
        <div id="CollectionItem" className="scrollbar">
            {item ? (
                <div className="content container py-5">
                    <div className="actions"></div>
                    <div className="row nft-info-container">
                        <div className="nft-image col-12 col-md-12 col-lg-4 col-sm-12">
                            <div>
                                <ImageTag
                                    src={`https://littleghosts.s3.us-east-2.amazonaws.com/souleaters/images/${id}.png`}
                                />
                            </div>
                        </div>
                        <div className="nft-info-grid-wrapper col-12 col-md-12 col-lg-8 col-sm-12">
                            <div className="nft-info-grid">
                                <div className={`nft-info ${"unlisted"}`}>
                                    <div className="nft-info-wrapper">
                                        <div className="id-and-rank">
                                            <div className="id-and-icon">
                                                <div className="id">
                                                    ID: #
                                                    <span
                                                        className={
                                                            showIdSearch
                                                                ? "hide"
                                                                : ""
                                                        }
                                                    >
                                                        {id}
                                                    </span>
                                                </div>
                                                <div
                                                    className={`id-search-input-wrapper ${
                                                        showIdSearch
                                                            ? ""
                                                            : "hide"
                                                    }`}
                                                >
                                                    <form
                                                        onSubmit={
                                                            handleOnSearchIdSubmit
                                                        }
                                                    >
                                                        <Input
                                                            value={searchId}
                                                            className="id-search-input"
                                                            type="search"
                                                            pattern="\d*"
                                                            onChange={
                                                                handleOnSearchIdChange
                                                            }
                                                        />
                                                    </form>
                                                </div>
                                                <div className="search-icon">
                                                    <IconButton
                                                        onClick={
                                                            handleOnSearchIconClick
                                                        }
                                                    >
                                                        <SearchIcon />
                                                    </IconButton>
                                                </div>
                                            </div>

                                            <div>
                                                {!!item.rankable && (
                                                    <Loading loading={!ready}>
                                                        {t("rank")}:{" "}
                                                        {item.rank || "?"} /{" "}
                                                        {item.collection_total ||
                                                            "?"}
                                                    </Loading>
                                                )}
                                            </div>
                                            <div>
                                                {(item as LootboxSingleItem)
                                                    .status && (
                                                    <Loading loading={!ready}>
                                                        Status:{" "}
                                                        {
                                                            (
                                                                item as LootboxSingleItem
                                                            ).status
                                                        }
                                                    </Loading>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="owner-and-marketplace">
                                        <div className="owner">
                                            <div className="owner-heading">
                                                <Loading loading={!ready}>
                                                    {t("owner", {
                                                        defaultValue: "Owner",
                                                    })}
                                                    :
                                                </Loading>
                                                <ContentCopyIcon
                                                    onClick={copyToClipboard}
                                                    className="copy-btn"
                                                />
                                            </div>

                                            <InternalLink
                                                to={`/wallet/${ownerAddress}`}
                                            >
                                                <span>
                                                    {ownerAddress?.substring(
                                                        0,
                                                        10
                                                    ) + "..."}
                                                </span>
                                            </InternalLink>
                                            <div>
                                                <ExternalLink
                                                    href={`https://polygonscan.com/address/${ownerAddress}`}
                                                >
                                                    <OutlinedButton size="small">
                                                        PolygonScan
                                                    </OutlinedButton>
                                                </ExternalLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row attributes-bidding-offer-container">
                        <div className="ItemAttributes-grid col-12 col-md-12 col-lg-4 col-sm-12">
                            <ItemAttributes item={item} />
                        </div>
                    </div>
                </div>
            ) : (
                <Loader show={!item} />
            )}
            <QuickSetting />
        </div>
    );
};

const ItemAttributes = ({ item }: { item: SingleCollectionItem }) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "NftTraits",
    });
    return (
        <div className="ItemAttributes">
            {item.attributes
                ? Object.keys(item.attributes).map((attribute, index) => {
                      return (
                          <Grid container key={index} className="attributes">
                              <Grid item className="label" xs={6}>
                                  <Loading loading={!ready}>
                                      {t(attribute, {
                                          defaultValue: attribute,
                                      })}
                                      :
                                  </Loading>
                              </Grid>
                              <Grid item className="attribute" xs={6}>
                                  <Loading loading={!ready}>
                                      <HoverTooltip
                                          tooltip={`Total ${item.attributes[attribute].trait_value}: ${item.attributes[attribute].trait_count}`}
                                      >
                                          <InternalLink
                                              to={`${RouteUtilModel.ROUTES.MARKETPLACE.get()}/${RouteUtilModel.getCategoryRoute(
                                                  {
                                                      collectionAddress:
                                                          item.address.toLowerCase(),
                                                      tokenID: +item.token_id,
                                                  }
                                              )}?${attribute}=${encodeURIComponent(
                                                  item.attributes[attribute]
                                                      .trait_value
                                              )}`}
                                          >
                                              {t(
                                                  item.attributes[attribute]
                                                      .trait_value,
                                                  {
                                                      defaultValue:
                                                          item.attributes[
                                                              attribute
                                                          ].trait_value,
                                                  }
                                              )}
                                              {` (${+(
                                                  (item.attributes[attribute]
                                                      .trait_count /
                                                      item.collection_total) *
                                                  100
                                              ).toFixed(2)}%)`}
                                          </InternalLink>
                                      </HoverTooltip>
                                  </Loading>
                              </Grid>
                          </Grid>
                      );
                  })
                : ""}
        </div>
    );
};
