import "./i18nextInit";

import { Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import {
    ectoContractAddress,
    ectoSkeletonNFTAddress,
    foundersItemsContractAddress,
    littleGhostNFTAddress,
    lootboxContractAddress,
    wbnbTokenAddress,
} from "./constants/ContractAddresses";
import {
    useAlertDisplayPosition,
    useUpdateAccountBnbBalance,
    useUpdateAccountBusdBalance,
    useUpdateAccountClaimableBnbRewards,
    useUpdateAccountClaimableBusdRewards,
    useUpdateAccountClaimableWbnbRewards,
    useUpdateAccountEctoBalance,
    useUpdateAccountFoundersItems,
    useUpdateAccountFoundersLootboxes,
    useUpdateAccountGhosts,
    useUpdateAccountOldEctoBalance,
    useUpdateAccountSkeletons,
    useUpdateAccountSolanaAssets,
    useUpdateAccountSoulEaters,
    useUpdateAccountWbnbBalance,
    useUpdateBnbPriceInUsd,
    useUpdateEctoPriceInUsd,
    useUpdateUser,
    useUser,
} from "./state/application/hooks";
import { useCallback, useEffect, useState } from "react";

import AccountItems from "./state/application/types/AccountItems";
import AccountModel from "./models/AccountModel";
import AlertDisplayPositionUtilModel from "./models/util_models/AlertDisplayPositionUtilModel";
import CollectionItem from "./components/Marketplace/CollectionItem";
import { CollectionItem as SECollectionItem } from "./components/Marketplace/Marketplace/SoulEaters/CollectionItem";
import Dao from "./components/Dao/Dao";
import EmailUpdateConfirmation from "./components/Account/EmailUpdateConfirmation";
import EmailVerification from "./components/Account/EmailVerification";
import Home from "./components/Home";
import Layout from "./components/Layout";
import Login from "./components/Marketplace/Login";
import LootboxABI from "./constants/abis/bsc/LootboxABI";
import LootboxMinting from "./components/Mintings/LootboxMinting";
import LootboxUtilModel from "./models/util_models/LootboxUtilModel";
import Marketplace from "./components/Marketplace/Marketplace";
import { Multicall } from "ethereum-multicall";
import NFtBridge from "./components/NftBridge";
import NewProposal from "./components/Dao/NewProposal/NewProposal";
import PasswordReset from "./components/Account/PasswordReset";
import Profile from "./components/Marketplace/ProfileLayout";
import ProposalDetail from "./components/Dao/ProposalDetail/ProposalDetail";
import { SnackbarProvider } from "notistack";
import StakingPool from "./components/StakingPool/StakingPool";
import Test from "./components/Test.js/index.js";
import User from "./constants/types/User";
import Vault from "./components/Marketplace/Vault";
import Wallet from "./components/Marketplace/Wallet";
import Web3 from "web3";
import { activeNode } from "./constants/Nodes";
import { autoLogin } from "./apis/web/web.api";
import { blockchains } from "./constants/Blockchains";
import { cloneDeep } from "lodash";
import { getTokenInfoWithPrice } from "./utils/PancakeSwapApiUtil";
import { useActiveWeb3React } from "./hooks";
import { useBalance } from "./hooks/bsc/useBalance";
import { useBusdBalance } from "./hooks/bsc/useBusdBalance";
import useClaimableBnbRewards from "./hooks/useClaimableBnbRewards";
import useClaimableWbnbRewards from "./hooks/useClaimableWbnbRewards";
import {
    useCollectionItemsAllAccounts,
    useCollectionItemsByAddress,
    useSolanaAssetsByOwner,
    useSoulEatersAllAccounts,
} from "./apis/web/web.hook";
import { useDividendDistributorContract } from "./constants/abis/bsc/EctoTokenAbi/hook";
import { useEctoBalance } from "./hooks/bsc/useEctoBalance";
import useGhostsMintCount from "./hooks/useGhostsMintCount";
import { useHandleUnauthorizedResponse } from "./hooks/useAuth";
import { useOldEctoBalance } from "./hooks/bsc/useOldEctoBalance";
import { useUnpaidEarnings } from "./constants/abis/bsc/EctoRewardDistributorAbi/hook";
import { useWbnbBalance } from "./hooks/bsc/useWbnbBalance";
import Shop from "./components/Marketplace/Shop";
import Community from "./components/Community";
import RaffleRoller from "./components/NewLootbox/RaffleRoller";
import Knowledge from "./components/Marketplace/Knowledge";
import Onboarding from "./components/Onboarding";
import Download from "./components/Onboarding/Download";
import SoulEaters from "./components/Marketplace/Marketplace/SoulEaters";
import { PurchasePage } from "./components/Marketplace/Shop/PurchasePage";

const web3 = new Web3(activeNode);
const multicall = new Multicall({ web3Instance: web3, tryAggregate: false });

const theme = createTheme({
    breakpoints: {
        values: {
            xs: 320,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1920,
            //@ts-ignore
            442: 442,
            1172: 1172,
        },
    },
});

const App = () => {
    const { account } = useActiveWeb3React();
    const user = useUser();
    const bnbBalance = useBalance(account || "");
    const ectoBalance = useEctoBalance(account || "");
    const oldEctoBalance = useOldEctoBalance(account || "");
    const busdBalance = useBusdBalance(account || "");
    const wbnbBalance = useWbnbBalance(account || "");
    const accountGhosts = useCollectionItemsAllAccounts({
        blockchain: blockchains.BSC,
        collection: littleGhostNFTAddress,
    });
    const accountSkeletons = useCollectionItemsAllAccounts({
        blockchain: blockchains.BSC,
        collection: ectoSkeletonNFTAddress,
    });
    const accountFoundersLootboxes = useCollectionItemsAllAccounts({
        blockchain: blockchains.BSC,
        collection: lootboxContractAddress,
    });
    const accountFoundersLootboxItems = useCollectionItemsAllAccounts({
        blockchain: blockchains.BSC,
        collection: foundersItemsContractAddress,
    });

    // backend does not yet support marketplace features for SE
    const accountSoulEaters = useSoulEatersAllAccounts();
    const ghostsMintCount = useGhostsMintCount(account || "");

    const claimableBnbRewards = useClaimableBnbRewards(
        account || "",
        accountGhosts.ownedItems,
        ghostsMintCount
    );
    const claimableWbnbRewards = useClaimableWbnbRewards(
        account || "",
        accountGhosts.ownedItems,
        ghostsMintCount
    );
    const claimableBusdRewards = useUnpaidEarnings({
        account: account || "",
        DividendDistributionContract: useDividendDistributorContract(),
    });

    const accountSolanaAssets = useSolanaAssetsByOwner({
        ownerAddress: user?.VaultSOLAddress || "",
        page: 1,
        limit: 1000,
    });

    const handleUnauthorizedResponse = useHandleUnauthorizedResponse();

    //redux updaters
    const setBnbPrice = useUpdateBnbPriceInUsd();
    const setEctoPrice = useUpdateEctoPriceInUsd();
    const setAccountBnbBalance = useUpdateAccountBnbBalance();
    const setAccountEctoBalance = useUpdateAccountEctoBalance();
    const setAccountOldEctoBalance = useUpdateAccountOldEctoBalance();
    const setAccountBusdBalance = useUpdateAccountBusdBalance();
    const setAccountWbnbBalance = useUpdateAccountWbnbBalance();
    const setAccountGhosts = useUpdateAccountGhosts();
    const setAccountSoulEaters = useUpdateAccountSoulEaters();
    const setAccountSkeletons = useUpdateAccountSkeletons();
    const setAccountFoundersLootboxes = useUpdateAccountFoundersLootboxes();
    const setAccountFoundersItems = useUpdateAccountFoundersItems();
    const setAccountSolanaAssets = useUpdateAccountSolanaAssets();
    const setClaimableBnbRewards = useUpdateAccountClaimableBnbRewards();
    const setClaimableWbnbRewards = useUpdateAccountClaimableWbnbRewards();
    const setClaimableBusdRewards = useUpdateAccountClaimableBusdRewards();
    const setUser = useUpdateUser();
    const overrideLocalSettings = AccountModel.useOverrideLocalSettings();

    // #region (Alert display Position)
    const alertDisplayPosition = useAlertDisplayPosition();
    const [notifstackPositionSelection, setNotifstackPositionSelection] =
        useState(
            AlertDisplayPositionUtilModel.notifstackPositionSelections.TOP_RIGHT
        );
    // #endregion

    // #region (Lootbox)
    //TODO: Clean up and create correct types (My bad :))
    const handleFormatAccountFoundersLootboxes = useCallback(
        async (_accountLootboxs: AccountItems) => {
            const promises = [] as Array<Promise<void>>;
            const _temp = cloneDeep(_accountLootboxs);

            const auctionCallContext = [
                {
                    reference: "lootboxContract",
                    contractAddress: lootboxContractAddress,
                    abi: LootboxABI,
                    calls: _temp.auctionedItems.map((box) => {
                        return {
                            reference: "getLootboxCall",
                            methodName: "getLootbox",
                            methodParameters: [box.tokenID],
                        };
                    }),
                },
            ];

            promises.push(
                multicall.call(auctionCallContext).then((response) => {
                    if (response.results.lootboxContract) {
                        response.results.lootboxContract.callsReturnContext.forEach(
                            (ctx, index) => {
                                //@ts-ignore
                                _temp.auctionedItems[index].requestID =
                                    web3.utils.hexToNumberString(
                                        ctx.returnValues[1].hex
                                    );
                                //@ts-ignore
                                _temp.auctionedItems[index].randomWords =
                                    ctx.returnValues[2].map((x) => {
                                        return web3.utils.hexToNumber(x.hex);
                                    });
                                //@ts-ignore
                                _temp.auctionedItems[index].claimed =
                                    ctx.returnValues[3];

                                LootboxUtilModel.loadLootboxImage(
                                    //@ts-ignore
                                    _temp.auctionedItems[index]
                                );
                            }
                        );
                    }
                })
            );

            const listedCallContext = [
                {
                    reference: "lootboxContract",
                    contractAddress: lootboxContractAddress,
                    abi: LootboxABI,
                    calls: _temp.listedItems.map((box) => {
                        return {
                            reference: "getLootboxCall",
                            methodName: "getLootbox",
                            methodParameters: [box.id],
                        };
                    }),
                },
            ];

            promises.push(
                multicall.call(listedCallContext).then((response) => {
                    if (response.results.lootboxContract) {
                        response.results.lootboxContract.callsReturnContext.forEach(
                            (ctx, index) => {
                                //@ts-ignore
                                _temp.listedItems[index].requestID =
                                    web3.utils.hexToNumberString(
                                        ctx.returnValues[1].hex
                                    );
                                //@ts-ignore
                                _temp.listedItems[index].randomWords =
                                    ctx.returnValues[2].map((x) => {
                                        return web3.utils.hexToNumber(x.hex);
                                    });
                                //@ts-ignore
                                _temp.listedItems[index].claimed =
                                    ctx.returnValues[3];

                                LootboxUtilModel.loadLootboxImage(
                                    //@ts-ignore
                                    _temp.listedItems[index]
                                );
                            }
                        );
                    }
                })
            );

            const offerReceivedCallContext = [
                {
                    reference: "lootboxContract",
                    contractAddress: lootboxContractAddress,
                    abi: LootboxABI,
                    calls: _temp.offerReceivedItems.map((box) => {
                        return {
                            reference: "getLootboxCall",
                            methodName: "getLootbox",
                            methodParameters: [box.id],
                        };
                    }),
                },
            ];

            promises.push(
                multicall.call(offerReceivedCallContext).then((response) => {
                    if (response.results.lootboxContract) {
                        response.results.lootboxContract.callsReturnContext.forEach(
                            (ctx, index) => {
                                //@ts-ignore
                                _temp.offerReceivedItems[index].requestID =
                                    web3.utils.hexToNumberString(
                                        ctx.returnValues[1].hex
                                    );
                                //@ts-ignore
                                _temp.offerReceivedItems[index].randomWords =
                                    ctx.returnValues[2].map((x) => {
                                        return web3.utils.hexToNumber(x.hex);
                                    });
                                //@ts-ignore
                                _temp.offerReceivedItems[index].claimed =
                                    ctx.returnValues[3];

                                LootboxUtilModel.loadLootboxImage(
                                    //@ts-ignore
                                    _temp.offerReceivedItems[index]
                                );
                            }
                        );
                    }
                })
            );

            const ownedCallContext = [
                {
                    reference: "lootboxContract",
                    contractAddress: lootboxContractAddress,
                    abi: LootboxABI,
                    calls: _temp.ownedItems.map((box) => {
                        return {
                            reference: "getLootboxCall",
                            methodName: "getLootbox",
                            methodParameters: [box.id],
                        };
                    }),
                },
            ];

            promises.push(
                multicall.call(ownedCallContext).then((response) => {
                    if (response.results.lootboxContract) {
                        response.results.lootboxContract.callsReturnContext.forEach(
                            (ctx, index) => {
                                //@ts-ignore
                                _temp.ownedItems[index].requestID =
                                    web3.utils.hexToNumberString(
                                        ctx.returnValues[1].hex
                                    );
                                //@ts-ignore
                                _temp.ownedItems[index].randomWords =
                                    ctx.returnValues[2].map((x) => {
                                        return web3.utils.hexToNumber(x.hex);
                                    });
                                //@ts-ignore
                                _temp.ownedItems[index].claimed =
                                    ctx.returnValues[3];

                                LootboxUtilModel.loadLootboxImage(
                                    //@ts-ignore
                                    _temp.ownedItems[index]
                                );
                            }
                        );
                    }
                })
            );

            await Promise.all(promises);
            return _temp;
        },
        []
    );
    // #endregion

    // useEffects
    useEffect(() => {
        getTokenInfoWithPrice(wbnbTokenAddress).then((tokenInfo) => {
            setBnbPrice(+tokenInfo.price);
        });
        getTokenInfoWithPrice(ectoContractAddress).then((tokenInfo) => {
            setEctoPrice(+tokenInfo.price);
        });
    }, [setBnbPrice, setEctoPrice]);

    useEffect(() => {
        autoLogin()
            .then((response) => {
                const responseData = response.data as {
                    data: User;
                };
                setUser(responseData.data);
                overrideLocalSettings(responseData.data);
            })
            .catch((error) => {
                console.log(error);
                handleUnauthorizedResponse();
            });
    }, [handleUnauthorizedResponse, setUser]);

    useEffect(() => {
        setAccountBnbBalance(bnbBalance);
    }, [bnbBalance, setAccountBnbBalance]);

    useEffect(() => {
        setAccountEctoBalance(ectoBalance);
    }, [ectoBalance, setAccountEctoBalance]);

    useEffect(() => {
        setAccountOldEctoBalance(oldEctoBalance);
    }, [oldEctoBalance, setAccountOldEctoBalance]);

    useEffect(() => {
        setAccountBusdBalance(busdBalance);
    }, [busdBalance, setAccountBusdBalance]);

    useEffect(() => {
        setAccountWbnbBalance(wbnbBalance);
    }, [wbnbBalance, setAccountWbnbBalance]);

    useEffect(() => {
        setAccountGhosts(accountGhosts);
    }, [accountGhosts, setAccountGhosts]);

    useEffect(() => {
        setAccountSkeletons(accountSkeletons);
    }, [accountSkeletons, setAccountSkeletons]);

    useEffect(() => {
        setAccountSoulEaters(accountSoulEaters);
    }, [accountSoulEaters, setAccountSoulEaters]);

    useEffect(() => {
        setAccountSolanaAssets(accountSolanaAssets);
    }, [accountSolanaAssets, setAccountSolanaAssets]);

    useEffect(() => {
        let mounted = true;
        handleFormatAccountFoundersLootboxes(accountFoundersLootboxes).then(
            (_temp) => {
                if (mounted) {
                    setAccountFoundersLootboxes(_temp);
                }
            }
        );

        return () => {
            mounted = false;
        };
    }, [
        accountFoundersLootboxes,
        setAccountFoundersLootboxes,
        handleFormatAccountFoundersLootboxes,
    ]);

    useEffect(() => {
        setAccountFoundersItems(accountFoundersLootboxItems);
    }, [accountFoundersLootboxItems, setAccountFoundersItems]);

    useEffect(() => {
        setClaimableBnbRewards(claimableBnbRewards);
    }, [claimableBnbRewards, setClaimableBnbRewards]);

    useEffect(() => {
        setClaimableWbnbRewards(claimableWbnbRewards);
    }, [claimableWbnbRewards, setClaimableWbnbRewards]);

    useEffect(() => {
        setClaimableBusdRewards(Number(claimableBusdRewards.unpaidEarnings));
    }, [claimableBusdRewards, setClaimableBusdRewards]);

    useEffect(() => {
        setNotifstackPositionSelection(
            AlertDisplayPositionUtilModel.notifstackPositionSelections[
                alertDisplayPosition
            ] ||
                AlertDisplayPositionUtilModel.notifstackPositionSelections
                    .TOP_RIGHT
        );
    }, [alertDisplayPosition]);

    return (
        <ThemeProvider theme={theme}>
            {/* @ts-ignore */}
            <SnackbarProvider
                maxSnack={10}
                anchorOrigin={{
                    vertical: notifstackPositionSelection.vertical,
                    horizontal: notifstackPositionSelection.horizontal,
                }}
                autoHideDuration={7000}
            >
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />}></Route>
                        <Route path="/csgo" element={<RaffleRoller />}></Route>
                        <Route path="/onboarding" element={<Onboarding />} />
                        <Route path="/download" element={<Download />} />
                        <Route path="/test" element={<Test />}></Route>
                        <Route
                            path="/account/activation"
                            element={<EmailVerification />}
                        ></Route>
                        <Route
                            path="/account/emailUpdateRequest"
                            element={<EmailUpdateConfirmation />}
                        ></Route>
                        <Route
                            path="/account/passwordreset"
                            element={<PasswordReset />}
                        ></Route>
                        <Route
                            path="/marketplace/login"
                            element={<Login />}
                        ></Route>
                        <Route
                            path="/marketplace/profile/:section/:asset"
                            element={<Profile />}
                        ></Route>
                        <Route
                            path="/marketplace/profile/:section"
                            element={<Profile />}
                        ></Route>
                        <Route
                            path="/marketplace/profile"
                            element={
                                <Navigate
                                    replace
                                    to={`/marketplace/profile/dashboard`}
                                />
                            }
                        ></Route>
                        {/* <Route
                            path="/marketplace/dashboard"
                            element={<Marketplace />}
                        ></Route> */}
                        <Route
                            path="/marketplace/treasury"
                            element={<Vault />}
                        ></Route>
                        <Route
                            path="/marketplace/treasury/:asset"
                            element={<Vault />}
                        ></Route>
                        <Route path="/shop" element={<Shop />}></Route>
                        <Route
                            path="/shop/purchase/:asset"
                            element={<PurchasePage />}
                        />
                        <Route
                            path="/marketplace/:asset"
                            element={<Marketplace />}
                        ></Route>
                        <Route
                            path="/marketplace/souleater/:id"
                            element={<SECollectionItem />}
                        ></Route>
                        <Route
                            path="/marketplace/:asset/:id"
                            element={<CollectionItem />}
                        ></Route>
                        <Route
                            path="/marketplace"
                            element={
                                <Navigate
                                    replace
                                    to={`/marketplace/dashboard`}
                                />
                            }
                        ></Route>

                        <Route path="/dao" element={<Dao />}></Route>
                        <Route
                            path="/dao/create"
                            element={<NewProposal />}
                        ></Route>
                        <Route
                            path="/dao/create/:id"
                            element={<NewProposal />}
                        ></Route>
                        <Route
                            path="/dao/proposals/:id"
                            element={<ProposalDetail />}
                        ></Route>

                        <Route
                            path="/mint"
                            element={<LootboxMinting />}
                        ></Route>
                        <Route
                            path="/staking"
                            element={<StakingPool />}
                        ></Route>
                        <Route
                            path="/community"
                            element={<Community />}
                        ></Route>
                        <Route
                            path="/community/treasury"
                            element={<Community />}
                        ></Route>
                        <Route
                            path="/community/mint"
                            element={<Community />}
                        ></Route>
                        <Route
                            path="/community/bridge"
                            element={<Community />}
                        ></Route>
                        <Route
                            path="/community/dao"
                            element={<Community />}
                        ></Route>
                        <Route
                            path="/wallet/:address/:asset"
                            element={<Wallet />}
                        ></Route>
                        <Route
                            path="/wallet/:address"
                            element={<Wallet />}
                        ></Route>
                        <Route
                            path="/nftbridge"
                            element={<NFtBridge />}
                        ></Route>
                        <Route
                            path="/community/:section"
                            element={<Community />}
                        ></Route>
                        <Route
                            path="/community/:section/:asset"
                            element={<Community />}
                        ></Route>
                        <Route path="/knowledge" element={<Knowledge />} />
                        <Route
                            path="/souleaters"
                            element={
                                <Navigate
                                    replace
                                    to={`/marketplace/souleaters`}
                                />
                            }
                        />
                    </Routes>
                </Layout>
            </SnackbarProvider>
        </ThemeProvider>
    );
};

export default App;
