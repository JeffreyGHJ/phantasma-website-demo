import AlertDisplayPositionUtilModel from './util_models/AlertDisplayPositionUtilModel';
import { KEYS } from '../utils/LocalstorageUtil';
import NftImageSizeUtilModel from './util_models/NftImageSizeUtilModel';
import NftPerPageUtilModel from './util_models/NftPerPageUtilModel';

class WebSettingModel {
	static LANGUAGE = 1;
	static VIEW_3D_NFTS = 2;
	static NFT_IMAGE_SIZE = 3;
	static NFTS_PER_PAGE = 4;
	static ALERT_DISPLAY_POSITION = 5;
	static NFT_OFFER_NOTIFICATION = 6;
	static QUICK_SPIN = 7;

	static defaultSetting(setting: number): string | number {
		switch (setting) {
			case WebSettingModel.LANGUAGE: {
				return 'en';
			}
			case WebSettingModel.VIEW_3D_NFTS: {
				return 1;
			}
			case WebSettingModel.NFT_IMAGE_SIZE: {
				return NftImageSizeUtilModel.DEFAULT_NFT_SIZE;
			}
			case WebSettingModel.NFTS_PER_PAGE: {
				return 24;
			}
			case WebSettingModel.ALERT_DISPLAY_POSITION: {
				return AlertDisplayPositionUtilModel
					.notifstackPositionSelectionKeys.TOP_RIGHT;
			}
			case WebSettingModel.NFT_OFFER_NOTIFICATION: {
				return 1;
			}
			case WebSettingModel.QUICK_SPIN: {
				return 0;
			}
		}

		throw new Error('Unknown setting');
	}

	static settingLocalKey(setting: number): string {
		switch (setting) {
			case WebSettingModel.LANGUAGE: {
				return KEYS.language;
			}
			case WebSettingModel.VIEW_3D_NFTS: {
				return KEYS.view3d;
			}
			case WebSettingModel.NFT_IMAGE_SIZE: {
				return KEYS.preferredNftImageSize;
			}
			case WebSettingModel.NFTS_PER_PAGE: {
				return KEYS.nftsPerPage;
			}
			case WebSettingModel.ALERT_DISPLAY_POSITION: {
				return KEYS.alertDisplayPosition;
			}
			case WebSettingModel.NFT_OFFER_NOTIFICATION: {
				return KEYS.offerEmailNotification;
			}
			case WebSettingModel.QUICK_SPIN: {
				return KEYS.quickSpin;
			}
		}

		throw new Error('Unknown setting');
	}

	static currentLocalSetting(setting: number) {
		return WebSettingModel.format({
			setting,
			value:
				localStorage.getItem(
					WebSettingModel.settingLocalKey(setting)
				) || WebSettingModel.defaultSetting(setting),
		});
	}

	static currentLocalSettings() {
		return {
			[WebSettingModel.LANGUAGE]: WebSettingModel.currentLocalSetting(
				WebSettingModel.LANGUAGE
			),
			[WebSettingModel.VIEW_3D_NFTS]: WebSettingModel.currentLocalSetting(
				WebSettingModel.VIEW_3D_NFTS
			),
			[WebSettingModel.NFT_IMAGE_SIZE]:
				WebSettingModel.currentLocalSetting(
					WebSettingModel.NFT_IMAGE_SIZE
				),
			[WebSettingModel.NFTS_PER_PAGE]:
				WebSettingModel.currentLocalSetting(
					WebSettingModel.NFTS_PER_PAGE
				),
			[WebSettingModel.ALERT_DISPLAY_POSITION]:
				WebSettingModel.currentLocalSetting(
					WebSettingModel.ALERT_DISPLAY_POSITION
				),
			[WebSettingModel.NFT_OFFER_NOTIFICATION]:
				WebSettingModel.currentLocalSetting(
					WebSettingModel.NFT_OFFER_NOTIFICATION
				),
			[WebSettingModel.QUICK_SPIN]: WebSettingModel.currentLocalSetting(
				WebSettingModel.QUICK_SPIN
			),
		};
	}

	static format({ setting, value }: { setting: number; value: any }) {
		switch (setting) {
			case WebSettingModel.LANGUAGE: {
				return value || WebSettingModel.defaultSetting(setting);
			}
			case WebSettingModel.VIEW_3D_NFTS: {
				if (value === 'true') {
					return 1;
				}
				if (value === 'false') {
					return 0;
				}
				return WebSettingModel.defaultSetting(setting);
			}
			case WebSettingModel.NFT_IMAGE_SIZE: {
				value = +value;
				if (
					isNaN(value) ||
					value > NftImageSizeUtilModel.MAXIMUM_NFT_SIZE ||
					value < NftImageSizeUtilModel.MINIMUM_NFT_SIZE
				) {
					return NftImageSizeUtilModel.DEFAULT_NFT_SIZE;
				}
				return value;
			}
			case WebSettingModel.NFTS_PER_PAGE: {
				value = +value;
				if (
					isNaN(value) ||
					value > NftPerPageUtilModel.MAXIMUM_NFT_PER_PAGE ||
					value < NftPerPageUtilModel.MINIMUM_NFT_PER_PAGE
				) {
					return NftPerPageUtilModel.DEFAULT_NFT_PER_PAGE;
				}
				return value;
			}
			case WebSettingModel.ALERT_DISPLAY_POSITION: {
				return (
					AlertDisplayPositionUtilModel
						.notifstackPositionSelectionKeys[value] ||
					WebSettingModel.defaultSetting(setting)
				);
			}
			case WebSettingModel.NFT_OFFER_NOTIFICATION: {
				if (value === 'true') {
					return 1;
				}
				if (value === 'false') {
					return 0;
				}
				return WebSettingModel.defaultSetting(setting);
			}
			case WebSettingModel.QUICK_SPIN: {
				if (value === 'true') {
					return 1;
				}
				if (value === 'false') {
					return 0;
				}
				return WebSettingModel.defaultSetting(setting);
			}
		}

		throw new Error('Unknown setting');
	}
}

export default WebSettingModel;
