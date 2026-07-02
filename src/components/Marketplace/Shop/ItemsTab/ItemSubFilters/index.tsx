import "./index.scss";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useEffect, useState } from "react";

const ItemSubFilters = ({
    shopItems,
    selectedItemType,
    subFilter,
    setSubFilter,
}) => {
    const [tabs, setTabs] = useState(["All"]);

    useEffect(() => {
        // console.log(shopItems);
        let newTabs = ["All"];
        if (selectedItemType === "All") {
            shopItems.map((item) =>
                newTabs.includes(item.collection)
                    ? {
                          /*do nothing*/
                      }
                    : newTabs.push(item.collection)
            );
        } else {
            shopItems.map((item) =>
                item.item_type === selectedItemType
                    ? newTabs.includes(item.item_sub_type)
                        ? {}
                        : newTabs.push(item.item_sub_type)
                    : {}
            );
        }
        // console.log(newTabs);
        setTabs(newTabs);
    }, [shopItems]);

    return (
        <div id="sub-filter-container">
            <Tabs
                id="sub-filters"
                value={0}
                onChange={() => {}}
                variant="scrollable"
                scrollButtons
                allowScrollButtonsMobile
            >
                {tabs.map((tab) => (
                    <Tab
                        className={"tab" + (subFilter === tab ? " active" : "")}
                        label={tab}
                        onClick={() => setSubFilter(tab)}
                    />
                ))}
            </Tabs>
        </div>
    );
};

export default ItemSubFilters;
