import './index.scss';

import AssetUtilModel from '../../../../models/util_models/AssetUtilModel';
import { ImageTag } from '../../../../utils/ImageUtil';

const FloatingSocials = () => {
	return (
		<div className='widget FloatingSocials'>
			<div className='socials'>
				<div>
					<ImageTag
						src={`${AssetUtilModel.LOGO_PATH}/socials/filled/twitter.svg`}
						height='auto'
					/>
				</div>
				<div>
					<ImageTag
						src={`${AssetUtilModel.LOGO_PATH}/socials/filled/discord.svg`}
						height='auto'
					/>
				</div>
				<div>
					<ImageTag
						className='round'
						src={`${AssetUtilModel.LOGO_PATH}/socials/filled/telegram.png`}
						width='32px'
						height='auto'
					/>
				</div>
			</div>
		</div>
	);
};

export default FloatingSocials;
