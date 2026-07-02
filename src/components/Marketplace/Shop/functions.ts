export const findShopItemFromURL = (location, ShopItems) => {
    let nameInPath = location.pathname.split("/").slice(-1)[0];
    return Object.values(ShopItems.items).find(
        (item: any) =>
            item.name.toLowerCase().split(" ").join("-") === nameInPath
    );
};

export const itemToUrl = (item) => {
    return `/shop/purchase/${item.name.toLowerCase().split(" ").join("-")}`;
};
