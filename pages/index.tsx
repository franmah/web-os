import type { NextPage } from 'next';
import ProcessContextProvider from '../contexts/ProcessContext';
import { ProcessLoader } from '../components/system/ProcessLoader';
import FileSystemContextProvider from '../contexts/FileSystemContext';
import ExplorerQuickAccessProvider from '../contexts/ExplorerQuickAccessContext';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { saveConnection } from '../services/AnalyticsService';
import { TaskbarPinnedAppProvider } from '../contexts/TaskbarPinnedAppContext';
import WindowContextProvider from '../contexts/WindowContext';

const firebaseApp = initializeApp({
  apiKey: "AIzaSyCDAyEgX1zVqbC_Ye3Tlt-mZyp6D-mmHvU",
  authDomain: "web-os-57c81.firebaseapp.com",
  projectId: "web-os-57c81",
  storageBucket: "web-os-57c81.appspot.com",
  messagingSenderId: "233393781920",
  appId: "1:233393781920:web:36e82ffe3a987441faddc5"
});

export const db = getFirestore(firebaseApp);

saveConnection();

const Home: NextPage = () => (
	<div>
		<FileSystemContextProvider>
			<ProcessContextProvider>
				<ExplorerQuickAccessProvider>
					<TaskbarPinnedAppProvider>
						<WindowContextProvider>
							<ProcessLoader />				
						</WindowContextProvider>
					</TaskbarPinnedAppProvider>
				</ExplorerQuickAccessProvider>
			</ProcessContextProvider>
		</FileSystemContextProvider>
	</div>
);

export default Home;
