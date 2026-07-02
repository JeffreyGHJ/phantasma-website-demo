import './index.scss';

import { ReactNode } from 'react';

const AssetCard = ({
	Logo,
	amount,
	asset,
}: {
	Logo: ReactNode;
	amount: string | number;
	asset: string;
}) => {
	return (
		<div className='widget AssetCard'>
			<div className='asset'>
				<div className='logo'>{Logo}</div>
				<div className='label'>
					{amount} {asset}
				</div>
			</div>
		</div>
	);
};

export default AssetCard;
