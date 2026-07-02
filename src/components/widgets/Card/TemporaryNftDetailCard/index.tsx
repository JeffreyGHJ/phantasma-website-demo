import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import NftImage from "../../Image/NftImage";
import Loading from "../../Loading";
import { isUndefined } from "lodash";

const reorderedTraits = ["Left Hand", "Right Hand", "Enhanced"];

const TemporaryNftDetailCard = ({ item, pathPrefix }) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "widgets.NftCard",
    });
    const { t: t_nft, ready: ready_nft } = useTranslation("translation", {
        keyPrefix: "CollectionNames",
    });
    const { t: t_trait, ready: ready_trait } = useTranslation("translation", {
        keyPrefix: "NftTraits",
    });

    return (
        <Link
            to={
                pathPrefix
                    ? `${pathPrefix}/${item.id ? item.id : item.tokenId}`
                    : ""
            }
            className="widget NftDetailCard"
        >
            <div className="nftDetailCard-header">
                <div>
                    {item && (
                        <img
                            className="widget NftImage"
                            src={`https://littleghosts.s3.us-east-2.amazonaws.com/souleaters/images/${item.tokenId}.png`}
                            alt={`${item.name} #${
                                item.id | item.tokenId | item.token_id
                            }`}
                            height={"150px"}
                            width={"150px"}
                            style={{
                                objectFit: "cover",
                                borderRadius: "5px",
                            }}
                        />
                    )}
                </div>
                <div>
                    <div className="id mt-3">
                        <Loading loading={!ready_nft}>
                            {t_nft(item.name, { defaultValue: item.name })} #
                            {item.id | item.tokenId | item.token_id}
                        </Loading>
                    </div>
                    {!!item.rankable && !isUndefined(item.rank) && (
                        <div className="rank mb-3">
                            <Loading loading={!ready}>
                                {t("rank", { defaultValue: "Rank" })}:{" "}
                                {item.rank}
                            </Loading>
                        </div>
                    )}
                    {item.status && (
                        <div className="status mb-3">
                            <Loading loading={!ready}>
                                {t("status", { defaultValue: "Status" })}:{" "}
                                {item.status}
                            </Loading>
                        </div>
                    )}
                </div>
            </div>
            {Object.keys(item.trait_type_value)?.length > 0 && (
                <div className="nftDetailCard-body">
                    {Object.keys(item.trait_type_value)
                        .sort()
                        .map((key) => {
                            if (reorderedTraits.includes(key)) return;
                            return (
                                <div key={key} className="attribute-row">
                                    <div>
                                        <Loading loading={!ready_trait}>
                                            {t_trait(key, {
                                                defaultValue: key,
                                            })}
                                        </Loading>
                                    </div>
                                    <div>
                                        <Loading loading={!ready_trait}>
                                            {t_trait(
                                                item.trait_type_value[key],
                                                {
                                                    defaultValue:
                                                        item.trait_type_value[
                                                            key
                                                        ],
                                                }
                                            )}
                                        </Loading>
                                    </div>
                                </div>
                            );
                        })}
                    {reorderedTraits.map((key) => (
                        <div key={key} className="attribute-row">
                            <div>
                                <Loading loading={!ready_trait}>
                                    {t_trait(key, { defaultValue: key })}
                                </Loading>
                            </div>
                            <div>
                                <Loading loading={!ready_trait}>
                                    {t_trait(item.trait_type_value[key], {
                                        defaultValue:
                                            item.trait_type_value[key],
                                    })}
                                </Loading>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Link>
    );
};

export default TemporaryNftDetailCard;
