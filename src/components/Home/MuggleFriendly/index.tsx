import './index.scss';

import AssetUtilModel from '../../../models/util_models/AssetUtilModel';
import { ImageTag } from '../../../utils/ImageUtil';
import Loading from '../../widgets/Loading';
import { useTranslation } from 'react-i18next';

const MuggleFriendly = () => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'Home.MuggleFriendly',
	});

	return (
		<section id='MuggleFriendly'>
			<div className='container'>
				<div className='row'>
					<div className='col-lg-6 right-col'>
						<div className='character'>
							<ImageTag
								src={`${AssetUtilModel.IMAGE_PATH}/characters/warrior.png`}
								height='auto'
							/>
						</div>
					</div>
					<div className='col-lg-6 left-col'>
						<div className='left'>
							<div className='title'>
								<Loading loading={!ready} width='280px'>
									<div>
										{t('title', {
											defaultValue:
												'Experienced Gamer or Not',
										})}
									</div>
								</Loading>
							</div>
							<div className='subtitle'>
								<Loading
									loading={!ready}
									width='280px'
									multiple={4}
								>
									<div>
										{t('subtitle', {
											defaultValue:
												"We kept this in mind when first conceptualizing the game. Even if you are not a gamer you will still enjoy our laid back target based combat mechanics. We also are focusing on the social aspects of the game, so don't get intimidated by the combat side.",
										})}
									</div>
								</Loading>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default MuggleFriendly;
