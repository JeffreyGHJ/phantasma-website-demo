import {
	useAlertDisplayPosition,
	useNftsPerPage,
	useOfferEmailNotification,
	usePreferredNftImageSize,
	useUser,
	useView3d,
} from '../../../state/application/hooks';
import { useEffect, useState } from 'react';

import WebSettingModel from '../../WebSettingModel';
import { useQuickSpin } from '../../../state/application/hooks/quickSpin';
import { useTranslation } from 'react-i18next';

const usePreferencesDiffered = () => {
	const { i18n } = useTranslation();
	const view3d = useView3d();
	const nftImageSize = usePreferredNftImageSize();
	const nftsPerPage = useNftsPerPage();
	const alertDisplayPosition = useAlertDisplayPosition();
	const offerEmailNotification = useOfferEmailNotification();
	const quickSpin = useQuickSpin();
	const user = useUser();

	const [differed, setDiffered] = useState(false);

	useEffect(() => {
		if (!user) {
			setDiffered(false);
			return () => {};
		}

		// Language
		const userLanguageSetting = user.settings.find(
			(x) => x.setting_id === WebSettingModel.LANGUAGE
		);
		if (
			userLanguageSetting &&
			userLanguageSetting.setting_value !== i18n.language
		) {
			setDiffered(true);
			return () => {};
		}

		// View 3D
		const userView3dSetting = user.settings.find(
			(x) => x.setting_id === WebSettingModel.VIEW_3D_NFTS
		);
		if (
			userView3dSetting &&
			!!userView3dSetting.setting_value !== !!view3d
		) {
			setDiffered(true);
			return () => {};
		}

		// NFT Image Size
		const userImageSizeSetting = user.settings.find(
			(x) => x.setting_id === WebSettingModel.NFT_IMAGE_SIZE
		);
		if (
			userImageSizeSetting &&
			+userImageSizeSetting.setting_value !== +nftImageSize
		) {
			setDiffered(true);
			return () => {};
		}

		// NFT Per Page
		const userNftPerPageSetting = user.settings.find(
			(x) => x.setting_id === WebSettingModel.NFTS_PER_PAGE
		);
		if (
			userNftPerPageSetting &&
			+userNftPerPageSetting.setting_value !== +nftsPerPage
		) {
			setDiffered(true);
			return () => {};
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
			setDiffered(true);
			return () => {};
		}

		// NFT Offer email notification
		const userOfferEmailNotificationSetting = user.settings.find(
			(x) => x.setting_id === WebSettingModel.NFT_OFFER_NOTIFICATION
		);
		if (
			userOfferEmailNotificationSetting &&
			!!userOfferEmailNotificationSetting.setting_value !==
				!!offerEmailNotification
		) {
			setDiffered(true);
			return () => {};
		}

		// Quick Spin
		const userQuickSpinSetting = user.settings.find(
			(x) => x.setting_id === WebSettingModel.QUICK_SPIN
		);
		if (
			!userQuickSpinSetting ||
			(userQuickSpinSetting &&
				!!userQuickSpinSetting.setting_value !== !!quickSpin)
		) {
			setDiffered(true);
			return () => {};
		}

		setDiffered(false);
		return () => {};
	}, [
		user,
		i18n.language,
		view3d,
		nftImageSize,
		nftsPerPage,
		alertDisplayPosition,
		offerEmailNotification,
		quickSpin,
	]);

	return differed;
};

export default usePreferencesDiffered;
