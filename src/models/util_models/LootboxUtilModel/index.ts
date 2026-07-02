import FounderItemUtilModel from '../FounderItemUtilModel';
import Lootbox from './types/Lootbox';
import LootboxSingleItem from './types/LootboxSingleItem';
import { getAvaliableRewards } from '../../../constants/abis/bsc/LootboxABI/hooks/useGetAvaliableRewards';
import { getTotalOpened } from '../../../constants/abis/bsc/LootboxABI/hooks/useTotalOpened';
import { getTotalSupply } from '../../../constants/abis/bsc/LootboxABI/hooks/useTotalSupply';

class LootboxUtilModel {
	static UNLUCKY_DRAW = 99999;

	static LOOTBOX_STATUSES = {
		CLAIMED: 'Claimed',
		OPENED: 'Opened',
		OPENING: 'Opening',
		UNOPENED: 'Unopened',
	};

	static UNREVEALED_KEY = 'Unrevealed';
	static NONE_KEY = 'None';
	static ACQUIRED_KEY = '+1';
	static STATUS_KEY = 'Status';
	static OPENED_STATUS = 'Opened';
	static UNOPENED_STATUS = 'Unopened';

	static ITEM_KEYS = {
		GEM: FounderItemUtilModel.ITEM_KEYS.GEM,
		POTION: FounderItemUtilModel.ITEM_KEYS.POTION,
		ARMORY: FounderItemUtilModel.ITEM_KEYS.ARMORY,
		LITTLEGHOST: 'LittleGhosts',
		ECTOSKELETON: 'EctoSkeletons',
		RARE_DROP: FounderItemUtilModel.ITEM_KEYS.RARE_DROP,
		ULTRA_RARE_DROP: FounderItemUtilModel.ITEM_KEYS.ULTRA_RARE_DROP,
	};

	static emptyRewardOption = {
		url: `${process.env.PUBLIC_URL}/assets/images/icons/placeholders/200x200/empty_background.png`,
		name: LootboxUtilModel.NONE_KEY,
	};

	static macBookRewardOption = {
		url: `${process.env.PUBLIC_URL}/assets/images/icons/ultra_rare_drops/200x200/macbook.png`,
		name: FounderItemUtilModel.MACBOOK_PRO,
	};

	static switchRewardOption = {
		url: `${process.env.PUBLIC_URL}/assets/images/icons/rare_drops/200x200/switch.png`,
		name: FounderItemUtilModel.NINTENDO_SWICH,
	};

	static skeletonRewardOption = {
		url: `${process.env.PUBLIC_URL}/assets/images/icons/nft_collections/200x200/skeleton.png`,
		name: LootboxUtilModel.ITEM_KEYS.ECTOSKELETON,
	};

	static littleGhostRewardOption = {
		url: `${process.env.PUBLIC_URL}/assets/images/icons/nft_collections/200x200/ghost.png`,
		name: LootboxUtilModel.ITEM_KEYS.LITTLEGHOST,
	};

	static rewardOptions = [
		{
			url: `${process.env.PUBLIC_URL}/assets/images/icons/gems/200x200/blue_gem.png`,
			name: FounderItemUtilModel.GEMS.SAPPHIRE,
		},
		{
			url: `${process.env.PUBLIC_URL}/assets/images/icons/gems/200x200/yellow_gem.png`,
			name: FounderItemUtilModel.GEMS.TOPAZ,
		},
		{
			url: `${process.env.PUBLIC_URL}/assets/images/icons/gems/200x200/green_gem.png`,
			name: FounderItemUtilModel.GEMS.EMERALD,
		},
		{
			url: `${process.env.PUBLIC_URL}/assets/images/icons/gems/200x200/purple_gem.png`,
			name: FounderItemUtilModel.GEMS.AMETHYST,
		},
		{
			url: `${process.env.PUBLIC_URL}/assets/images/icons/gems/200x200/red_gem.png`,
			name: FounderItemUtilModel.GEMS.RUBY,
		},
		{
			url: `${process.env.PUBLIC_URL}/assets/images/icons/armory/200x200/belt.png`,
			name: FounderItemUtilModel.ARMORIES.BELT,
		},
		{
			url: `${process.env.PUBLIC_URL}/assets/images/icons/armory/200x200/shield.png`,
			name: FounderItemUtilModel.ARMORIES.SHIELD,
		},
		{
			url: `${process.env.PUBLIC_URL}/assets/images/icons/armory/200x200/sword.png`,
			name: FounderItemUtilModel.ARMORIES.SWORD,
		},
		{
			url: `${process.env.PUBLIC_URL}/assets/images/icons/armory/200x200/helmet.png`,
			name: FounderItemUtilModel.ARMORIES.HELMET,
		},
		this.emptyRewardOption,
		{
			url: `${process.env.PUBLIC_URL}/assets/images/icons/potions/200x200/blue_potion.png`,
			name: FounderItemUtilModel.POTIONS.DESPAIR,
		},
		{
			url: `${process.env.PUBLIC_URL}/assets/images/icons/potions/200x200/orange_potion.png`,
			name: FounderItemUtilModel.POTIONS.DREAMS,
		},
		this.littleGhostRewardOption,
		this.skeletonRewardOption,
		this.macBookRewardOption,
		this.switchRewardOption,
	];

	static rewardGemOptions = this.rewardOptions.filter((op) => {
		return Object.values(FounderItemUtilModel.GEMS).includes(op.name);
	});

	static rewardArmoryOptions = this.rewardOptions.filter((op) => {
		return Object.values(FounderItemUtilModel.ARMORIES).includes(op.name);
	});

	static rewardPotionOptions = this.rewardOptions.filter((op) => {
		return Object.values(FounderItemUtilModel.POTIONS).includes(op.name);
	});

	static INITIAL_LOOTS = {
		foundersItems: [
			2000, 2000, 2000, 2000, 2000, 2500, 2500, 2500, 2500, 500, 500, 20,
			1,
		],
		//TODO: Change these accordingly
		littleGhosts: 10,
		ectoSkeletons: 10,
	};

	static getLootboxStatus = (lootbox: Lootbox | LootboxSingleItem) => {
		if (lootbox.claimed) {
			return LootboxUtilModel.LOOTBOX_STATUSES.CLAIMED;
		}

		if (lootbox.randomWords.length) {
			return LootboxUtilModel.LOOTBOX_STATUSES.OPENED;
		}

		if (lootbox.requestID && lootbox.requestID !== '0') {
			return LootboxUtilModel.LOOTBOX_STATUSES.OPENING;
		}

		return LootboxUtilModel.LOOTBOX_STATUSES.UNOPENED;
	};

	static isLootboxTraitLoaded = (lootbox: Lootbox) => {
		if (!lootbox.trait_type_value) {
			return false;
		}

		if (
			lootbox.trait_type_value["Founder's Gems"] ===
			LootboxUtilModel.UNREVEALED_KEY
		) {
			return false;
		}

		return true;
	};

	static isLootboxAttributeLoaded = (lootbox: LootboxSingleItem) => {
		if (!lootbox.attributes) {
			return false;
		}

		if (
			lootbox.attributes["Founder's Gems"]?.trait_value ===
			LootboxUtilModel.UNREVEALED_KEY
		) {
			return false;
		}

		return true;
	};

	static loadSingleLootboxMetadata = (lootbox: LootboxSingleItem) => {
		LootboxUtilModel.loadLootboxStatus(lootbox);
		LootboxUtilModel.loadLootboxImage(lootbox);
		LootboxUtilModel.loadLootboxAttributes(lootbox);
	};

	static loadLootboxMetadata = (lootbox: Lootbox) => {
		LootboxUtilModel.loadLootboxStatus(lootbox);
		LootboxUtilModel.loadLootboxImage(lootbox);
		LootboxUtilModel.loadLootboxTraits(lootbox);
	};

	static loadLootboxStatus = (lootbox: Lootbox | LootboxSingleItem) => {
		lootbox.status = LootboxUtilModel.getLootboxStatus(lootbox);
	};

	static loadLootboxImage = (lootbox: Lootbox | LootboxSingleItem) => {
		if (lootbox.claimed || lootbox.randomWords.length) {
			lootbox.image_png = `${process.env.PUBLIC_URL}/assets/images/lootbox_open.png`;
			return;
		}

		if (lootbox.requestID && lootbox.requestID !== '0') {
			lootbox.image_png = `${process.env.PUBLIC_URL}/assets/images/lootbox_unlocked.png`;
			return;
		}

		lootbox.image_png = `${process.env.PUBLIC_URL}/assets/images/lootbox_closed.png`;
	};

	static loadLootboxTraits = (lootbox: Lootbox) => {
		if (LootboxUtilModel.isLootboxTraitLoaded(lootbox)) {
			return;
		}

		if (lootbox.claimed || lootbox.randomWords.length) {
			const gem = lootbox.randomWords[0];
			switch (gem) {
				case 0: {
					lootbox.trait_type_value["Founder's Gems"] =
						FounderItemUtilModel.GEMS.SAPPHIRE;
					break;
				}
				case 1: {
					lootbox.trait_type_value["Founder's Gems"] =
						FounderItemUtilModel.GEMS.TOPAZ;
					break;
				}
				case 2: {
					lootbox.trait_type_value["Founder's Gems"] =
						FounderItemUtilModel.GEMS.EMERALD;
					break;
				}
				case 3: {
					lootbox.trait_type_value["Founder's Gems"] =
						FounderItemUtilModel.GEMS.AMETHYST;
					break;
				}
				case 4: {
					lootbox.trait_type_value["Founder's Gems"] =
						FounderItemUtilModel.GEMS.RUBY;
					break;
				}
				default:
					lootbox.trait_type_value["Founder's Gems"] = '-';
					break;
			}

			const armory = lootbox.randomWords[1];
			switch (armory) {
				case 5: {
					lootbox.trait_type_value["Founder's Armory"] =
						"Founder's Belt";
					break;
				}
				case 6: {
					lootbox.trait_type_value["Founder's Armory"] =
						"Founder's Shield";
					break;
				}
				case 7: {
					lootbox.trait_type_value["Founder's Armory"] =
						"Founder's Sword";
					break;
				}
				case 8: {
					lootbox.trait_type_value["Founder's Armory"] =
						"Founder's Helmet";
					break;
				}
				default:
					lootbox.trait_type_value["Founder's Armory"] = '-';
					break;
			}

			const potion = lootbox.randomWords[2];
			switch (potion) {
				case 9: {
					lootbox.trait_type_value["Founder's Potions"] =
						'Potion of Dreams';
					break;
				}
				case 10: {
					lootbox.trait_type_value["Founder's Potions"] =
						'Potion of Despair';
					break;
				}
				case LootboxUtilModel.UNLUCKY_DRAW: {
					lootbox.trait_type_value["Founder's Potions"] =
						LootboxUtilModel.NONE_KEY;
					break;
				}
				default:
					lootbox.trait_type_value["Founder's Potions"] = '-';
					break;
			}

			const littleGhost = lootbox.randomWords[4];
			lootbox.trait_type_value.LittleGhosts =
				littleGhost === this.UNLUCKY_DRAW
					? LootboxUtilModel.NONE_KEY
					: littleGhost.toString();

			const ectoskeleton = lootbox.randomWords[6];
			lootbox.trait_type_value.EctoSkeletons =
				ectoskeleton === this.UNLUCKY_DRAW
					? LootboxUtilModel.NONE_KEY
					: ectoskeleton.toString();

			const nintendoSwitch = lootbox.randomWords[8];
			lootbox.trait_type_value["Founder's Rare Drop"] =
				nintendoSwitch === this.UNLUCKY_DRAW
					? LootboxUtilModel.NONE_KEY
					: LootboxUtilModel.ACQUIRED_KEY;

			const macbookPro = lootbox.randomWords[9];
			lootbox.trait_type_value["Founder's Ultra Rare Drop"] =
				macbookPro === this.UNLUCKY_DRAW
					? LootboxUtilModel.NONE_KEY
					: LootboxUtilModel.ACQUIRED_KEY;
			return;
		}

		lootbox.trait_type_value = {
			"Founder's Gems": '-',
			"Founder's Armory": '-',
			"Founder's Potions": '-',
			LittleGhosts: '-',
			EctoSkeletons: '-',
			"Founder's Rare Drop": '-',
			"Founder's Ultra Rare Drop": '-',
		};
	};

	static loadLootboxAttributes = (lootbox: LootboxSingleItem) => {
		if (LootboxUtilModel.isLootboxAttributeLoaded(lootbox)) {
			return;
		}

		if (lootbox.claimed || lootbox.randomWords.length) {
			const gem = +lootbox.randomWords[0];

			switch (gem) {
				case 0: {
					lootbox.attributes["Founder's Gems"].trait_value =
						FounderItemUtilModel.GEMS.SAPPHIRE;
					break;
				}
				case 1: {
					lootbox.attributes["Founder's Gems"].trait_value =
						FounderItemUtilModel.GEMS.TOPAZ;
					break;
				}
				case 2: {
					lootbox.attributes["Founder's Gems"].trait_value =
						FounderItemUtilModel.GEMS.EMERALD;
					break;
				}
				case 3: {
					lootbox.attributes["Founder's Gems"].trait_value =
						FounderItemUtilModel.GEMS.AMETHYST;
					break;
				}
				case 4: {
					lootbox.attributes["Founder's Gems"].trait_value =
						FounderItemUtilModel.GEMS.RUBY;
					break;
				}
				default:
					lootbox.attributes["Founder's Gems"].trait_value = '-';
					break;
			}

			const armory = +lootbox.randomWords[1];
			switch (armory) {
				case 5: {
					lootbox.attributes["Founder's Armory"].trait_value =
						"Founder's Belt";
					break;
				}
				case 6: {
					lootbox.attributes["Founder's Armory"].trait_value =
						"Founder's Shield";
					break;
				}
				case 7: {
					lootbox.attributes["Founder's Armory"].trait_value =
						"Founder's Sword";
					break;
				}
				case 8: {
					lootbox.attributes["Founder's Armory"].trait_value =
						"Founder's Helmet";
					break;
				}
				default:
					lootbox.attributes["Founder's Armory"].trait_value = '-';
					break;
			}

			const potion = +lootbox.randomWords[2];
			switch (potion) {
				case 9: {
					lootbox.attributes["Founder's Potions"].trait_value =
						'Potion of Dreams';
					break;
				}
				case 10: {
					lootbox.attributes["Founder's Potions"].trait_value =
						'Potion of Despair';
					break;
				}
				case LootboxUtilModel.UNLUCKY_DRAW: {
					lootbox.attributes["Founder's Potions"].trait_value =
						LootboxUtilModel.NONE_KEY;
					break;
				}
				default:
					lootbox.attributes["Founder's Potions"].trait_value = '-';
					break;
			}

			const littleGhost = +lootbox.randomWords[4];
			lootbox.attributes.LittleGhosts.trait_value =
				littleGhost === this.UNLUCKY_DRAW
					? LootboxUtilModel.NONE_KEY
					: littleGhost.toString();

			const ectoskeleton = +lootbox.randomWords[6];
			lootbox.attributes.EctoSkeletons.trait_value =
				ectoskeleton === this.UNLUCKY_DRAW
					? LootboxUtilModel.NONE_KEY
					: ectoskeleton.toString();

			const nintendoSwitch = +lootbox.randomWords[8];
			lootbox.attributes["Founder's Rare Drop"].trait_value =
				nintendoSwitch === this.UNLUCKY_DRAW
					? LootboxUtilModel.NONE_KEY
					: LootboxUtilModel.ACQUIRED_KEY;

			const macbookPro = +lootbox.randomWords[9];
			lootbox.attributes["Founder's Ultra Rare Drop"].trait_value =
				macbookPro === this.UNLUCKY_DRAW
					? LootboxUtilModel.NONE_KEY
					: LootboxUtilModel.ACQUIRED_KEY;
			return;
		}

		lootbox.attributes = {
			"Founder's Gems": {
				trait_value: '-',
				trait_count: lootbox.attributes["Founder's Gems"].trait_count,
			},
			"Founder's Armory": {
				trait_value: '-',
				trait_count: lootbox.attributes["Founder's Armory"].trait_count,
			},
			"Founder's Potions": {
				trait_value: '-',
				trait_count:
					lootbox.attributes["Founder's Potions"].trait_count,
			},
			LittleGhosts: {
				trait_value: '-',
				trait_count: lootbox.attributes.LittleGhosts.trait_count,
			},
			EctoSkeletons: {
				trait_value: '-',
				trait_count: lootbox.attributes.EctoSkeletons.trait_count,
			},
			"Founder's Rare Drop": {
				trait_value: '-',
				trait_count:
					lootbox.attributes["Founder's Rare Drop"].trait_count,
			},
			"Founder's Ultra Rare Drop": {
				trait_value: '-',
				trait_count:
					lootbox.attributes["Founder's Ultra Rare Drop"].trait_count,
			},
		};
	};

	static getRewardsFromRandomWords = (randomWords: Array<string>) => {
		if (randomWords.length !== 10) {
			throw new Error('Wrong length of random words');
		}

		const rewards = [] as Array<string>;
		const gem = +randomWords[0];
		switch (gem) {
			case 0: {
				rewards.push(FounderItemUtilModel.GEMS.SAPPHIRE);
				break;
			}
			case 1: {
				rewards.push(FounderItemUtilModel.GEMS.TOPAZ);
				break;
			}
			case 2: {
				rewards.push(FounderItemUtilModel.GEMS.EMERALD);
				break;
			}
			case 3: {
				rewards.push(FounderItemUtilModel.GEMS.AMETHYST);
				break;
			}
			case 4: {
				rewards.push(FounderItemUtilModel.GEMS.RUBY);
				break;
			}
		}

		const armory = +randomWords[1];
		switch (armory) {
			case 5: {
				rewards.push(FounderItemUtilModel.ARMORIES.BELT);
				break;
			}
			case 6: {
				rewards.push(FounderItemUtilModel.ARMORIES.SHIELD);
				break;
			}
			case 7: {
				rewards.push(FounderItemUtilModel.ARMORIES.SWORD);
				break;
			}
			case 8: {
				rewards.push(FounderItemUtilModel.ARMORIES.HELMET);
				break;
			}
		}

		const potion = +randomWords[2];
		switch (potion) {
			case 9: {
				rewards.push(FounderItemUtilModel.POTIONS.DREAMS);
				break;
			}
			case 10: {
				rewards.push(FounderItemUtilModel.POTIONS.DESPAIR);
				break;
			}
			case LootboxUtilModel.UNLUCKY_DRAW: {
				rewards.push(LootboxUtilModel.NONE_KEY);
				break;
			}
		}

		const littleGhost = +randomWords[4];
		rewards.push(
			littleGhost === this.UNLUCKY_DRAW
				? LootboxUtilModel.NONE_KEY
				: LootboxUtilModel.ITEM_KEYS.LITTLEGHOST
		);

		const ectoskeleton = +randomWords[6];
		rewards.push(
			ectoskeleton === this.UNLUCKY_DRAW
				? LootboxUtilModel.NONE_KEY
				: LootboxUtilModel.ITEM_KEYS.ECTOSKELETON
		);

		const nintendoSwitch = +randomWords[8];
		rewards.push(
			nintendoSwitch === this.UNLUCKY_DRAW
				? LootboxUtilModel.NONE_KEY
				: FounderItemUtilModel.NINTENDO_SWICH
		);

		const macbookPro = +randomWords[9];
		rewards.push(
			macbookPro === this.UNLUCKY_DRAW
				? LootboxUtilModel.NONE_KEY
				: FounderItemUtilModel.MACBOOK_PRO
		);
		return rewards;
	};

	static getAvaliableLootboxRewards = async () => {
		const [avaliableRewards, totalSupply, totalOpen] = await Promise.all([
			getAvaliableRewards(),
			getTotalSupply(),
			getTotalOpened(),
		]);
		const leftToOpen = totalSupply - totalOpen;
		if (leftToOpen < 0) {
			throw new Error('Something went wrong');
		}
		const possibleRewards = [] as Array<{
			url: string;
			name: string;
			dropRate: number;
		}>;

		if (!leftToOpen) {
			return possibleRewards;
		}

		for (let i = 0; i < avaliableRewards.foundersItems.length; i++) {
			const remaining = avaliableRewards.foundersItems[i];
			if (remaining) {
				let item = '';
				switch (i) {
					case 0: {
						item = FounderItemUtilModel.GEMS.SAPPHIRE;
						break;
					}
					case 1: {
						item = FounderItemUtilModel.GEMS.TOPAZ;
						break;
					}
					case 2: {
						item = FounderItemUtilModel.GEMS.EMERALD;
						break;
					}
					case 3: {
						item = FounderItemUtilModel.GEMS.AMETHYST;
						break;
					}
					case 4: {
						item = FounderItemUtilModel.GEMS.RUBY;
						break;
					}
					case 5: {
						item = FounderItemUtilModel.ARMORIES.BELT;
						break;
					}
					case 6: {
						item = FounderItemUtilModel.ARMORIES.SHIELD;
						break;
					}
					case 7: {
						item = FounderItemUtilModel.ARMORIES.SWORD;
						break;
					}
					case 8: {
						item = FounderItemUtilModel.ARMORIES.HELMET;
						break;
					}
					case 9: {
						item = FounderItemUtilModel.POTIONS.DREAMS;
						break;
					}
					case 10: {
						item = FounderItemUtilModel.POTIONS.DESPAIR;
						break;
					}
					case 11: {
						item = FounderItemUtilModel.NINTENDO_SWICH;
						break;
					}
					case 12: {
						item = FounderItemUtilModel.MACBOOK_PRO;
						break;
					}
					default: {
						throw new Error('Index out of bound');
					}
				}
				const possibleReward = LootboxUtilModel.rewardOptions.find(
					(option) => option.name === item
				);
				if (!possibleReward) {
					throw new Error('Unable to find possible reward');
				}
				possibleRewards.push({
					...possibleReward,
					dropRate: +(
						(remaining / (totalSupply - totalOpen)) *
						100
					).toFixed(2),
				});
			}
		}

		if (avaliableRewards.littleGhosts) {
			const possibleReward = LootboxUtilModel.rewardOptions.find(
				(option) =>
					option.name === LootboxUtilModel.ITEM_KEYS.LITTLEGHOST
			);
			if (!possibleReward) {
				throw new Error('Unable to find possible littleghosts reward');
			}
			possibleRewards.push({
				...possibleReward,
				dropRate: +(
					(avaliableRewards.littleGhosts / leftToOpen) *
					100
				).toFixed(2),
			});
		}

		if (avaliableRewards.ectoSkeletons) {
			const possibleReward = LootboxUtilModel.rewardOptions.find(
				(option) =>
					option.name === LootboxUtilModel.ITEM_KEYS.ECTOSKELETON
			);
			if (!possibleReward) {
				throw new Error('Unable to find possible ectoskeletons reward');
			}
			possibleRewards.push({
				...possibleReward,
				dropRate: +(
					(avaliableRewards.ectoSkeletons / leftToOpen) *
					100
				).toFixed(2),
			});
		}

		return possibleRewards;
	};
}

export default LootboxUtilModel;
