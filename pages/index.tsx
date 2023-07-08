import type { NextPage } from 'next';
import ProcessContextProvider from '../contexts/processContext';
import { ProcessLoader } from '../components/system/ProcessLoader';
import FileSystemContextProvider from '../contexts/FileSystemContext';
import ExplorerQuickAccessProvider from '../contexts/explorer-quick-access-context';

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