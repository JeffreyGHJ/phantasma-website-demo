import SubgraphCollection from './SubgraphCollection';
import SubgraphNft from './SubgraphNFT';
import SubgraphUser from './SubgraphUser';

type SubgraphTransaction = {
	id: string;
	timestamp?: string;
	collection?: SubgraphCollection;
	nft?: SubgraphNft;
	askPrice: string;
	netPrice?: string;
	buyer?: SubgraphUser;
	seller?: SubgraphUser;
	withBNB?: boolean;
};

export default SubgraphTransaction;
