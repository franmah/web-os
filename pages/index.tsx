import type { NextPage } from 'next';
import ProcessContextProvider from '../contexts/ProcessContext';
import { ProcessLoader } from '../components/system/ProcessLoader';
import FileSystemContextProvider from '../contexts/FileSystemContext';
import ExplorerQuickAccessProvider from '../contexts/ExplorerQuickAccessContext';

const env = process.env.NODE_ENV;
console.log(env);

const Home: NextPage = () => (
	<div>
		<ProcessContextProvider>
			<FileSystemContextProvider>
				<ExplorerQuickAccessProvider>
					<ProcessLoader></ProcessLoader>
				</ExplorerQuickAccessProvider>
			</FileSystemContextProvider>
		</ProcessContextProvider>
	</div>
);

export default Home;
