import "./index.scss";

import {
    airdropperContractAddress,
    ectoContractAddress,
    oldEctoContractAddress,
} from "../../../../constants/ContractAddresses";
import {
    useAccountBnbBalance,
    useAccountEctoBalance,
    useAccountFoundersItems,
    useAccountFoundersLootboxes,
    useAccountGhosts,
    useAccountOldEctoBalance,
    useAccountSkeletons,
    useAccountSoulEaters,
    useUpdateAccountEctoBalance,
    useUpdateAccountOldEctoBalance,
} from "../../../../state/application/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    useHandleWeb3Error,
    useHandleWeb3Response,
} from "../../../../utils/Web3ResponseUtil";

import { AbiItem } from "web3-utils";
import ExternalLink from "../../../widgets/ExternalLink/ExternalLink";
import { ImageTag } from "../../../../utils/ImageUtil";
import InternalLink from "../../../widgets/InternalLink";
import Loading from "../../../widgets/Loading";
import MintLootboxAlert from "../../../widgets/Alert/MintLootboxAlert";
import NoWalletAlert from "../../../widgets/Alert/NoWalletAlert";
import Web3 from "web3";
import { activeNode } from "../../../../constants/Nodes";
import { blockchains } from "../../../../constants/Blockchains";
import genericErc20ABI from "../../../../constants/abis/genericErc20ABI";
import { getEctoBalance } from "../../../../hooks/bsc/useEctoBalance";
import { getHumanReadableLargeNumber } from "../../../../utils/NumberUtil";
import { getOldEctoBalance } from "../../../../hooks/bsc/useOldEctoBalance";
import { isUndefined } from "lodash";
import useAccountBalanceInUsd from "../../../../hooks/bsc/useAccountBalanceInUsd";
import { useAccountBnbBalanceDisplay } from "../../../../hooks/useAccountBalanceDisplay";
import { useActiveWeb3React } from "../../../../hooks";
import useChangeChain from "../../../../hooks/useChangeChain";
import { useMigrateAll } from "../../../../constants/abis/bsc/AirdropperABI/hooks";
import usePageTitle from "../../../../hooks/usePageTitle";
import { useTranslation } from "react-i18next";
import { Divider, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router";

const web3 = new Web3(activeNode);

const maxAllowance =
    "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

const OldEctoContract = new web3.eth.Contract(
    genericErc20ABI as AbiItem[],
    oldEctoContractAddress
);

const Dashboard = () => {
    usePageTitle("Dashboard | Phantasma");

    const { t, ready } = useTranslation("translation", {
        keyPrefix: "ProfileSections.Dashboard",
    });

    const { t: t_asset, ready: ready_asset } = useTranslation("translation", {
        keyPrefix: "AssetCategories",
    });

    const { account, library, chainId } = useActiveWeb3React();
    const handleWeb3Reponse = useHandleWeb3Response();
    const handleWeb3Error = useHandleWeb3Error();
    const changeChain = useChangeChain();
    const navigate = useNavigate();

    // Global states
    const accountGhosts = useAccountGhosts();
    const accountSkeletons = useAccountSkeletons();
    const accountLootboxes = useAccountFoundersLootboxes();
    const accountFounderItems = useAccountFoundersItems();
    const accountEctoBalance = useAccountEctoBalance();
    const accountOldEctoBalance = useAccountOldEctoBalance();
    const accountBnbBalance = useAccountBnbBalance();
    const accountSoulEaters = useAccountSoulEaters();

    // Global updaters
    const updateAccountEctoBalance = useUpdateAccountEctoBalance();
    const updateAccountOldEctoBalance = useUpdateAccountOldEctoBalance();

    // Local states
    const [isAirdropperApproved, setIsAirdropperApproved] = useState(false);
    const accountBnbBalanceDisplay = useAccountBnbBalanceDisplay({
        balance: accountBnbBalance,
        decimal: 3,
    });
    const accountReadableEctoBalance = useMemo(() => {
        return getHumanReadableLargeNumber({
            number: +accountEctoBalance,
            precision: 2,
        });
    }, [accountEctoBalance]);

    const accountReadableOldEctoBalance = useMemo(() => {
        return getHumanReadableLargeNumber({
            number: +accountOldEctoBalance,
            precision: 2,
        });
    }, [accountOldEctoBalance]);

    const accountGhostCount = useMemo(() => {
        return (
            accountGhosts.auctionedItems.length +
            accountGhosts.listedItems.length +
            accountGhosts.ownedItems.length
        );
    }, [accountGhosts]);

    const accountSkeletonCount = useMemo(() => {
        return (
            accountSkeletons.auctionedItems.length +
            accountSkeletons.listedItems.length +
            accountSkeletons.ownedItems.length
        );
    }, [accountSkeletons]);

    const accountArmoryCount = useMemo(() => {
        const auctionedArmoryCount = accountFounderItems.auctionedItems.filter(
            (x) => {
                const tokenID = +x.tokenID;
                return tokenID >= 10000 && tokenID <= 19999;
            }
        ).length;

        const listedArmoryCount = accountFounderItems.listedItems.filter(
            (x) => {
                const tokenID = +x.id;
                return tokenID >= 10000 && tokenID <= 19999;
            }
        ).length;

        const ownedArmoryCount = accountFounderItems.ownedItems.filter((x) => {
            const tokenID = +x.id;
            return tokenID >= 10000 && tokenID <= 19999;
        }).length;

        return auctionedArmoryCount + listedArmoryCount + ownedArmoryCount;
    }, [accountFounderItems]);

    const accountSupplyCount = useMemo(() => {
        const lootboxCount =
            accountLootboxes.auctionedItems.length +
            accountLootboxes.listedItems.length +
            accountLootboxes.ownedItems.length;

        const auctionedSupplyCount = accountFounderItems.auctionedItems.filter(
            (x) => {
                const tokenID = +x.tokenID;
                return tokenID < 10000 || tokenID > 19999;
            }
        ).length;

        const listedSupplyCount = accountFounderItems.listedItems.filter(
            (x) => {
                const tokenID = +x.id;
                return tokenID < 10000 || tokenID > 19999;
            }
        ).length;

        const ownedSupplyCount = accountFounderItems.ownedItems.filter((x) => {
            const tokenID = +x.id;
            return tokenID < 10000 || tokenID > 19999;
        }).length;

        return (
            lootboxCount +
            auctionedSupplyCount +
            listedSupplyCount +
            ownedSupplyCount
        );
    }, [accountLootboxes, accountFounderItems]);

    const accountBnbBalanceInUsd = useAccountBalanceInUsd();
    const migrateAllEcto = useMigrateAll();

    const handleMigrateEcto = useCallback(() => {
        if (isUndefined(chainId) || isUndefined(library)) {
            return;
        }
        if (chainId !== blockchains.BSC) {
            changeChain(blockchains.BSC);
        }
        migrateAllEcto(async () => {
            if (!account) {
                return;
            }
            const promises = [
                getEctoBalance({ account }),
                getOldEctoBalance({ account }),
            ];

            const [newEctoBalance, newOldEctoBalance] = await Promise.all(
                promises
            );
            updateAccountEctoBalance(newEctoBalance);
            updateAccountOldEctoBalance(newOldEctoBalance);
        });
    }, [
        chainId,
        library,
        changeChain,
        account,
        migrateAllEcto,
        updateAccountEctoBalance,
        updateAccountOldEctoBalance,
    ]);

    const approveAirdopper = useCallback(() => {
        if (isUndefined(chainId) || isUndefined(library)) {
            return;
        }
        if (chainId !== blockchains.BSC) {
            changeChain(blockchains.BSC);
        }
        const encoded = OldEctoContract.methods
            .approve(airdropperContractAddress, maxAllowance)
            .encodeABI();
        library
            .getSigner()
            .sendTransaction({
                from: account || "",
                to: oldEctoContractAddress,
                value: 0,
                data: encoded,
            })
            .then((res) => {
                handleWeb3Reponse({
                    waitingMessage:
                        "Waiting for confirmations to approve migration of your ECTO tokens...",
                    successMessage:
                        "Airdropper approved. Now you can migrate tokens!",
                    res,
                    callback: () => {
                        setIsAirdropperApproved(true);
                    },
                });
            })
            .catch((err) => {
                handleWeb3Error({ err });
            });
    }, [
        changeChain,
        chainId,
        library,
        account,
        handleWeb3Error,
        handleWeb3Reponse,
    ]);

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        if (account) {
            OldEctoContract.methods
                .allowance(account, airdropperContractAddress)
                .call()
                .then((_allowance) => {
                    if (+_allowance < +maxAllowance) {
                        setIsAirdropperApproved(false);
                    } else {
                        setIsAirdropperApproved(true);
                    }
                });
        }
    }, [account]);

    return (
        <div id="Dashboard">
            <section className="wallet-section">
                {/* <MintLootboxAlert className='mb-3' /> */}

                <div className="section-title">
                    <Loading loading={!ready}>
                        {t("wallets", { defaultValue: "Wallets" })}
                    </Loading>
                </div>
                <div className="section-content">
                    <div className="wallet-balance">
                        <div className="balance-wrapper">
                            <div className="bnb-balance">
                                <>
                                    {accountReadableEctoBalance.number}
                                    {accountReadableEctoBalance.unit} ECTO
                                </>
                            </div>
                        </div>
                        <div className="button-group">
                            <div>
                                <div
                                    className="purchase-ecto"
                                    onClick={handleClick}
                                >
                                    <Loading loading={!ready}>Buy ECTO</Loading>
                                </div>
                                <Menu
                                    id="simple-menu"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    <MenuItem
                                        onClick={() => {
                                            handleClose();
                                        }}
                                        disabled
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <img
                                                src={`${process.env.PUBLIC_URL}/assets/images/icons/token_icons/credit-card.svg`}
                                                width="16px"
                                                height="auto"
                                                alt="ecto"
                                                style={{ marginRight: "5px" }} // Add this line
                                            />
                                            Pay with Credit/Debit (Soon)
                                        </div>
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem
                                        onClick={() => {
                                            handleClose();
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <img
                                                src={`${process.env.PUBLIC_URL}/assets/images/icons/token_icons/Bnb.svg`}
                                                width="16px"
                                                height="auto"
                                                alt="ecto"
                                                style={{ marginRight: "5px" }} // Add this line
                                            />
                                            <ExternalLink
                                                href={
                                                    "https://pancakeswap.finance/swap?outputCurrency=" +
                                                    ectoContractAddress
                                                }
                                                style={{ color: "#fff" }}
                                            >
                                                Pay with Crypto
                                            </ExternalLink>
                                        </div>
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => {
                                            handleClose();
                                        }}
                                        disabled
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <img
                                                src={`${process.env.PUBLIC_URL}/assets/images/icons/token_icons/matic.svg`}
                                                width="16px"
                                                height="auto"
                                                alt="ecto"
                                                style={{ marginRight: "5px" }} // Add this line
                                            />
                                            Pay with Crypto (Soon)
                                        </div>
                                    </MenuItem>
                                </Menu>
                            </div>
                            <InternalLink to="/shop" className="purchase-nft">
                                <Loading loading={!ready}>
                                    Purchase items
                                </Loading>
                            </InternalLink>
                        </div>
                    </div>
                    <div className="wallet-holdings">
                        <div
                            className="ecto holding"
                            onClick={() =>
                                navigate("/marketplace/profile/vault/ghosts")
                            }
                        >
                            <div className="wrapper">
                                <div className="ecto-logo">
                                    <ImageTag
                                        src={`${process.env.PUBLIC_URL}/assets/images/icons/token_icons/Ecto.png`}
                                        width="35px"
                                        height="auto"
                                        alt="ecto"
                                    />
                                </div>
                                <div className="ecto-holding label">
                                    {accountOldEctoBalance === "0" ? (
                                        <>
                                            {accountReadableEctoBalance.number}
                                            {
                                                accountReadableEctoBalance.unit
                                            }{" "}
                                            ECTO
                                        </>
                                    ) : isAirdropperApproved ? (
                                        <Loading loading={!ready}>
                                            <div
                                                className="migrate-ecto"
                                                onClick={handleMigrateEcto}
                                            >
                                                {t("migrate", {
                                                    defaultValue: "Migrate",
                                                })}{" "}
                                                {
                                                    accountReadableOldEctoBalance.number
                                                }
                                                {
                                                    accountReadableOldEctoBalance.unit
                                                }{" "}
                                                ECTO
                                            </div>
                                        </Loading>
                                    ) : (
                                        <Loading loading={!ready}>
                                            <div
                                                className="migrate-ecto"
                                                onClick={approveAirdopper}
                                            >
                                                {t("approve_to_migrate", {
                                                    defaultValue:
                                                        "Approve to Migrate",
                                                })}{" "}
                                                {
                                                    accountReadableOldEctoBalance.number
                                                }
                                                {
                                                    accountReadableOldEctoBalance.unit
                                                }{" "}
                                                ECTO
                                            </div>
                                        </Loading>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div
                            className="ghosts holding"
                            onClick={() =>
                                navigate("/marketplace/profile/vault/ghosts")
                            }
                        >
                            <div className="wrapper">
                                <div className="ghosts-logo">
                                    <ImageTag
                                        src={`${process.env.PUBLIC_URL}/assets/images/icons/Ghosts.png`}
                                        width="35px"
                                        height="auto"
                                        alt="ghosts"
                                    />
                                </div>
                                <div className="ghost-holding label">
                                    <Loading loading={!ready_asset}>
                                        {accountGhostCount}{" "}
                                        {t_asset("ghosts", {
                                            defaultValue: "Ghosts",
                                        })}
                                    </Loading>
                                </div>
                            </div>
                        </div>
                        <div
                            className="skeletons holding"
                            onClick={() =>
                                navigate("/marketplace/profile/vault/pets")
                            }
                        >
                            <div className="wrapper">
                                <div className="skeletons-logo">
                                    <ImageTag
                                        src={`${process.env.PUBLIC_URL}/assets/images/icons/Ectoskeletons.png`}
                                        width="35px"
                                        height="auto"
                                        alt="skeletons"
                                    />
                                </div>
                                <div className="skeleton-holding label">
                                    <Loading loading={!ready_asset}>
                                        {accountSkeletonCount}{" "}
                                        {t_asset("skeletons", {
                                            defaultValue: "Skeletons",
                                        })}
                                    </Loading>
                                </div>
                            </div>
                        </div>

                        <div
                            className="armories holding"
                            onClick={() =>
                                navigate("/marketplace/profile/vault/armory")
                            }
                        >
                            <div className="wrapper">
                                <div className="armories-logo">
                                    <ImageTag
                                        src={`${process.env.PUBLIC_URL}/assets/images/icons/Sword.png`}
                                        width="35px"
                                        height="auto"
                                        alt="Sword"
                                    />
                                </div>
                                <div className="armories-holding label">
                                    <Loading loading={!ready_asset}>
                                        {accountArmoryCount}{" "}
                                        {t_asset("armory", {
                                            defaultValue: "Armory",
                                        })}
                                    </Loading>
                                </div>
                            </div>
                        </div>
                        <div
                            className="supplies holding"
                            onClick={() =>
                                navigate("/marketplace/profile/vault/supplies")
                            }
                        >
                            <div className="wrapper">
                                <div className="supplies-logo">
                                    <ImageTag
                                        src={`${process.env.PUBLIC_URL}/assets/images/icons/Potion.png`}
                                        width="35px"
                                        height="auto"
                                        alt="Potion"
                                    />
                                </div>
                                <div className="supplies-holding label">
                                    <Loading loading={!ready_asset}>
                                        {accountSupplyCount}{" "}
                                        {t_asset("supplies", {
                                            defaultValue: "Supplies",
                                        })}
                                    </Loading>
                                </div>
                            </div>
                        </div>
                        <div
                            className="multipliers holding"
                            onClick={() =>
                                navigate(
                                    "/marketplace/profile/vault/souleaters"
                                )
                            }
                        >
                            <div className="wrapper">
                                <div className="multipliers-logo">
                                    <ImageTag
                                        src={`${process.env.PUBLIC_URL}/assets/images/icons/souleater_toon.png`}
                                        width="35px"
                                        height="auto"
                                        alt="SoulEaters"
                                    />
                                </div>
                                <div className="multipliers-holding label">
                                    <Loading loading={!ready_asset}>
                                        {accountSoulEaters.length}{" "}
                                        {t_asset("souleaters", {
                                            defaultValue: "SoulEaters",
                                        })}
                                    </Loading>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
