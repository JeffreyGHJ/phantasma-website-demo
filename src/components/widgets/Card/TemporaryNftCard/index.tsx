import "./index.scss";
import { useTranslation } from "react-i18next";
import { usePreferredNftImageSize } from "../../../../state/application/hooks";
import Loading from "../../Loading";
import { Link } from "react-router-dom";

const TemporaryNftCard = ({ item, pathPrefix }) => {
    const { t: t_nft, ready: ready_nft } = useTranslation("translation", {
        keyPrefix: "CollectionNames",
    });

    const nftImageSize = usePreferredNftImageSize();

    return (
        <Link
            to={
                pathPrefix
                    ? `${pathPrefix}/${item.id ? item.id : item.tokenId}`
                    : ""
            }
            className="widget NftCard"
            style={{
                height: `${nftImageSize}px`,
                width: `${nftImageSize * 0.8}px`,
            }}
        >
            {!!item.rank && <div className="rank">Rank: {item.rank}</div>}
            <img
                className="widget NftImage"
                src={`https://littleghosts.s3.us-east-2.amazonaws.com/souleaters/images/${item.tokenId}.png`}
                alt={`${item.name} #${item.tokenId}`}
                height={`${nftImageSize}px`}
                width={`${nftImageSize}px`}
                style={{
                    objectFit: "cover",
                    borderRadius: "5px",
                }}
            />

            <div className="nftCard-header">
                <div className="id">
                    <Loading loading={!ready_nft}>#{item.tokenId}</Loading>
                </div>
            </div>
        </Link>
    );
};

export default TemporaryNftCard;
