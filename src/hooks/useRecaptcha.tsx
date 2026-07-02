import ReCAPTCHA from "react-google-recaptcha";
import { RECAPTCHA_ENABLED, RECAPTCHA_SITE_KEY } from "../constants/recaptchaSiteKeys";
import { useCallback, useRef, useState } from "react";

/*
 *   This hook manages the state required to make recaptcha functional
 *   Returns value of the recaptcha token
 *   Returns state management functions
 *   Returns recaptcha UI component
 */
export const useRecaptcha = () => {
    const [recaptchaToken, setRecaptchaToken] = useState<any>(null);
    const [showRecaptcha, setShowRecaptcha] = useState(false);
    const recaptchaRef = useRef<any>();

    const canSubmitRecaptcha = useCallback(() => {
        if (!RECAPTCHA_ENABLED) return true;
        if (!recaptchaToken) {
            if (!showRecaptcha) {
                setShowRecaptcha(true);
            }
            return false;
        } else {
            return true;
        }
    }, [recaptchaToken, showRecaptcha, setShowRecaptcha]);

    const recaptchaSuccess = useCallback(() => {
        if (recaptchaRef.current) {
            recaptchaRef.current.reset();
        }
        setShowRecaptcha(false);
        setRecaptchaToken(null);
    }, [recaptchaRef, setShowRecaptcha, setRecaptchaToken]);

    const recaptchaError = useCallback(() => {
        setShowRecaptcha(false);
        setRecaptchaToken(null);
    }, [setShowRecaptcha, setRecaptchaToken]);

    const Recaptcha = useCallback(
        (props) => {
            return (
                <>
                    {showRecaptcha && RECAPTCHA_ENABLED && (
                        <ReCAPTCHA
                            className={props.className || ""}
                            sitekey={RECAPTCHA_SITE_KEY}
                            ref={recaptchaRef}
                            onChange={(token) => {
                                if (token) {
                                    setRecaptchaToken(token);
                                }
                            }}
                            onExpired={() => {
                                setRecaptchaToken(null);
                            }}
                            theme="dark"
                        />
                    )}
                </>
            );
        },
        [recaptchaRef, setRecaptchaToken, showRecaptcha]
    );

    return {
        recaptchaToken,
        canSubmitRecaptcha,
        recaptchaSuccess,
        recaptchaError,
        Recaptcha,
    };
};
