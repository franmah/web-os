import type { NextPage } from 'next';
import ProcessContextProvider from '../contexts/processContext';
import { ProcessLoaderComponent } from '../components/system/processLoaderComponent';
import FileSystemContextProvider from '../contexts/FileSystemContext';
import ExplorerQuickAccessProvider from '../contexts/explorer-quick-access-context';

const Home: NextPage = () => (
  <div>
    <ProcessContextProvider>
      <FileSystemContextProvider>
        <ExplorerQuickAccessProvider>
          <ProcessLoaderComponent></ProcessLoaderComponent>
        </ExplorerQuickAccessProvider>
      </FileSystemContextProvider>
    </ProcessContextProvider>
  </div>
);

export default Home;