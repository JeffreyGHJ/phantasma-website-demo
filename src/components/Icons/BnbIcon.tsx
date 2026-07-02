const BnbIcon = ({ width = 14, height = 14, classes = "" }) => {
    return (
        <img
            width={width}
            height={height}
            src={`${process.env.PUBLIC_URL}/assets/images/icons/token_icons/bnb.svg`}
            className={classes}
        />
    );
};

export default BnbIcon;
