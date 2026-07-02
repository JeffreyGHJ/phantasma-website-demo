import { defaultIconSrc } from './ImageUtil';

export const collectionItemImageUrl = ({
	view3d,
	item,
}: {
	view3d: boolean;
	item: {
		image_3d?: string;
		image_png?: string;
		image_gif?: string;
		token_image_ext: string;
	};
}): string => {
	if (!item) {
		return defaultIconSrc();
	}

	if (view3d && item.image_3d) {
		return item.image_3d;
	}

	if (item.token_image_ext === 'gif' && item.image_gif) {
		return item.image_gif;
	}

	if (item.token_image_ext === 'png' && item.image_png) {
		if (item.image_png.startsWith('ipfs://')) {
			return `https://ipfs.io/ipfs/${item.image_png.split('ipfs://')[1]}`;
		}
		return item.image_png;
	}

	return defaultIconSrc();
};
