import { ImageTag } from "../../../../../utils/ImageUtil";
import AssetCardGroup from "../../../../widgets/Card/AssetCardGroup";
import AssetCard from "../../../../widgets/Card/AssetCardGroup/AssetCard";

const Balance = ({ accountReadableEctoBalance }) => {
    return (
        <AssetCardGroup style={{ display: "flex", justifyContent: "center" }}>
            <div
                style={{
                    maxWidth: "1000px",
                    justifyContent: "flex-start",
                    display: "flex",
                }}
            >
                <AssetCard
                    Logo={
                        <ImageTag
                            src={`${process.env.PUBLIC_URL}/assets/images/icons/token_icons/Ecto.png`}
                            width="35px"
                            height="auto"
                            alt="ecto"
                        />
                    }
                    amount={`${accountReadableEctoBalance.number}${accountReadableEctoBalance.unit}`}
                    asset="ECTO"
                />
            </div>
        </AssetCardGroup>
    );
};

export default Balance;
