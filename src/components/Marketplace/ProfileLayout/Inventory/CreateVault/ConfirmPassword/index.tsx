import "./index.scss";
import Input from "../../../../../widgets/Input";
import { useState } from "react";
import { confirmPassword } from "../../../../../../apis/web/web.api";
import recaptchaTypes from "../../../../../../constants/recaptchaTypes";
import { useUpdateOverlay } from "../../../../../../state/application/hooks";
import { useSnackbar } from "notistack";
import { useRecaptcha } from "../../../../../../hooks/useRecaptcha";

const ConfirmPassword = ({ user, setPassword, setPasswordConfirmed }) => {
    const [passwordInputValue, setPasswordInputValue] = useState("");
    const {
        recaptchaToken,
        canSubmitRecaptcha,
        recaptchaSuccess,
        recaptchaError,
        Recaptcha,
    } = useRecaptcha();

    const { enqueueSnackbar } = useSnackbar();
    const updateOverlay = useUpdateOverlay();

    const handleConfirmPassword = () => {
        const credential = user.username || user.email;
        const password = passwordInputValue;

        if (!password) return;

        // RECAPTCHA
        if (!canSubmitRecaptcha()) return;

        updateOverlay(true);

        confirmPassword({
            credential,
            password,
            recaptcha: recaptchaToken as string,
            recaptchaType: recaptchaTypes.V2_CHECKBOX,
        })
            .then((res) => {
                console.log(res);
                enqueueSnackbar("Password confirmed successfully", {
                    variant: "success",
                });
                // RECAPTCHA
                recaptchaSuccess();
                updateOverlay(false);
                setPasswordConfirmed(true);
                setPassword(password);
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
                updateOverlay(false);
                // RECAPTCHA
                recaptchaError();
            });
    };

    return (
        <div id="ConfirmPassword">
            <div className="title">Confirm Password</div>
            <Input
                className="password"
                type="password"
                placeholder="Password"
                value={passwordInputValue}
                onChange={(evt) => {
                    setPasswordInputValue(evt.currentTarget.value);
                }}
            />
            <Recaptcha className={"recaptcha"} />
            {
                <div
                    className="confirm-pass-btn"
                    onClick={() => handleConfirmPassword()}
                >
                    Confirm
                </div>
            }
        </div>
    );
};

export default ConfirmPassword;
