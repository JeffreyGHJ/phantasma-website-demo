import {
	useAlertDisplayPosition,
	useNftsPerPage,
	useOfferEmailNotification,
	usePreferredNftImageSize,
	useToggleView3d,
	useUpdateAlertDisplayPosition,
	useUpdateNftsPerPage,
	useUpdateOfferEmailNotification,
	useUpdatePreferredNftImageSize,
	useView3d,
} from '../../state/application/hooks';

import { KEYS } from '../../utils/LocalstorageUtil';
import User from '../../constants/types/User';
import UserWalletAddress from './types/WalletAddress';
import WebSettingModel from '../WebSettingModel';
import axios from 'axios';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

class AccountModel {
	/**
	 * Makes a PUT request to the backend to sync user preferences
	 */
	static async syncSettings({
		recaptcha,
		recaptchaType,
	}: {
		recaptcha: string;
		recaptchaType: string;
	}) {
		return axios
			.put(
				`${process.env.REACT_APP_API}/auth/syncUserSettings`,
				{
					recaptcha,
					recaptcha_type: recaptchaType,
					settings: WebSettingModel.currentLocalSettings(),
				},
				{
					withCredentials: true,
				}
			)
			.then((res) => {
				const response = res.data as {
					data: Array<{ setting_id: number; setting_value: string }>;
					msg: string;
				};

				return response.data;
			});
	}

	/**
	 * Makes a POST request to the backend to bind a wallet address
	 */
	static async bindWalletAddress({
		walletAddress,
		recaptcha,
		signature,
	}: {
		walletAddress: string;
		recaptcha: string;
		signature: string;
	}) {
		return axios
			.post(
				`${process.env.REACT_APP_API}/auth/bindWalletAddress`,
				{
					walletAddress,
					recaptcha,
					signature,
				},
				{
					withCredentials: true,
				}
			)
			.then((res) => {
				const response = res.data as {
					data: Array<UserWalletAddress>;
				};

				return response.data;
			});
	}

	/**
	 * Makes a POST request to the backend to bind a wallet address
	 */
	static async bindVaultAddresses({
										evmAddress,
										solAddress,
										evmSignature,
										solSignature
									}: {
		evmAddress: string;
		solAddress: string;
		evmSignature: string;
		solSignature: string;
	}) {
		// Get the accessToken from localStorage
		const accessToken = localStorage.getItem('accessToken');
		return axios
			.post(
				`${process.env.REACT_APP_API}/auth/bindVaultAddresses`,
				{
					accessToken: {token: accessToken},  // pass the accessToken here
					evmAddress,
					solAddress,
					evmSignature,
					solSignature
				},
				{
					withCredentials: true,
				}
			)
			.then((res) => {
				const response = res.data as {
					data: Array<UserWalletAddress>;
				};

				return response.data;
			});
	}


	/**
	 * Makes a POST request to the backend to remove a wallet address
	 */
	static async unbindWalletAddress({
		walletAddress,
		recaptcha,
	}: {
		walletAddress: string;
		recaptcha: string;
	}) {
		return axios
			.post(
				`${process.env.REACT_APP_API}/auth/unbindWalletAddress`,
				{
					walletAddress,
					recaptcha,
				},
				{
					withCredentials: true,
				}
			)
			.then((res) => {
				const response = res.data as {
					data: Array<UserWalletAddress>;
				};

				return response.data;
			});
	}

	static useOverrideLocalSettings = () => {
		const { i18n } = useTranslation();
		const view3d = useView3d();
		const nftImageSize = usePreferredNftImageSize();
		const nftsPerPage = useNftsPerPage();
		const alertDisplayPosition = useAlertDisplayPosition();
		const offerEmailNotification = useOfferEmailNotification();

		// updaters
		const toggleView3d = useToggleView3d();
		const updateNftImageSize = useUpdatePreferredNftImageSize();
		const updateNftsPerPage = useUpdateNftsPerPage();
		const updateAlertDisplayPosition = useUpdateAlertDisplayPosition();
		const updateOfferEmailNotification = useUpdateOfferEmailNotification();

		return useCallback(
			(user: User) => {
				if (!user) {
					return;
				}
				// Lanauge
				const userLanguageSetting = user.settings.find(
					(x) => x.setting_id === WebSettingModel.LANGUAGE
				);
				if (
					userLanguageSetting &&
					userLanguageSetting.setting_value !== i18n.language
				) {
					i18n.changeLanguage(
						userLanguageSetting.setting_value.toString()
					);
				}

				// View 3D
				const userView3dSetting = user.settings.find(
					(x) => x.setting_id === WebSettingModel.VIEW_3D_NFTS
				);
				if (
					userView3dSetting &&
					!!userView3dSetting.setting_value !== view3d
				) {
					toggleView3d();
				}

				// NFT Image Size
				const userImageSizeSetting = user.settings.find(
					(x) => x.setting_id === WebSettingModel.NFT_IMAGE_SIZE
				);
				if (
					userImageSizeSetting &&
					+userImageSizeSetting.setting_value !== nftImageSize
				) {
					updateNftImageSize(+userImageSizeSetting.setting_value);
				}

				// NFT Per Page
				const userNftPerPageSetting = user.settings.find(
					(x) => x.setting_id === WebSettingModel.NFTS_PER_PAGE
				);
				if (
					userNftPerPageSetting &&
					+userNftPerPageSetting.setting_value !== nftsPerPage
				) {
					updateNftsPerPage(+userNftPerPageSetting.setting_value);
				}

				// Alert display position
				const userAlertDisplayPositionSetting = user.settings.find(
					(x) =>
						x.setting_id === WebSettingModel.ALERT_DISPLAY_POSITION
				);
				if (
					userAlertDisplayPositionSetting &&
					userAlertDisplayPositionSetting.setting_value !==
						alertDisplayPosition
				) {
					updateAlertDisplayPosition(
						userAlertDisplayPositionSetting.setting_value.toString()
					);
				}

				// NFT Offer email notification
				const userOfferEmailNotificationSetting = user.settings.find(
					(x) =>
						x.setting_id === WebSettingModel.NFT_OFFER_NOTIFICATION
				);
				if (
					userOfferEmailNotificationSetting &&
					!!userOfferEmailNotificationSetting.setting_value !==
						offerEmailNotification
				) {
					updateOfferEmailNotification(
						!!userOfferEmailNotificationSetting.setting_value
					);
				}
			},
			[
				alertDisplayPosition,
				i18n,
				nftImageSize,
				nftsPerPage,
				offerEmailNotification,
				toggleView3d,
				updateAlertDisplayPosition,
				updateNftImageSize,
				updateNftsPerPage,
				updateOfferEmailNotification,
				view3d,
			]
		);
	};

	static loadUserFromLocalstorage = () => {
		const localstorageUser = localStorage.getItem(KEYS.user);

		if (localstorageUser === 'undefined') {
			return null;
		}
		const user =
			JSON.parse(localStorage.getItem(KEYS.user) || '""') || null;
		if (user && !user.settings) {
			user.settings = [];
		}
		return user;
	};
}

export default AccountModel;
