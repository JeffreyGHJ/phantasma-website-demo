import { useLocation, useNavigate } from "react-router";
import "./index.scss";
import { useEffect, useState } from "react";
import ShopItems from "../shop-items.json";
import Loader from "../../../widgets/Loader";
import { HelioWidget } from "../HelioWidget";
import { ItemPrice } from "./ItemPrice";
import { useUser } from "../../../../state/application/hooks";
import CreateVault from "../../ProfileLayout/Inventory/CreateVault";
import { useWeb3React } from "@web3-react/core";
import { useTranslation } from "react-i18next";
import Loading from "../../../widgets/Loading";
import { useWalletModal } from "../../../../hooks/useWalletModal";
import WalletModal from "../../../shared/WalletModal/WalletModal";
import { findShopItemFromURL } from "../functions";
import ItemDetails from "./ItemDetails";

export const PurchasePage = () => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "ProfileLayoutSidebar",
    });

    const navigate = useNavigate();
    const location = useLocation();
    const user = useUser();
    const { account } = useWeb3React();
    const [item, setItem] = useState<any>(null);

    const {
        isWalletModalOpen,
        handleModalOpen,
        handleModalClose,
        handleWalletClick,
    } = useWalletModal();

    useEffect(() => {
        setItem(findShopItemFromURL(location, ShopItems));
    }, [location]);

    useEffect(() => {
        console.log("user: ", user);
    }, [user]);

    useEffect(() => {
        console.log("item: ", item);
    }, [item]);

    return (
        <div id="PurchasePage" className="scrollbar">
            {item === null && <Loader show={true} />}
            {item === undefined && (
                <div className="not-found">404 - Item Not Found</div>
            )}
            {!!item && (
                <>
                    <ItemDetails item={item} />

                    <div className="purchase-controls">
                        <ItemPrice item={item} />

                        <div className="button-group">
                            {!item.paylinkId && (
                                <div className="missing-paylink">
                                    <div>Error: Item PaylinkId Not Found</div>
                                    <div>Please Contact Site Owner</div>
                                </div>
                            )}
                            {!!item.paylinkId && (
                                <>
                                    {/* USER NOT LOGGED IN */}
                                    {!user && (
                                        <div
                                            className="option"
                                            onClick={() =>
                                                navigate("/marketplace/login")
                                            }
                                        >
                                            Login
                                        </div>
                                    )}

                                    {/* USER LOGGED IN */}
                                    {user && (
                                        <>
                                            {/* VAULT NOT CREATED */}
                                            {!user.VaultSOLAddress && (
                                                <CreateVault user={user} />
                                            )}

                                            {/* VAULT CREATED */}
                                            {user.VaultSOLAddress && (
                                                <div className="helio-container">
                                                    <HelioWidget
                                                        type={"vault"}
                                                        paylinkId={
                                                            item.paylinkId
                                                        }
                                                        additionalJSON={{
                                                            solAddress: `${user.VaultSOLAddress}`,
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {/* WALLET NOT CONNECTED */}
                                    {!account && (
                                        <div
                                            className="connect-wallet option"
                                            onClick={() => handleModalOpen()}
                                        >
                                            <Loading loading={!ready}>
                                                {t("connect_wallet", {
                                                    defaultValue:
                                                        "Connect Wallet",
                                                })}
                                            </Loading>
                                        </div>
                                    )}

                                    {/* WALLET CONNECTED */}
                                    {account && (
                                        <div className="helio-container">
                                            <HelioWidget
                                                type={"wallet"}
                                                paylinkId={item.paylinkId}
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
            <WalletModal
                open={isWalletModalOpen}
                handleClose={handleModalClose}
                handleWalletClick={handleWalletClick}
            />
        </div>
    );
};
