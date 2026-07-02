import { useNavigate } from "react-router";
import { itemToUrl } from "../components/Marketplace/Shop/functions";

export const usePurchasePage = () => {
    const navigate = useNavigate();

    const goToPurchasePage = (item) => {
        console.log(item);

        if (item.name === "Founders Lootbox") navigate("/community/mint");
        else navigate(itemToUrl(item));
    };

    return { goToPurchasePage };
};
