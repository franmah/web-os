import { AnalyticEvents } from '../constants/AnalyticEvents';
import { setDoc, arrayUnion, Timestamp, doc } from 'firebase/firestore';
import { db } from '../pages/index';

const ANALYTICS_COLLECTION = 'analytics';
const CONNECTION_ARRAY = 'connections';
const EVENT_ARRAY = 'events';

export const saveConnectionFirestore = (ipAddress: string) => {
	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	const ref = doc(db, `${ANALYTICS_COLLECTION}/${ipAddress}`);
	setDoc(
		ref,
		{
			[CONNECTION_ARRAY]: arrayUnion(Timestamp.now()),
			last_connection: Timestamp.now(),
			timezone
		},
		{ merge: true }
	).catch(error => console.debug(error));
};

export const saveEventFirestore = (ipAddress: string, event: AnalyticEvents, payload: { [key: string]: any }) => {
	const data = {
		event,
		payload,
		timestamp: Timestamp.now()
	};

	const ref = doc(db, `${ANALYTICS_COLLECTION}/${ipAddress}`);
	setDoc(
		ref,
		{
			[EVENT_ARRAY]: arrayUnion(data)
		},
		{ merge: true }
	).catch(error => console.debug(error));
};
