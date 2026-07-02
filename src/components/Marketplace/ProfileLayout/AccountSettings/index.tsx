import "./index.scss";

import {
    FormControl,
    MenuItem,
    Select,
    SelectChangeEvent,
    Switch,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    useOfferEmailNotification,
    useToggleView3d,
    useUpdateOfferEmailNotification,
    useUpdateOverlay,
    useUpdateUser,
    useUser,
    useView3d,
} from "../../../../state/application/hooks";
import {
    useQuickSpin,
    useToggleQuickSpin,
} from "../../../../state/application/hooks/quickSpin";

import AccountModel from "../../../../models/AccountModel";
import AlertDisplayPositionSelect from "../../../widgets/Select/AlertDisplayPositionSelect";
import EmailUpdateDialog from "../../../shared/EmailUpdateDialog";
import Input from "../../../widgets/Input";
import Loading from "../../../widgets/Loading";
import MergeAccountConfirmationDialog from "../../../shared/MergeAccountConfirmationDialog";
import { NftImageSizeSlider } from "../../../widgets/Slider/NftImageSizeSlider";
import NftsPerPageSelect from "../../../widgets/Select/NftsPerPageSelect";
import NotSignInAlert from "../../../widgets/Alert/NotSignInAlert";
import OutlinedButton from "../../../widgets/Button/OutlinedButton";
import PasswordUpdateDialog from "../../../shared/PasswordUpdateDialog";
import RewardSpinDialog from "../../../shared/RewardSpinDialog";
import SizeSlider from "../../../styled/SizeSlider";
import UserWalletAddresses from "../../../gadgets/UserWalletAddresses";
import i18next from "i18next";
import recaptchaTypes from "../../../../constants/recaptchaTypes";
import { updateUsername } from "../../../../apis/web/web.api";
import { useActiveWeb3React } from "../../../../hooks";
import { useHandleUnauthorizedResponse } from "../../../../hooks/useAuth";
import usePageTitle from "../../../../hooks/usePageTitle";
import usePreferencesDiffered from "../../../../models/AccountModel/hooks/usePreferencesDiffered";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { validateEmail } from "../../../../utils/emailUtil";
import { validateUsername } from "../../../../utils/usernameUtil";
import { useRecaptcha } from "../../../../hooks/useRecaptcha";

const languageMap = {
    en: { label: "English", dir: "ltr", active: true },
    "zh-CN": { label: "简体中文", dir: "ltr", active: false },
    "zh-TW": { label: "繁體中文", dir: "ltr", active: false },
};

const AccountSettings = () => {
    usePageTitle("Account Settings | Phantasma");

    const { account, library } = useActiveWeb3React();
    const { i18n } = useTranslation();
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "ProfileSections.AccountSetting",
    });

    const { enqueueSnackbar } = useSnackbar();
    const handleUnauthorizedResponse = useHandleUnauthorizedResponse();

    const {
        recaptchaToken,
        canSubmitRecaptcha,
        recaptchaSuccess,
        recaptchaError,
        Recaptcha,
    } = useRecaptcha();

    const preferencedDiffered = usePreferencesDiffered();

    // #region (global redux states)
    const user = useUser();
    const updateUser = useUpdateUser();
    const updateOverlay = useUpdateOverlay();
    const view3d = useView3d();
    const toggleView3d = useToggleView3d();
    const offerEmailNotification = useOfferEmailNotification();
    const updateOfferEmailNotification = useUpdateOfferEmailNotification();
    const quickSpin = useQuickSpin();
    const toggleQuickSpin = useToggleQuickSpin();
    // #endregion

    const handleLanguageChange = useCallback(
        async (event: SelectChangeEvent<string>) => {
            const item = event.target.value;
            i18next.changeLanguage(item);
        },
        []
    );

    const handleSyncUserPreferences = useCallback(async () => {
        if (!user) {
            return;
        }
        if (!canSubmitRecaptcha()) return;

        updateOverlay(true);
        AccountModel.syncSettings({
            recaptcha: recaptchaToken,
            recaptchaType: recaptchaTypes.V2_CHECKBOX,
        })
            .then((settings) => {
                const _user = { ...user };
                _user.settings = _user.settings.map((_setting) => {
                    const found = settings.find((x) => {
                        return x.setting_id === _setting.setting_id;
                    });
                    if (found) {
                        return found;
                    }
                    return _setting;
                });
                updateUser(_user);
                updateOverlay(false);
                enqueueSnackbar(
                    ready
                        ? t("successMessages.sync_user_settings", {
                              defaultValue: "Settings synced successfully",
                          })
                        : "Settings synced successfully",
                    {
                        variant: "success",
                    }
                );
                recaptchaSuccess();
            })
            .catch((error) => {
                if (error.response) {
                    const err = error.response.data;
                    enqueueSnackbar(err.errMsg || "Unknown error", {
                        variant: "error",
                    });

                    if (error.response.status === 401) {
                        handleUnauthorizedResponse();
                    }
                } else {
                    console.log(error);
                    enqueueSnackbar("Unknown error", {
                        variant: "error",
                    });
                }
                updateOverlay(false);
                recaptchaError();
            });
    }, [
        t,
        ready,
        user,
        recaptchaToken,
        updateOverlay,
        enqueueSnackbar,
        handleUnauthorizedResponse,
        updateUser,
    ]);

    // #region (Logged in User)
    const [username, setUsername] = useState("");
    const [isValidUsername, setIsValidUsername] = useState(false);
    const [email, setEmail] = useState("");
    // #endregion

    // #region (Email update dialog)
    const [emailUpdateDialogOpen, setEmailUpdateDialogOpen] = useState(false);
    // #endregion

    // #region (Password update dialog)
    const [passwordUpdateDialogOpen, setPasswordUpdateDialogOpen] =
        useState(false);
    // #endregion

    // #region (Merge account confirmation dialog)
    const [
        mergeAccountConfirmationDialogOpen,
        setMergeAccountConfirmationDialogOpen,
    ] = useState(false);
    // #endregion

    const updateNewUsername = useCallback(async () => {
        if (!user) {
            return;
        }

        if (user.username === username) {
            return;
        }

        if (!validateUsername(username)) {
            enqueueSnackbar(
                "Username must be between 2-14 characters. Lowercase letters and numbers only",
                {
                    variant: "error",
                }
            );
            return;
        }

        if (!canSubmitRecaptcha()) return;

        updateOverlay(true);
        updateUsername({
            username,
            recaptcha: recaptchaToken,
            recaptchaType: recaptchaTypes.V2_CHECKBOX,
        })
            .then((_username) => {
                const _user = { ...user };
                _user.username = _username;
                updateUser(_user);
                updateOverlay(false);
                enqueueSnackbar("Username updated successfully", {
                    variant: "success",
                });
                // if (recaptchaRef.current) {
                //     recaptchaRef.current.reset();
                // }
                // setShowRecaptcha(false);
                // setRecaptcha(null);
                recaptchaSuccess();
            })
            .catch((error) => {
                if (error.response) {
                    const err = error.response.data;
                    enqueueSnackbar(err.errMsg || "Unknown error", {
                        variant: "error",
                    });

                    if (error.response.status === 401) {
                        handleUnauthorizedResponse();
                    }
                } else {
                    console.log(error);
                    enqueueSnackbar("Unknown error", {
                        variant: "error",
                    });
                }
                updateOverlay(false);
                // setShowRecaptcha(false);
                // setRecaptcha(null);
                recaptchaError();
            });
    }, [
        recaptchaToken,
        user,
        username,
        enqueueSnackbar,
        handleUnauthorizedResponse,
        updateOverlay,
        updateUser,
        canSubmitRecaptcha,
        recaptchaError,
        recaptchaSuccess,
    ]);

    useEffect(() => {
        if (user) {
            setUsername(user.username || "");
            setEmail(user.email || "");
        }
    }, [user]);

    useEffect(() => {
        setIsValidUsername(validateUsername(username));
    }, [username]);

    return (
        <div id="AccountSettings">
            {!user && <NotSignInAlert />}
            <div className="title">
                <Loading loading={!ready}>
                    {t("account_settings", {
                        defaultValue: "Account Settings",
                    })}
                </Loading>
            </div>
            {!!user && (
                <section className="information-section">
                    <div className="section-title">
                        <Loading loading={!ready}>
                            {t("information", {
                                defaultValue: "Information",
                            })}
                        </Loading>
                    </div>
                    {/* {showRecaptcha && (
                        <ReCAPTCHA
                            className="recaptcha"
                            sitekey={RECAPTCHA_SITE_KEY}
                            ref={recaptchaRef}
                            onChange={(token) => {
                                if (token) {
                                    setRecaptcha(token);
                                }
                            }}
                            onExpired={() => {
                                setRecaptcha(null);
                            }}
                            theme="dark"
                        />
                    )} */}
                    <Recaptcha className="recaptcha" />
                    <div className="section-content">
                        <div className="information">
                            <div className="information-item">
                                <div className="label">
                                    <Loading loading={!ready}>
                                        {t("email", {
                                            defaultValue: "Email",
                                        })}
                                    </Loading>
                                </div>
                                <div>
                                    <Input
                                        value={email}
                                        onChange={(evt) => {
                                            setEmail(evt.currentTarget.value);
                                        }}
                                    />
                                </div>
                            </div>
                            {user.email !== email && validateEmail(email) && (
                                <div className="actions">
                                    <OutlinedButton
                                        onClick={() => {
                                            setEmailUpdateDialogOpen(true);
                                        }}
                                    >
                                        <Loading loading={!ready}>
                                            {t("save", {
                                                defaultValue: "Save",
                                            })}
                                        </Loading>
                                    </OutlinedButton>
                                </div>
                            )}
                        </div>
                        <div className="information">
                            <div className="information-item">
                                <div className="label">
                                    <Loading loading={!ready}>
                                        {t("username", {
                                            defaultValue: "Username",
                                        })}
                                    </Loading>
                                </div>
                                <div>
                                    {!isValidUsername && !!username && (
                                        <div className="username-error">
                                            <Loading loading={!ready}>
                                                {
                                                    t("invalid_username", {
                                                        defaultValue:
                                                            "Invalid username. Lowercase letters and numbers only. Must have 2-14 characters.",
                                                    })!
                                                }
                                            </Loading>
                                        </div>
                                    )}

                                    <Input
                                        value={username || ""}
                                        onChange={(evt) => {
                                            setUsername(
                                                evt.currentTarget.value.toLowerCase()
                                            );
                                        }}
                                    />
                                </div>
                            </div>
                            {user.username !== username && isValidUsername && (
                                <div className="actions">
                                    <OutlinedButton
                                        onClick={() => {
                                            updateNewUsername();
                                        }}
                                    >
                                        <Loading loading={!ready}>
                                            {t("save", {
                                                defaultValue: "Save",
                                            })}
                                        </Loading>
                                    </OutlinedButton>
                                </div>
                            )}
                        </div>
                        {user.email && (
                            <div className="information">
                                <div className="information-item">
                                    <div className="label">
                                        <Loading loading={!ready}>
                                            {t("password", {
                                                defaultValue: "Password",
                                            })}
                                        </Loading>
                                    </div>
                                    <div>
                                        <OutlinedButton
                                            onClick={() => {
                                                setPasswordUpdateDialogOpen(
                                                    true
                                                );
                                            }}
                                        >
                                            <Loading loading={!ready}>
                                                {t("update_password", {
                                                    defaultValue:
                                                        "Update Password",
                                                })}
                                            </Loading>
                                        </OutlinedButton>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="information">
                            <div className="information-item">
                                <div className="label">
                                    <Loading loading={!ready}>
                                        {t("wallet_addresses", {
                                            defaultValue: "Wallet Address",
                                        })}
                                    </Loading>
                                </div>

                                <UserWalletAddresses
                                    recaptchaToken={recaptchaToken}
                                    canSubmitRecaptcha={canSubmitRecaptcha}
                                    recaptchaSuccess={recaptchaSuccess}
                                    recaptchaError={recaptchaError}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            )}
            <section className="preference-section">
                <div className="section-header">
                    <div className="section-title">
                        <Loading loading={!ready}>
                            {t("preferences", {
                                defaultValue: "Preferences",
                            })}
                        </Loading>
                    </div>
                    <div>
                        {user && (
                            <OutlinedButton
                                disabled={!preferencedDiffered}
                                onClick={() => {
                                    handleSyncUserPreferences();
                                }}
                            >
                                <Loading loading={!ready}>
                                    {t("sync", {
                                        defaultValue: "Sync",
                                    })}
                                </Loading>
                            </OutlinedButton>
                        )}
                    </div>
                </div>
                <div className="section-content">
                    <div className="preference">
                        <div className="label">
                            <Loading loading={!ready}>
                                {t("language", {
                                    defaultValue: "Language",
                                })}
                            </Loading>
                        </div>
                        <div>
                            <FormControl
                                variant="outlined"
                                style={{
                                    minWidth: "160px",
                                }}
                            >
                                <Select
                                    value={i18n.language || "en"}
                                    onChange={handleLanguageChange}
                                >
                                    {Object.keys(languageMap).map((item) => (
                                        <MenuItem key={item} value={item}>
                                            {languageMap[item].label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                    <div className="preference">
                        <div className="label">
                            <Loading loading={!ready}>
                                {t("view", {
                                    defaultValue: "View",
                                })}{" "}
                                3D NFTs
                            </Loading>
                        </div>
                        <div>
                            <FormControl variant="outlined">
                                <Switch
                                    checked={view3d}
                                    onChange={() => {
                                        toggleView3d();
                                    }}
                                    color="primary"
                                />
                            </FormControl>
                        </div>
                    </div>
                    <div className="preference">
                        <div className="label">
                            <Loading loading={!ready}>
                                NFT{" "}
                                {t("image_size", {
                                    defaultValue: "Image Size",
                                })}
                            </Loading>
                        </div>
                        <SizeSlider>
                            <NftImageSizeSlider />
                        </SizeSlider>
                    </div>
                    <div className="preference">
                        <div className="label">
                            <Loading loading={!ready}>
                                {t("nfts_per_page", {
                                    defaultValue: "NFTs Per Page",
                                })}
                            </Loading>
                        </div>
                        <div>
                            <NftsPerPageSelect />
                        </div>
                    </div>
                    <div className="preference">
                        <div className="label">
                            <Loading loading={!ready}>
                                {t("alert_display_position", {
                                    defaultValue: "Alert Display Position",
                                })}
                            </Loading>
                        </div>
                        <div>
                            <AlertDisplayPositionSelect />
                        </div>
                    </div>
                    <div className="preference">
                        <div className="label">
                            <Loading loading={!ready}>
                                {t("quick_spin", {
                                    defaultValue: "Quick Spin",
                                })}
                            </Loading>
                        </div>
                        <div>
                            <FormControl variant="outlined">
                                <Switch
                                    checked={quickSpin}
                                    onChange={() => {
                                        toggleQuickSpin();
                                    }}
                                    color="primary"
                                />
                            </FormControl>
                        </div>
                    </div>
                    {user && (
                        <div className="preference">
                            <div className="label">
                                <Loading loading={!ready}>
                                    {t("nft_offer_notification", {
                                        defaultValue: "NFT Offer Notification",
                                    })}
                                </Loading>
                            </div>
                            <div>
                                <FormControl variant="outlined">
                                    <Switch
                                        checked={offerEmailNotification}
                                        onChange={() => {
                                            updateOfferEmailNotification(
                                                !offerEmailNotification
                                            );
                                        }}
                                        color="primary"
                                    />
                                </FormControl>
                            </div>
                        </div>
                    )}
                </div>
            </section>
            <PasswordUpdateDialog
                open={passwordUpdateDialogOpen}
                onClose={() => {
                    setPasswordUpdateDialogOpen(false);
                }}
            />
            <EmailUpdateDialog
                email={email}
                open={emailUpdateDialogOpen}
                onClose={() => {
                    setEmailUpdateDialogOpen(false);
                }}
            />
            <MergeAccountConfirmationDialog
                open={mergeAccountConfirmationDialogOpen}
                onClose={() => {
                    setMergeAccountConfirmationDialogOpen(false);
                }}
            />
            {/* <RewardSpinDialog open={true} onClose={() => {}} /> */}
        </div>
    );
};

export default AccountSettings;
