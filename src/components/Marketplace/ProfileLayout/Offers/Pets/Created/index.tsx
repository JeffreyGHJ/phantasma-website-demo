import "./index.scss";

import {
    FormControl,
    Grid,
    MenuItem,
    Select,
    SelectChangeEvent,
} from "@mui/material";
import { Translation, useTranslation } from "react-i18next";
import { allOfferTypes, offerTypes } from "../../../../constants/offerTypes";
import {
    ectoSkeletonNFTAddress,
    littleGhostsOfferContractAddress,
} from "../../../../../../constants/ContractAddresses";
import {
    fetchCreatedNftOffers,
    fetchCreatedTokenOffers,
} from "../../../../../../apis/web/web.api";
import {
    handleWeb3Error,
    handleWeb3Reponse,
} from "../../../../../../utils/Web3ResponseUtil";
import { isNumber, isString } from "lodash";
import { useCallback, useEffect, useState } from "react";
import {
    useContract,
    useTokenContract,
} from "../../../../../../hooks/useContract";

import Loading from "../../../../../widgets/Loading";
import NftOffer from "../../../../../../constants/types/NftOffer";
import NftOfferCard from "../../../../../widgets/Card/NftOfferCard";
import NftsOfferDetailDialog from "../../../../../shared/NftsOfferDetailDialog";
import OfferABI from "../../../../../../constants/abis/OfferABI";
import TokenOffer from "../../../../../../constants/types/TokenOffer";
import TokenOfferCard from "../../../../../widgets/Card/TokenOfferCard";
import TokenOfferDetailDialog from "../../../../../shared/TokenOfferDetailDialog";
import { blockchains } from "../../../../../../constants/Blockchains";
import cogoToast from "cogo-toast";
import { collectionItemImageUrl } from "../../../../../../utils/collectionitemUtils";
import { getOfferTypeFromURL } from "../../../../../../utils/filterUtil";
import { t } from "i18next";
import { toastOptions } from "../../../../../../configs/CogoToast";
import { useActiveWeb3React } from "../../../../../../hooks";
import { useNavigate } from "react-router-dom";
import { useView3d } from "../../../../../../state/application/hooks";

const params = new URLSearchParams(window.location.search);

function getQueryStringFromStates({ offerType }: { offerType: string }) {
    const _params = new URLSearchParams(window.location.search);

    if (allOfferTypes.includes(offerType)) {
        _params.set("offerType", offerType);
    }

    return `?${_params.toString()}`;
}

const OffersPetsCreated = () => {
    const { account } = useActiveWeb3React();

    const { t, ready } = useTranslation("translation", {
        keyPrefix: "ProfileSections.Offers",
    });

    const [createdTokenOffers, setCreatedTokenOffers] = useState(
        [] as Array<TokenOffer>
    );
    const [createdNftOffers, setCreatedNftOffers] = useState(
        [] as Array<NftOffer>
    );
    const [offerType, setOfferType] = useState(getOfferTypeFromURL(params));
    const navigate = useNavigate();

    const view3d = useView3d();
    const tokenContract = useTokenContract(ectoSkeletonNFTAddress, true);
    const offerContract = useContract(
        littleGhostsOfferContractAddress,
        OfferABI
    );
    const [ownerAddress, setOwnerAddress] = useState("");

    // Token Offer Detail dialog
    const [tokenOfferDetailDialogOpen, setTokenOfferDetailDialogOpen] =
        useState(false);
    const [selectedTokenOffer, setSelectedTokenOffer] =
        useState<TokenOffer | null>(null);
    const handleTokenOfferDetailDialogClose = () => {
        setTokenOfferDetailDialogOpen(false);
    };

    const [isOfferContractApproved, setIsOfferContractApproved] =
        useState(false);

    // NFT Offer Detail dialog
    const [nftOfferDetailDialogOpen, setNftOfferDetailDialogOpen] =
        useState(false);
    const [selectedNftOffer, setSelectedNftOffer] = useState<NftOffer | null>(
        null
    );
    const handleNftOfferDetailDialogClose = () => {
        setNftOfferDetailDialogOpen(false);
    };
    const handleViewNftOffer = (offer) => {
        setSelectedNftOffer(offer);
        setNftOfferDetailDialogOpen(true);
    };

    const handleOfferTypeChange = useCallback(
        (event: SelectChangeEvent<string>) => {
            const _offerType = event.target.value;
            const queryString = getQueryStringFromStates({
                offerType: _offerType,
            });
            navigate(queryString);
        },
        [navigate]
    );

    const handleViewTokenOffer = (offer: TokenOffer) => {
        setSelectedTokenOffer(offer);
        setTokenOfferDetailDialogOpen(true);
    };

    const getOwnerOfToken = async (address, id) => {
        if (!address || !isNumber(id)) {
            return "";
        }
        const abi = [
            {
                inputs: [
                    {
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256",
                    },
                ],
                name: "ownerOf",
                outputs: [
                    { internalType: "address", name: "", type: "address" },
                ],
                stateMutability: "view",
                type: "function",
            },
        ];
        //@ts-ignore
        const Contract = new web3.eth.Contract(abi, address);
        return Contract.methods.ownerOf(id).call();
    };

    const getCreatedTokenOffers = () => {
        if (!account) {
            setCreatedTokenOffers([]);
            return new Promise((res, rej) => {
                res([]);
            });
        }
        return fetchCreatedTokenOffers({
            blockchain: blockchains.BSC,
            collection: ectoSkeletonNFTAddress,
            address: account,
        }).then((response: any) => {
            setCreatedTokenOffers(response.tokenOffers);
        });
    };

    const getCreatedNftOffers = async () => {
        if (!account) {
            setCreatedNftOffers([]);
            return new Promise((res, rej) => {
                res([]);
            });
        }

        await fetchCreatedNftOffers({
            blockchain: blockchains.BSC,
            collection: ectoSkeletonNFTAddress,
            address: account,
        }).then((response: any) => {
            setCreatedNftOffers(response.nftOffers);
        });
    };

    const accpetTokenOffer = async () => {
        if (!selectedTokenOffer) {
            return;
        }
        //@ts-ignore
        await offerContract
            .acceptTokenOffer(
                selectedTokenOffer.nftAddress,
                selectedTokenOffer.nftId,
                selectedTokenOffer.index,
                selectedTokenOffer.tokenOfferId
            )
            .then((res) => {
                setTokenOfferDetailDialogOpen(false);
                handleWeb3Reponse({
                    waitingMessage: `Waiting for confirmations to accept offer`,
                    successMessage: `Offer is successfully accepted.`,
                    res,
                    callback: async () => {
                        getCreatedTokenOffers();
                    },
                });
            })
            .catch((err) => {
                handleWeb3Error(err);
                if (
                    err.data &&
                    err.data.message &&
                    isString(err.data.message) &&
                    (err.data.message.includes("The offers have updated.") ||
                        err.data.message === "execution reverted")
                ) {
                    setTokenOfferDetailDialogOpen(false);
                    cogoToast.info("Updating offers...", toastOptions);
                    getCreatedTokenOffers().then(() => {
                        cogoToast.success(
                            "Offers have been updated",
                            toastOptions
                        );
                    });
                }
            });
    };

    const accpetNftOffer = async () => {
        if (!selectedNftOffer) {
            return;
        }
        //@ts-ignore
        await offerContract
            .acceptNFTOffer(
                selectedNftOffer?.wantedNftAddress,
                selectedNftOffer?.wantedNftId,
                selectedNftOffer?.index,
                selectedNftOffer?.nftOfferId
            )
            .then((res) => {
                setNftOfferDetailDialogOpen(false);
                handleWeb3Reponse({
                    waitingMessage: `Waiting for confirmations accept offer`,
                    successMessage: `Offer is successfully accepted.`,
                    res,
                    callback: async () => {
                        getCreatedNftOffers();
                    },
                });
            })
            .catch((err) => {
                handleWeb3Error(err);
                if (
                    err.data &&
                    err.data.message &&
                    isString(err.data.message) &&
                    (err.data.message.includes("The offers have updated.") ||
                        err.data.message === "execution reverted")
                ) {
                    setNftOfferDetailDialogOpen(false);
                    cogoToast.info("Updating offers...", toastOptions);
                    getCreatedNftOffers().then(() => {
                        cogoToast.success(
                            "Offers have been updated",
                            toastOptions
                        );
                    });
                }
            });
    };

    const cancelTokenOffer = async () => {
        if (!selectedTokenOffer) {
            return;
        }
        //@ts-ignore
        await offerContract
            .cancelTokenOffer(
                selectedTokenOffer.nftAddress,
                selectedTokenOffer.nftId,
                selectedTokenOffer.index,
                selectedTokenOffer.tokenOfferId
            )
            .then((res) => {
                setTokenOfferDetailDialogOpen(false);
                handleWeb3Reponse({
                    waitingMessage: `Waiting for confirmations to cancel offer`,
                    successMessage: `Offer is successfully cancelled.`,
                    res,
                    callback: async () => {
                        getCreatedTokenOffers();
                    },
                });
            })
            .catch((err) => {
                handleWeb3Error(err);
                if (
                    err.data &&
                    err.data.message &&
                    isString(err.data.message) &&
                    (err.data.message.includes("The offers have updated.") ||
                        err.data.message === "execution reverted")
                ) {
                    setTokenOfferDetailDialogOpen(false);
                    cogoToast.info("Updating offers...", toastOptions);
                    if (account) {
                        getCreatedTokenOffers().then(() => {
                            cogoToast.success(
                                "Offers have been updated",
                                toastOptions
                            );
                        });
                    }
                }
            });
    };

    const cancelNftOffer = async () => {
        if (!selectedNftOffer) {
            return;
        }
        //@ts-ignore
        await offerContract
            .cancelNFTOffer(
                selectedNftOffer.wantedNftAddress,
                selectedNftOffer.wantedNftId,
                selectedNftOffer.index,
                selectedNftOffer.nftOfferId
            )
            .then((res) => {
                setNftOfferDetailDialogOpen(false);
                handleWeb3Reponse({
                    waitingMessage: `Waiting for confirmations to cancel offer`,
                    successMessage: `Offer is successfully cancelled.`,
                    res,
                    callback: async () => {
                        getCreatedNftOffers();
                    },
                });
            })
            .catch((err) => {
                handleWeb3Error(err);
                if (
                    err.data &&
                    err.data.message &&
                    isString(err.data.message) &&
                    (err.data.message.includes("The offers have updated.") ||
                        err.data.message === "execution reverted")
                ) {
                    setNftOfferDetailDialogOpen(false);
                    cogoToast.info("Updating offers...", toastOptions);
                    getCreatedNftOffers().then(() => {
                        cogoToast.success(
                            "Offers have been updated",
                            toastOptions
                        );
                    });
                }
            });
    };

    const rejectTokenOffer = async () => {
        if (!selectedTokenOffer) {
            return;
        }
        //@ts-ignore
        await offerContract
            .rejectTokenOffer(
                selectedTokenOffer.nftAddress,
                selectedTokenOffer.nftId,
                selectedTokenOffer.index,
                selectedTokenOffer.tokenOfferId
            )
            .then((res) => {
                setTokenOfferDetailDialogOpen(false);
                handleWeb3Reponse({
                    waitingMessage: `Waiting for confirmations to reject offer`,
                    successMessage: `Offer is successfully rejected.`,
                    res,
                    callback: async () => {
                        getCreatedTokenOffers();
                    },
                });
            })
            .catch((err) => {
                handleWeb3Error(err);
                if (
                    err.data &&
                    err.data.message &&
                    isString(err.data.message) &&
                    (err.data.message.includes("The offers have updated.") ||
                        err.data.message === "execution reverted")
                ) {
                    setTokenOfferDetailDialogOpen(false);
                    cogoToast.info("Updating offers...", toastOptions);
                    getCreatedTokenOffers().then(() => {
                        cogoToast.success(
                            "Offers have been updated",
                            toastOptions
                        );
                    });
                }
            });
    };

    const rejectNftOffer = async () => {
        if (!selectedNftOffer) {
            return;
        }
        //@ts-ignore
        await offerContract
            .rejectNFTOffer(
                selectedNftOffer.wantedNftAddress,
                selectedNftOffer.wantedNftId,
                selectedNftOffer.index,
                selectedNftOffer.nftOfferId
            )
            .then((res) => {
                setNftOfferDetailDialogOpen(false);
                handleWeb3Reponse({
                    waitingMessage: `Waiting for confirmations to reject offer`,
                    successMessage: `Offer is successfully rejected.`,
                    res,
                    callback: async () => {
                        getCreatedNftOffers();
                    },
                });
            })
            .catch((err) => {
                handleWeb3Error(err);
                if (
                    err.data &&
                    err.data.message &&
                    isString(err.data.message) &&
                    (err.data.message.includes("The offers have updated.") ||
                        err.data.message === "execution reverted")
                ) {
                    setNftOfferDetailDialogOpen(false);
                    cogoToast.info("Updating offers...", toastOptions);
                    getCreatedNftOffers().then(() => {
                        cogoToast.success(
                            "Offers have been updated",
                            toastOptions
                        );
                    });
                }
            });
    };

    const approveOfferContract = async () => {
        //@ts-ignore
        await tokenContract
            .setApprovalForAll(ectoSkeletonNFTAddress, true)
            .then((res) => {
                handleWeb3Reponse({
                    waitingMessage:
                        "Waiting for confirmations to approve offer contract",
                    successMessage:
                        "Offer contract has been successfully approved",
                    res,
                    callback: () => {
                        setIsOfferContractApproved(true);
                    },
                });
            })
            .catch((err) => {
                handleWeb3Error(err);
            });
    };

    useEffect(() => {
        if (!account) {
            setCreatedTokenOffers([]);
            setCreatedNftOffers([]);
            return () => {};
        }
        let mounted = true;
        fetchCreatedTokenOffers({
            blockchain: blockchains.BSC,
            collection: ectoSkeletonNFTAddress,
            address: account,
        }).then((response: any) => {
            if (mounted) {
                setCreatedTokenOffers(response.tokenOffers);
            }
        });

        fetchCreatedNftOffers({
            blockchain: blockchains.BSC,
            collection: ectoSkeletonNFTAddress,
            address: account,
        }).then((response: any) => {
            if (mounted) {
                setCreatedNftOffers(response.nftOffers);
            }
        });

        return () => {
            mounted = false;
        };
    }, [account]);

    useEffect(() => {
        if (selectedTokenOffer) {
            getOwnerOfToken(
                selectedTokenOffer.nftAddress,
                selectedTokenOffer.nftId
            ).then((_address) => {
                setOwnerAddress(_address);
            });
        }
    }, [selectedTokenOffer]);

    useEffect(() => {
        const _params = new URLSearchParams(window.location.search);
        const _offerType = getOfferTypeFromURL(_params);
        if (_offerType !== offerType) {
            setOfferType(_offerType);
        }
    });

    return (
        <div id="OffersPetsCreated">
            <div className="filters">
                <FormControl
                    variant="outlined"
                    style={{
                        minWidth: "160px",
                    }}
                >
                    <Select value={offerType} onChange={handleOfferTypeChange}>
                        <MenuItem value={offerTypes.TOKEN_OFFERS}>
                            <Loading loading={!ready}>
                                {t("token_offers", {
                                    defaultValue: "Token Offers",
                                })}
                            </Loading>
                        </MenuItem>
                        <MenuItem value={offerTypes.NFT_OFFERS}>
                            <Loading loading={!ready}>
                                {t("nft_offers", {
                                    defaultValue: "NFT Offers",
                                })}
                            </Loading>
                        </MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div className="offers">
                <div className="">
                    {offerType === offerTypes.TOKEN_OFFERS ? (
                        <div className="token-offers">
                            {!createdTokenOffers.length && (
                                <div className="text-center pt-3">
                                    <h2>
                                        <Loading loading={!ready}>
                                            {t("no_offers_found", {
                                                defaultValue: "No Offers Found",
                                            })}
                                        </Loading>
                                    </h2>
                                </div>
                            )}
                            {createdTokenOffers.map((tokenOffer) => {
                                return (
                                    <TokenOfferCard
                                        key={tokenOffer.tokenOfferId}
                                        item={tokenOffer}
                                        pathPrefix="/marketplace/ghost"
                                        onView={handleViewTokenOffer}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <div className="nft-offers">
                            {!createdNftOffers.length && (
                                <div className="text-center pt-3">
                                    <h2>
                                        <Loading loading={!ready}>
                                            {t("no_offers_found", {
                                                defaultValue: "No Offers Found",
                                            })}
                                        </Loading>
                                    </h2>
                                </div>
                            )}
                            {createdNftOffers.map((nftOffer) => {
                                return (
                                    <NftOfferCard
                                        key={nftOffer.nftOfferId}
                                        item={nftOffer}
                                        pathPrefix="/marketplace/ghost"
                                        onView={handleViewNftOffer}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
            {selectedTokenOffer && (
                <TokenOfferDetailDialog
                    open={tokenOfferDetailDialogOpen}
                    imageLink={collectionItemImageUrl({
                        item: selectedTokenOffer.nftInfo,
                        view3d,
                    })}
                    onClose={handleTokenOfferDetailDialogClose}
                    onAcceptOffer={accpetTokenOffer}
                    onCancelOffer={cancelTokenOffer}
                    onRejectOffer={rejectTokenOffer}
                    approved={isOfferContractApproved}
                    onApprove={approveOfferContract}
                    offer={selectedTokenOffer}
                    ownerAddress={ownerAddress}
                />
            )}
            {selectedNftOffer && (
                <NftsOfferDetailDialog
                    open={nftOfferDetailDialogOpen}
                    onClose={handleNftOfferDetailDialogClose}
                    onAcceptOffer={accpetNftOffer}
                    onCancelOffer={cancelNftOffer}
                    onRejectOffer={rejectNftOffer}
                    approved={isOfferContractApproved}
                    onApprove={approveOfferContract}
                    offer={selectedNftOffer}
                    ownerAddress={ownerAddress}
                />
            )}
        </div>
    );
};

export default OffersPetsCreated;
