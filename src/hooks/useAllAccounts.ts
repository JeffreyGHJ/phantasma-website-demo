import { useEffect, useState } from "react";
import { useActiveWeb3React } from ".";
import { useUser } from "../state/application/hooks";

const useAllAccounts = () => {
    const user = useUser();
    const { account } = useActiveWeb3React();

    const [allAccounts, setAllAccounts] = useState<any>(undefined);

    useEffect(() => {
        // wait ~1 second to try to batch into single update
        let timerId = setTimeout(() => {
            let accounts = [account, user?.VaultEVMAddress] as any;

            // add all addresses saved to user.wallet_addresses
            user?.wallet_addresses?.map((addressEntry) => {
                accounts.push(addressEntry.wallet_address);
            });

            // remove falsy values, make lowercase, remove duplicates
            accounts = accounts
                .filter(Boolean)
                .map((account) => account.toLowerCase())
                .filter((value, index, self) => self.indexOf(value) === index);

            setAllAccounts(accounts);
        }, 1500);
        return () => clearTimeout(timerId);
    }, [user, account]);

    return allAccounts;
};

export default useAllAccounts;
