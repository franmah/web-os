import type { NextPage } from 'next';
import ProcessContextProvider from '../contexts/processContext';
import { ProcessLoaderComponent } from '../components/system/processLoaderComponent';
import FileSystemContextProvider from '../contexts/FileSystemContext';

const Home: NextPage = () => (
  <div>
    <ProcessContextProvider>
      <FileSystemContextProvider>
        <ProcessLoaderComponent></ProcessLoaderComponent>
      </FileSystemContextProvider>
    </ProcessContextProvider>
  </div>
);

export default Home;