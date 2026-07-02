import { collectionItemImageUrl } from '../../../../utils/collectionitemUtils';
import { useView3d } from '../../../../state/application/hooks';

const NftImage = ({
	item,
	height = '200px',
	width = '200px',
}: {
	item:
		| {
				image_3d?: string;
				image_png?: string;
				image_gif?: string;
				token_image_ext: string;
				name: string;
				token_id: string | number;
		  }
		| null
		| undefined;
	height?: string;
	width?: string;
}) => {
	const view3d = useView3d();

	return item ? (
		<img
			className='widget NftImage'
			src={collectionItemImageUrl({
				view3d,
				item,
			})}
			alt={`${item.name} #${item.token_id}`}
			height={height}
			width={width}
			style={{
				objectFit: 'cover',
				borderRadius: '5px',
			}}
		/>
	) : (
		<></>
	);
};

export default NftImage;
