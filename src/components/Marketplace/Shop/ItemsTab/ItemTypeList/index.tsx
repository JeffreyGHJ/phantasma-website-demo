import "./index.scss";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const ItemTypeList = ({
    ITEM_TYPES,
    selectedItemType,
    setSelectedItemType,
    setShowMobileMenu,
}) => {
    const itemTypeButtonStyle = (itemType) => {
        return (
            "item-type-button " +
            (selectedItemType === itemType ? " active" : " inactive")
        );
    };

    const indicatorStyle = (itemType) => {
        return (
            "selection-indicator " +
            (selectedItemType === itemType ? "" : "hidden")
        );
    };

    return (
        <div id="item-type-list" className="scrollbar">
            {Object.values(ITEM_TYPES).map((itemType, index) => (
                <>
                    <div
                        className={itemTypeButtonStyle(itemType)}
                        onClick={() => setShowMobileMenu(false)}
                    >
                        {selectedItemType === itemType && (
                            <div className="gradient-border-effect" />
                        )}
                        <div
                            className={
                                "item-type-button-inner " +
                                (selectedItemType === itemType
                                    ? "active-inner"
                                    : "")
                            }
                            onClick={() => setSelectedItemType(itemType)}
                        >
                            <div className={indicatorStyle(itemType)}>
                                <PlayArrowIcon />
                            </div>
                            {itemType}
                        </div>
                    </div>
                    <div
                        className={
                            "divider " +
                            (selectedItemType !== itemType &&
                            selectedItemType !== ITEM_TYPES[index + 1]
                                ? ""
                                : " black-bg")
                        }
                    />
                </>
            ))}
        </div>
    );
};

export default ItemTypeList;
