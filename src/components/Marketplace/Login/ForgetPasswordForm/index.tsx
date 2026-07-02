import { useTranslation } from "react-i18next";
import { RECAPTCHA_SITE_KEY } from "../../../../constants/recaptchaSiteKeys";
import { useUpdateOverlay } from "../../../../state/application/hooks";
import { useSnackbar } from "notistack";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import LoginPageState from "../types/LoginPageState";
import { Grid } from "@mui/material";
import Loading from "../../../widgets/Loading";
import ReCAPTCHA from "react-google-recaptcha";
import { validateEmail } from "../../../../utils/emailUtil";
import { useNavigate } from "react-router";
import { sendForgetPasswordEmail } from "../../../../apis/web/web.api";

const ForgetPasswordForm = ({
    onPageStateChange,
}: {
    onPageStateChange: (state: LoginPageState) => void;
}) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "Login",
    });

    const [email, setEmail] = useState("");
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [recaptcha, setRecaptcha] = useState("");
    const [showRecaptcha, setShowRecaptcha] = useState(false);
    const [disableSendEmail, setDisableSendEmail] = useState(true);

    const { enqueueSnackbar } = useSnackbar();
    const updateOverlay = useUpdateOverlay();
    const navigate = useNavigate();

    const onSendForgetPasswordEmail = useCallback(
        async (evt: FormEvent<HTMLFormElement>) => {
            evt.preventDefault();

            if (!showRecaptcha) {
                setShowRecaptcha(true);
                return;
            }

            if (!email || !isValidEmail || !recaptcha) {
                return;
            }
            updateOverlay(true);
            const cleanup = () => {
                updateOverlay(false);
                onPageStateChange("login");
                enqueueSnackbar(
                    "We will send you an email to reset your password if the email entered is valid and registered",
                    {
                        variant: "success",
                    }
                );
            };
            sendForgetPasswordEmail({
                email,
                recaptcha,
            })
                .then((res) => {
                    cleanup();
                })
                .catch((err) => {
                    console.log(err);
                    cleanup();
                });
        },
        [
            showRecaptcha,
            email,
            isValidEmail,
            recaptcha,
            updateOverlay,
            onPageStateChange,
            enqueueSnackbar,
        ]
    );

    useEffect(() => {
        if (showRecaptcha) {
            if (email && recaptcha && isValidEmail) {
                setDisableSendEmail(false);
                return () => {};
            }
        } else if (email && isValidEmail) {
            setDisableSendEmail(false);
            return () => {};
        }
        setDisableSendEmail(true);
        return () => {};
    }, [email, isValidEmail, recaptcha, showRecaptcha]);

    useEffect(() => {
        setIsValidEmail(validateEmail(email));
    }, [email]);

    return (
        <form
            className="forget-email-form"
            onSubmit={(evt) => {
                onSendForgetPasswordEmail(evt);
            }}
        >
            <Grid container direction="column">
                <Grid item>
                    <div className="email-input">
                        {email && !isValidEmail && (
                            <div className="email-error">
                                <Loading loading={!ready}>
                                    {
                                        t("invalid_email", {
                                            defaultValue: "Invalid email",
                                        })!
                                    }
                                </Loading>
                            </div>
                        )}

                        <Loading loading={!ready}>
                            <input
                                className="email"
                                type="email"
                                placeholder={t("email", {
                                    defaultValue: "Email",
                                })}
                                value={email}
                                onChange={(evt) => {
                                    setEmail(evt.currentTarget.value);
                                }}
                            />
                        </Loading>
                    </div>
                </Grid>
                <Grid item className={`mt-4 ${!showRecaptcha ? "hide" : ""}`}>
                    <ReCAPTCHA
                        className="recaptcha"
                        sitekey={RECAPTCHA_SITE_KEY}
                        onChange={(token) => {
                            if (token) {
                                setRecaptcha(token);
                            }
                        }}
                        onExpired={() => {
                            setRecaptcha("");
                        }}
                    />
                </Grid>
                <Grid item className="mt-5">
                    <button
                        className="reset-password"
                        disabled={disableSendEmail}
                    >
                        <span className="btn-text">
                            <Loading loading={!ready} width="120px">
                                {t("reset_password", {
                                    defaultValue: "Reset password",
                                })}
                            </Loading>
                        </span>
                    </button>
                </Grid>
                <Grid item className="mt-5">
                    <Grid container justifyContent="center">
                        <Grid item>
                            <button
                                className="back-to-login"
                                onClick={() => {
                                    onPageStateChange("login");
                                }}
                            >
                                <Loading loading={!ready}>
                                    {
                                        t("back_to_login", {
                                            defaultValue: "Back to login",
                                        })!
                                    }
                                </Loading>
                            </button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </form>
    );
};

export default ForgetPasswordForm;
