const ItemDetails = ({ item }) => {
    return (
        <div className="item">
            <div className="item-preview">
                <img
                    className="img"
                    src={`${process.env.PUBLIC_URL}${item.image_source}`}
                />
                <div className="item-name">{item.name}</div>
            </div>

            <div className="item-info">
                <div className="info-line">
                    <div>Collection:</div>
                    <div>{item.collection}</div>
                </div>
                <div className="info-line">
                    <div>Item Type: </div>
                    <div>
                        {item.item_type} {`(${item.item_sub_type})`}
                    </div>
                </div>
            </div>
            <div className="address">{item.contractAddress}</div>
        </div>
    );
};

export default ItemDetails;
