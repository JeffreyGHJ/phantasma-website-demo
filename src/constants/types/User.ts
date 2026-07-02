/**
 * @deprecated see User in UserModel folder
 */
type User = {
    id: number;
    username: string | null;
    email: string | null;
    status: number;
    birthdate: string;
    activated: boolean;
    suspended: boolean;
    is_email_verified: boolean;
    wallet_addresses: Array<{ wallet_address: string }>;
    settings: Array<{ setting_id: number; setting_value: string | number }>;
    VaultEVMAddress: string | null;
    VaultSOLAddress: string | null;
};

export default User;
