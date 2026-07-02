const CurrencyIcon = ({ currency, width = 22, height = 22, classes = "" }) => {
    return (
        <>
            {currency === "BNB" && (
                <img
                    width={width}
                    height={height + 2}
                    src={`${process.env.PUBLIC_URL}/assets/images/icons/token_icons/bnb.svg`}
                    className={classes}
                />
            )}
            {currency === "ECTO" && (
                <img
                    width={width}
                    height={height}
                    src={`${process.env.PUBLIC_URL}/assets/images/icons/token_icons/Ecto.png`}
                    className={classes}
                />
            )}
            {currency === "MATIC" && (
                <img
                    width={width}
                    height={height}
                    src={`${process.env.PUBLIC_URL}/assets/images/icons/token_icons/matic.svg`}
                    className={classes}
                />
            )}
        </>
    );
};
export default CurrencyIcon;
