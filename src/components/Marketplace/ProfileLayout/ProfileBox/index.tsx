import { useTranslation } from "react-i18next";
import Loading from "../../../widgets/Loading";
import "./index.scss";
import OutlinedButton from "../../../widgets/Button/OutlinedButton";
import { displayAddress } from "../../../../utils/StringUtil";

const ProfileBox = ({ user, account, handleModalOpen }) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "ProfileLayoutSidebar",
    });

    return (
        <div id="ProfileBox">
            {!user ? (
                <div className="mb-3">
                    <div className="status">
                        <Loading loading={!ready}>
                            {t("not_signed_in", {
                                defaultValue: "Not signed In",
                            })}
                        </Loading>
                    </div>
                </div>
            ) : (
                <div className="mb-3">
                    <div className="status">
                        <Loading loading={!ready}>
                            {t("welcome", {
                                defaultValue: "Welcome",
                            })}{" "}
                            {user.username}
                        </Loading>
                    </div>
                </div>
            )}
            <div className="address">
                <div>
                    <Loading loading={!ready}>
                        {account ? (
                            `${t("connected", {
                                defaultValue: "Connected",
                            })}:`
                        ) : (
                            <OutlinedButton
                                onClick={() => {
                                    handleModalOpen();
                                }}
                            >
                                <Loading loading={!ready}>
                                    {t("connect_wallet", {
                                        defaultValue: "Connect Wallet",
                                    })}
                                </Loading>
                            </OutlinedButton>
                        )}
                    </Loading>
                </div>
                <div>{displayAddress(account || "", 5, 4)}</div>
            </div>
        </div>
    );
};

export default ProfileBox;
