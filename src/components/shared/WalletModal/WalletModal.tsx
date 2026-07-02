import './index.scss';

import { Divider, Grid } from '@mui/material';

import { ImageTag } from '../../../utils/ImageUtil';
import Loading from '../../widgets/Loading';
import Modal from '../../widgets/Modal';
import { connectorIDs } from '../../../utils/Web3Util';
import { useTranslation } from 'react-i18next';

const wallets: Array<{
	name: string;
	src: string;
	connector: any;
}> = [
	{
		name: 'Metamask',
		src: `${process.env.PUBLIC_URL}/assets/images/wallets/metamask.svg`,
		connector: connectorIDs.injected,
	},
	{
		name: 'TrustWallet',
		src: `${process.env.PUBLIC_URL}/assets/images/wallets/trust_wallet.svg`,
		connector: connectorIDs.injected,
	},
	{
		name: 'MathWallet',
		src: `${process.env.PUBLIC_URL}/assets/images/wallets/math_wallet.svg`,
		connector: connectorIDs.injected,
	},
	{
		name: 'TokenPocket',
		src: `${process.env.PUBLIC_URL}/assets/images/wallets/token_pocket.svg`,
		connector: connectorIDs.injected,
	},
	{
		name: 'WalletConnect',
		src: `${process.env.PUBLIC_URL}/assets/images/wallets/wallet_connect.svg`,
		connector: connectorIDs.walletconnect,
	},
	{
		name: 'Binance Chain',
		src: `${process.env.PUBLIC_URL}/assets/images/wallets/binance_chain_wallet.svg`,
		connector: connectorIDs.bsc,
	},
	{
		name: 'SafePal',
		src: `${process.env.PUBLIC_URL}/assets/images/wallets/safepal_wallet.svg`,
		connector: connectorIDs.injected,
	},
	{
		name: 'WalletLink',
		src: `${process.env.PUBLIC_URL}/assets/images/wallets/walletlink.png`,
		connector: connectorIDs.walletlink,
	},
];

const WalletModal = ({
	open,
	handleClose,
	handleWalletClick,
}: {
	open: boolean;
	handleClose: () => void;
	handleWalletClick: (connector: any) => void;
}) => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'Modals.WalletModal',
	});

	return (
		<Modal open={open} onClose={handleClose} className='widget WalletModal'>
			<div className='title'>
				<Loading loading={!ready}>
					{t('connect_to_a_wallet', {
						defaultValue: 'Connect to a wallet',
					})}
				</Loading>
			</div>
			<Divider />
			<Grid
				container
				style={{ marginTop: '1rem' }}
				justifyContent='space-between'
			>
				{wallets.map((wallet, index) => {
					return (
						<Grid
							item
							key={`${index}-${wallet.name}`}
							style={{
								textAlign: 'center',
								marginTop: '2rem',
								marginBottom: '2rem',
								cursor: 'pointer',
							}}
							onClick={() => {
								handleWalletClick(wallet.connector);
							}}
							xs={6}
							md={6}
							lg={3}
						>
							<ImageTag
								src={wallet.src}
								alt={wallet.name}
								height='32'
								width='32'
							/>

							<p style={{ fontSize: '1.5rem' }}>{wallet.name}</p>
						</Grid>
					);
				})}
			</Grid>
		</Modal>
	);
};

export default WalletModal;
