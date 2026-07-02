import "./index.scss";

const EmptyItem = () => {
    return (
        <div id="Item">
            <div className="empty-item-content">
                <img
                    className="logo"
                    src={process.env.PUBLIC_URL + "/phantasma-logo.png"}
                />
            </div>
        </div>
    );
};

export default EmptyItem;
