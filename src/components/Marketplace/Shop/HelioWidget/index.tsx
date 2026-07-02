import { HelioCheckout } from "@heliofi/checkout-react";
import { useMemo } from "react";

export const HelioWidget = ({
    type,
    paylinkId,
    additionalJSON,
}: {
    type: string;
    paylinkId: string;
    additionalJSON?: any;
}) => {
    const helioConfigVault = useMemo(() => {
        return {
            paylinkId: paylinkId,
            theme: { themeMode: "dark" },
            display: "button",
            additionalJSON: additionalJSON,
            customTexts: {
                mainButtonTitle: "Pay With Helio (Send To Vault)",
            },
            onSuccess: (event) => console.log("Helio Success: ", event),
            onError: (event) => console.log("Helio Error: ", event),
            onPending: (event) => console.log("Helio Pending: ", event),
            onCancel: (event) => console.log("Cancelled payment", event),
            onStartPayment: (event) => console.log("Starting payment", event),
        };
    }, [additionalJSON]);

    const helioConfigWallet = {
        paylinkId: paylinkId,
        theme: { themeMode: "dark" },
        display: "button",
        customTexts: {
            mainButtonTitle: "Pay With Helio (Send To Wallet)",
        },
        onSuccess: (event) => console.log("Helio Success: ", event),
        onError: (event) => console.log("Helio Error: ", event),
        onPending: (event) => console.log("Helio Pending: ", event),
        onCancel: () => console.log("Cancelled payment"),
        onStartPayment: () => console.log("Starting payment"),
    };

    return (
        <>
            {type === "vault" ? (
                // @ts-ignore
                <HelioCheckout config={helioConfigVault} />
            ) : (
                // @ts-ignore
                <HelioCheckout config={helioConfigWallet} />
            )}
        </>
    );
};
