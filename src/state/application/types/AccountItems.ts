import AuctionedItem from './AuctionedItem';
import ListedItem from './ListedItem';
import OfferReceivedItem from './OfferReceivedItem';
import OwnedItem from './OwnedItem';

type AccountItems = {
	auctionedItems: Array<AuctionedItem>;
	listedItems: Array<ListedItem>;
	offerReceivedItems: Array<OfferReceivedItem>;
	ownedItems: Array<OwnedItem>;
};

export default AccountItems;
