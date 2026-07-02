import './index.scss';

import AssetUtilModel from '../../../models/util_models/AssetUtilModel';
import { ImageTag } from '../../../utils/ImageUtil';
import Loading from '../../widgets/Loading';
import { useTranslation } from 'react-i18next';

const PlayAndEarn = () => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'Home.PlayAndEarn',
	});

	return (
		<section id='PlayAndEarn'>
			<div className='container'>
				<div className='content'>
					<div className='icon-group'>
						<div>
							<ImageTag
								src={`${AssetUtilModel.ICON_PATH}/arrow.svg`}
								height='auto'
							/>
						</div>
						<div>
							<ImageTag
								src={`${AssetUtilModel.ICON_PATH}/sword.svg`}
								height='auto'
							/>
						</div>
						<div>
							<ImageTag
								src={`${AssetUtilModel.ICON_PATH}/wand.svg`}
								height='auto'
							/>
						</div>
					</div>
					<div className='title'>
						<Loading loading={!ready} width='280px'>
							<div>
								{t('title', {
									defaultValue: 'Play and Earn',
								})}
							</div>
						</Loading>
					</div>
					<div className='subtitle'>
						<Loading loading={!ready} width='280px' multiple={4}>
							<div>
								{t('subtitle', {
									defaultValue:
										'Enjoy a truly unique MMO experience and earn crypto while playing. Join up in a group as a Mage, Warrior, or Archer and head into the Dark Dungeon to fight bosses for many rewards including items and crypto.',
								})}
							</div>
						</Loading>
					</div>
				</div>
			</div>
		</section>
	);
};

export default PlayAndEarn;
