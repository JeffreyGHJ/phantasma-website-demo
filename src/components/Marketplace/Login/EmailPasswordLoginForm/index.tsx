import { useTranslation } from "react-i18next";
import {
    useUpdateOverlay,
    useUpdateUser,
} from "../../../../state/application/hooks";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";
import { FormEvent, useEffect, useRef, useState } from "react";
import AccountModel from "../../../../models/AccountModel";
import { login } from "../../../../apis/web/web.api";
import recaptchaTypes from "../../../../constants/recaptchaTypes";
import LoginPageState from "../types/LoginPageState";
import User from "../../../../constants/types/User";
import WebErrorResponse from "../../../../constants/types/WebErrorResponse";
import authErrorReasons from "../../../../constants/errorReasons/authErrorReasons";
import { Grid } from "@mui/material";
import Loading from "../../../widgets/Loading";
import ReCAPTCHA from "react-google-recaptcha";
import { RECAPTCHA_ENABLED, RECAPTCHA_SITE_KEY } from "../../../../constants/recaptchaSiteKeys";
import SendEmailVerificationDialog from "../../../shared/SendEmailVerificationDialog";

const EmailPasswordLoginForm = ({
    onPageStateChange,
}: {
    onPageStateChange: (state: LoginPageState) => void;
}) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "Login",
    });
    const updateUser = useUpdateUser();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const updateOverlay = useUpdateOverlay();

    const [credential, setCredential] = useState("");
    const [recaptcha, setRecaptcha] = useState("");
    const [showRecaptcha, setShowRecaptcha] = useState(false);
    const [password, setPassword] = useState("");
    const [disableSignIn, setDisableSignIn] = useState(true);
    const [rememberMe, setRememberMe] = useState(false);
    const [unverifiedEmail, setUnverifiedEmail] = useState("");
    const recaptchaRef = useRef<any>();
    const [
        showSendEmailVerificationDialog,
        setShowSendEmailVerificationDialog,
    ] = useState(false);
    const overrideLocalSettings = AccountModel.useOverrideLocalSettings();

    const onLoginFormSubmit = async (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();

        if (RECAPTCHA_ENABLED && !showRecaptcha) {
            setShowRecaptcha(true);
            return;
        }

        if (!credential || !password || (RECAPTCHA_ENABLED && !recaptcha)) {
            return;
        }

        updateOverlay(true);
        login({
            credential,
            password,
            recaptcha,
            recaptchaType: recaptchaTypes.V2_CHECKBOX,
            remember_me: rememberMe,
        })
            .then((response) => {
                // Define interfaces to describe the expected shape of res.data
                interface AccessToken {
                    expires: string;
                    token: string;
                }

                interface ResponseData {
                    data: User;
                    accessToken: AccessToken;
                    refreshToken: AccessToken; // Assuming refreshToken has a similar structure to accessToken
                }
                // Assert the type of res.data
                const responseData = response.data as ResponseData;
                // Now TypeScript knows the shape of res.data, so you can access the nested token properties without ts-ignore
                localStorage.setItem(
                    "accessToken",
                    responseData.accessToken.token
                );
                localStorage.setItem(
                    "refreshToken",
                    responseData.refreshToken.token
                );
                updateUser(responseData.data);
                overrideLocalSettings(responseData.data);
                updateOverlay(false);
                navigate("/marketplace/profile/dashboard");
            })
            .catch((err) => {
                if (!err.response) {
                    enqueueSnackbar("Unknown error. Please try again later", {
                        variant: "error",
                    });
                } else {
                    const errorResponse = err.response.data as WebErrorResponse;
                    if (
                        errorResponse.errReason &&
                        errorResponse.errReason ===
                            authErrorReasons.EMAIL_NOT_VERIFIED
                    ) {
                        // Handle email not verified error
                        setUnverifiedEmail(errorResponse.data.email);
                        setShowSendEmailVerificationDialog(true);
                    } else if (errorResponse.errMsg) {
                        enqueueSnackbar(errorResponse.errMsg, {
                            variant: "error",
                        });
                    } else {
                        enqueueSnackbar(
                            "Unknown error. Please try again later",
                            {
                                variant: "error",
                            }
                        );
                    }
                }
                updateOverlay(false);
                if (recaptchaRef.current) {
                    recaptchaRef.current.reset();
                }
            });
    };

    useEffect(() => {
        if (showRecaptcha) {
            if (credential && password && recaptcha) {
                setDisableSignIn(false);
                return () => {};
            }
        } else if (credential && password) {
            setDisableSignIn(false);
            return () => {};
        }
        setDisableSignIn(true);
        return () => {};
    }, [credential, password, recaptcha, showRecaptcha]);

    return (
        <>
            <form
                className="email-login-form"
                onSubmit={(evt) => {
                    onLoginFormSubmit(evt);
                }}
            >
                <Grid container direction="column">
                    <Grid item>
                        <div className="email-input">
                            <Loading loading={!ready}>
                                <input
                                    className="credential"
                                    placeholder={t("email_or_username", {
                                        defaultValue: "Email / username",
                                    })}
                                    value={credential}
                                    onChange={(evt) => {
                                        setCredential(evt.currentTarget.value);
                                    }}
                                />
                            </Loading>
                        </div>
                    </Grid>
                    <Grid item className="mt-4">
                        <div className="password-input">
                            <Loading loading={!ready}>
                                <input
                                    className="password"
                                    type="password"
                                    placeholder={t("password", {
                                        defaultValue: "Password",
                                    })}
                                    value={password}
                                    onChange={(evt) => {
                                        setPassword(evt.currentTarget.value);
                                    }}
                                />
                            </Loading>
                        </div>
                    </Grid>
                    <Grid item className="mt-4">
                        <Grid container justifyContent="space-between">
                            <Grid item>
                                <label className="checkbox remember-me">
                                    <input
                                        type="checkbox"
                                        name="checkbox"
                                        checked={rememberMe}
                                        onChange={() => {
                                            setRememberMe(!rememberMe);
                                        }}
                                    />
                                    <span className="label">
                                        <Loading loading={!ready}>
                                            {t("remember_me", {
                                                defaultValue: "Remember me",
                                            })}
                                        </Loading>
                                    </span>
                                </label>
                            </Grid>
                            <Grid item>
                                <button
                                    className="forgot-password"
                                    type="button"
                                    onClick={() => {
                                        onPageStateChange("forgot-password");
                                    }}
                                >
                                    <Loading loading={!ready}>
                                        {t("forget_password", {
                                            defaultValue: "Forget password",
                                        })}
                                        ?
                                    </Loading>
                                </button>
                            </Grid>
                        </Grid>
                    </Grid>
                    {RECAPTCHA_ENABLED && (
                        <Grid
                            item
                            className={`mt-4 ${!showRecaptcha ? "hide" : ""}`}
                        >
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
                                    setRecaptcha("");
                                }}
                                theme="dark"
                            />
                        </Grid>
                    )}
                    <Grid item className="mt-5">
                        <button className="sign-in" disabled={disableSignIn}>
                            <span className="btn-text">
                                <Loading loading={!ready} width="120px">
                                    {t("sign_in", {
                                        defaultValue: "Sign in",
                                    })}
                                </Loading>
                            </span>
                        </button>
                    </Grid>
                    <Grid item className="mt-5">
                        <Grid container justifyContent="center">
                            <Grid item className="go-to-register">
                                <Loading loading={!ready}>
                                    {t("do_not_have_account", {
                                        defaultValue: "Don't have an account?",
                                    })}
                                </Loading>
                                <div
                                    className="link"
                                    onClick={() => {
                                        navigate("/onboarding");
                                    }}
                                >
                                    <Loading loading={!ready}>
                                        {t("register_here", {
                                            defaultValue: "Register here",
                                        })}
                                    </Loading>
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </form>
            <SendEmailVerificationDialog
                open={showSendEmailVerificationDialog}
                email={unverifiedEmail}
                onClose={() => {
                    setShowSendEmailVerificationDialog(false);
                }}
            />
        </>
    );
};

export default EmailPasswordLoginForm;
