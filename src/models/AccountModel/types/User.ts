import UserWalletAddress from './WalletAddress';
import WebSetting from '../../WebSettingModel/types/WebSetting';

type User = {
	id: number;
	username: string | null;
	email: string | null;
	status: number;
	birthdate: string;
	activated: boolean;
	suspended: boolean;
	is_email_verified: boolean;
	wallet_addresses: Array<UserWalletAddress>;
	settings: Array<WebSetting>;
};

export default User;
