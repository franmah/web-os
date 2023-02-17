import type { NextPage } from 'next';
import ProcessContextProvider from '../contexts/processContext';
import { ProcessLoaderComponent } from '../components/system/processLoaderComponent';

const Home: NextPage = () => (
  <div>
    <ProcessContextProvider>
      <ProcessLoaderComponent></ProcessLoaderComponent>
    </ProcessContextProvider>
  </div>
);

export default Home;