import CollectionItem from '../../../../state/application/types/CollectionItem';

interface Lootbox extends CollectionItem {
	requestID: string;
	randomWords: Array<number>;
	claimed: boolean;
	status?: string;
	trait_type_value: {
		"Founder's Gems"?: string;
		"Founder's Armory"?: string;
		"Founder's Potions"?: string;
		LittleGhosts?: string;
		EctoSkeletons?: string;
		"Founder's Rare Drop"?: string;
		"Founder's Ultra Rare Drop"?: string;
	};
}

export default Lootbox;
