import CommunityCollectionToken from './CommunityCollectionToken';

type CommunityCollection = {
	address: string;
	collection_total: number;
	description: string;
	logo: string;
	metadata_path: string;
	metadata_extension: string;
	metadata_server_side_fetching: boolean;
	method: string;
	name: string;
	token_ids: null | string;
	token_image_ext: string;
	tokens_of_owner_supported: boolean;
	tokens?: Array<CommunityCollectionToken>;
};

export default CommunityCollection;
