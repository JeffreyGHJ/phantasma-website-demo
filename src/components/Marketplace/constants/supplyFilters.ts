import FounderItemUtilModel from '../../../models/util_models/FounderItemUtilModel';
import LootboxUtilModel from '../../../models/util_models/LootboxUtilModel';

const supplyFilters = {
	[LootboxUtilModel.ITEM_KEYS.GEM]: [
		LootboxUtilModel.UNREVEALED_KEY,
		FounderItemUtilModel.GEMS.SAPPHIRE,
		FounderItemUtilModel.GEMS.TOPAZ,
		FounderItemUtilModel.GEMS.EMERALD,
		FounderItemUtilModel.GEMS.AMETHYST,
		FounderItemUtilModel.GEMS.RUBY,
	],
	[LootboxUtilModel.ITEM_KEYS.ARMORY]: [
		LootboxUtilModel.UNREVEALED_KEY,
		FounderItemUtilModel.ARMORIES.BELT,
		FounderItemUtilModel.ARMORIES.SHIELD,
		FounderItemUtilModel.ARMORIES.SWORD,
		FounderItemUtilModel.ARMORIES.HELMET,
	],
	[LootboxUtilModel.ITEM_KEYS.POTION]: [
		LootboxUtilModel.UNREVEALED_KEY,
		LootboxUtilModel.NONE_KEY,
		FounderItemUtilModel.POTIONS.DREAMS,
		FounderItemUtilModel.POTIONS.DESPAIR,
	],
	[LootboxUtilModel.ITEM_KEYS.RARE_DROP]: [
		LootboxUtilModel.UNREVEALED_KEY,
		LootboxUtilModel.NONE_KEY,
		LootboxUtilModel.ACQUIRED_KEY,
	],
	[LootboxUtilModel.ITEM_KEYS.ULTRA_RARE_DROP]: [
		LootboxUtilModel.UNREVEALED_KEY,
		LootboxUtilModel.NONE_KEY,
		LootboxUtilModel.ACQUIRED_KEY,
	],
};

export default supplyFilters;
