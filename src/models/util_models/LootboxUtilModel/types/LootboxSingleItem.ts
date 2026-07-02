import { SingleCollectionItem } from '../../../../state/application/types/SingleCollectionItem';

interface LootboxSingleItem extends SingleCollectionItem {
	requestID: number;
	randomWords: Array<string>;
	claimed: boolean;
	status?: string;
	attributes: {
		"Founder's Gems": {
			trait_value: string;
			trait_count: number;
		};
		"Founder's Armory": {
			trait_value: string;
			trait_count: number;
		};
		"Founder's Potions": {
			trait_value: string;
			trait_count: number;
		};
		LittleGhosts: {
			trait_value: string;
			trait_count: number;
		};
		EctoSkeletons: {
			trait_value: string;
			trait_count: number;
		};
		"Founder's Rare Drop": {
			trait_value: string;
			trait_count: number;
		};
		"Founder's Ultra Rare Drop": {
			trait_value: string;
			trait_count: number;
		};
	};
}

export default LootboxSingleItem;
