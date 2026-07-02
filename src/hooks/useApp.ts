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
	useUser,
	useView3d,
} from '../state/application/hooks';

import WebSettingModel from '../models/WebSettingModel';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// This should only be used only in the root file (App.tsx)
const useApp = () => {
	const user = useUser();
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

	useEffect(() => {
		if (!user) {
			return () => {};
		}
		// Lanauge
		const userLanguageSetting = user.settings.find(
			(x) => x.setting_id === WebSettingModel.LANGUAGE
		);
		if (
			userLanguageSetting &&
			userLanguageSetting.setting_value !== i18n.language
		) {
			i18n.changeLanguage(userLanguageSetting.setting_value.toString());
		}

		// View 3D
		const userView3dSetting = user.settings.find(
			(x) => x.setting_id === WebSettingModel.VIEW_3D_NFTS
		);
		if (userView3dSetting && !!userView3dSetting.setting_value !== view3d) {
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
			(x) => x.setting_id === WebSettingModel.ALERT_DISPLAY_POSITION
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
			(x) => x.setting_id === WebSettingModel.NFT_OFFER_NOTIFICATION
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

		return () => {};
	}, [user]);
};

export default useApp;
