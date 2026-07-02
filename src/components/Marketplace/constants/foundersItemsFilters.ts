import FounderItemUtilModel from '../../../models/util_models/FounderItemUtilModel';
import LootboxUtilModel from '../../../models/util_models/LootboxUtilModel';

export const founderItemFilters = {
	[LootboxUtilModel.ITEM_KEYS.GEM]: [
		FounderItemUtilModel.GEMS.SAPPHIRE,
		FounderItemUtilModel.GEMS.TOPAZ,
		FounderItemUtilModel.GEMS.EMERALD,
		FounderItemUtilModel.GEMS.AMETHYST,
		FounderItemUtilModel.GEMS.RUBY,
	],
	[LootboxUtilModel.ITEM_KEYS.ARMORY]: [
		FounderItemUtilModel.ARMORIES.BELT,
		FounderItemUtilModel.ARMORIES.SHIELD,
		FounderItemUtilModel.ARMORIES.SWORD,
		FounderItemUtilModel.ARMORIES.HELMET,
	],
	[LootboxUtilModel.ITEM_KEYS.POTION]: [
		FounderItemUtilModel.POTIONS.DREAMS,
		FounderItemUtilModel.POTIONS.DESPAIR,
	],
	[LootboxUtilModel.ITEM_KEYS.RARE_DROP]: [LootboxUtilModel.ACQUIRED_KEY],
	[LootboxUtilModel.ITEM_KEYS.ULTRA_RARE_DROP]: [
		LootboxUtilModel.ACQUIRED_KEY,
	],
};

export const founderitemsGemFilters = {
	[LootboxUtilModel.ITEM_KEYS.GEM]: [
		FounderItemUtilModel.GEMS.SAPPHIRE,
		FounderItemUtilModel.GEMS.TOPAZ,
		FounderItemUtilModel.GEMS.EMERALD,
		FounderItemUtilModel.GEMS.AMETHYST,
		FounderItemUtilModel.GEMS.RUBY,
	],
};

export const founderitemsArmoryFilters = {
	[LootboxUtilModel.ITEM_KEYS.ARMORY]: [
		FounderItemUtilModel.ARMORIES.BELT,
		FounderItemUtilModel.ARMORIES.SHIELD,
		FounderItemUtilModel.ARMORIES.SWORD,
		FounderItemUtilModel.ARMORIES.HELMET,
	],
};

export const founderitemsPotionFilters = {
	[LootboxUtilModel.ITEM_KEYS.POTION]: [
		FounderItemUtilModel.POTIONS.DREAMS,
		FounderItemUtilModel.POTIONS.DESPAIR,
	],
};

export const founderitemsRareDropFilters = {
	[LootboxUtilModel.ITEM_KEYS.RARE_DROP]: [LootboxUtilModel.ACQUIRED_KEY],
};

export const founderitemsUltraRareDropFilters = {
	[LootboxUtilModel.ITEM_KEYS.ULTRA_RARE_DROP]: [
		LootboxUtilModel.ACQUIRED_KEY,
	],
};
