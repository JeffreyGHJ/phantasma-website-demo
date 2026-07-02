import { GenericMetadata } from '../../../../../constants/types/GenericMetadata';
import axios from 'axios';
import { fetchMetadata } from '../../../../../apis/web/web.api';

export const getMetaData = async ({
	url,
	serverFetching,
}: {
	url: string;
	serverFetching: boolean;
}) => {
	if (serverFetching) {
		const res = await fetchMetadata(url);

		return res;
	}
	const res = await axios.get(url);

	return res.data as GenericMetadata;
};
