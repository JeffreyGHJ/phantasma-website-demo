import { useTranslation } from "react-i18next";
import { usePreferredNftImageSize } from "../../../../../state/application/hooks";
import Loading from "../../../Loading";
import "./index.scss";

const SolanaNftCard = ({ item }) => {
    const { t: t_nft, ready: ready_nft } = useTranslation("translation", {
        keyPrefix: "CollectionNames",
    });

    const nftImageSize = usePreferredNftImageSize();

    return (
        <div
            className="widget NftCard"
            style={{
                height: `${nftImageSize}px`,
                width: `${nftImageSize}px`,
            }}
        >
            <img
                className="widget NftImage"
                src={item.image}
                alt={`${item.content.metadata.name} #${item.id}`}
                height={`${nftImageSize}px`}
                width={`${nftImageSize}px`}
                style={{
                    objectFit: "cover",
                    borderRadius: "5px",
                }}
            />

            <div className="nftCard-header">
                <div className="id name-id">
                    <Loading loading={!ready_nft}>
                        <div>{item.content.metadata.name}</div>
                        <div>
                            #{item.id.slice(0, 4) + "..." + item.id.slice(-4)}
                        </div>
                    </Loading>
                </div>
            </div>
        </div>
    );
};

export default SolanaNftCard;
