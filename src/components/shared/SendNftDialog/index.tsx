import "./index.scss";

import Input from "../../widgets/Input";
import Loading from "../../widgets/Loading";
import Modal from "../../widgets/Modal";
import OutlinedButton from "../../widgets/Button/OutlinedButton";
import Translation from "../../widgets/Translation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getVaultEVMAddressByUsername } from "../../../apis/web/web.api";
import { useSnackbar } from "notistack";

const SendNftDialog = ({
    open,
    imageLink,
    onClose,
    onSend,
}: {
    open: boolean;
    imageLink: string;
    onClose: () => void;
    onSend: (address) => void;
}) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "Modals.SendNftDialog",
    });
    const { enqueueSnackbar } = useSnackbar();
    const [address, setAddress] = useState("");

    const findVaultAndSend = (username) => {
        getVaultEVMAddressByUsername({ username })
            .then((response) => {
                console.log(response);
                enqueueSnackbar(`Vault address found for user ${username}`, {
                    variant: "success",
                });
                return response;
            })
            .then((response: any) => {
                const vaultAddress = response.data;
                console.log("sending asset to: ", vaultAddress);
                onSend(vaultAddress);
            })
            .catch((error) => {
                console.log(error);
                if (error.response) {
                    const err = error.response.data;
                    enqueueSnackbar(err.errMsg || "Unknown error", {
                        variant: "error",
                    });
                } else {
                    enqueueSnackbar("Unknown error", {
                        variant: "error",
                    });
                }
            });
    };

    const handleSend = (inputValue) => {
        if (inputValue.length <= 14) {
            findVaultAndSend(inputValue);
        } else {
            onSend(inputValue);
        }
    };

    return (
        <Modal open={open} onClose={onClose} className="SendNftDialog">
            <div className="SendNftDialog-Content">
                <div>
                    <img
                        src={imageLink}
                        alt=""
                        height="200px"
                        width="200px"
                        style={{ objectFit: "cover", borderRadius: "100%" }}
                    />
                </div>

                <Translation ready={ready}>
                    <div className="title">
                        <Loading loading={!ready}>
                            {t("title", { defaultValue: "Send Now" })}
                        </Loading>
                    </div>
                </Translation>
                <Translation ready={ready}>
                    <div className="description">
                        <Loading loading={!ready}>
                            {t("description", {
                                defaultValue:
                                    "Enter username or address below but make sure its right before you send!",
                            })}
                        </Loading>
                    </div>
                </Translation>
                <div className="input-field">
                    <div>
                        <Input
                            required
                            onChange={(event) =>
                                setAddress(event.currentTarget.value)
                            }
                        />
                    </div>
                    <div className="button-wrapper">
                        <Translation ready={ready}>
                            {/* <OutlinedButton onClick={() => onSend(address)}> */}
                            <OutlinedButton onClick={() => handleSend(address)}>
                                <Loading loading={!ready}>
                                    {t("send", { defaultValue: "Send" })}
                                </Loading>
                            </OutlinedButton>
                        </Translation>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default SendNftDialog;
