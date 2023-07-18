import { AnalyticEvents } from '../constants/AnalyticEvents';
import { saveConnectionFirestore, saveEventFirestore } from '../repositories/AnalyticsFirestore';

const env = process.env.NODE_ENV;

const IP_API = 'https://api.ipify.org/?format=json';

export const saveConnection = async () => {
	if (env === 'production') {
		const ipAddress = await getIpAddress();
		return saveConnectionFirestore(ipAddress);
	}
};

export const saveAnalyticsEvent = async (event: AnalyticEvents, payload: { [key: string]: any }) => {
	if (env === 'production') {
		const ipAddress = await getIpAddress();
		return saveEventFirestore(ipAddress, event, payload);
	}
};

const getIpAddress = (): Promise<string> => {
	return fetch(IP_API)
		.then(res => res.json())
		.then(data => data?.ip || '');
};
