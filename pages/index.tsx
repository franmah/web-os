import type { NextPage } from 'next';
import ProcessContextProvider from '../contexts/processContext';
import { ProcessLoader } from '../System/processLoader';

const Home: NextPage = () => (
  <div>
    <ProcessContextProvider>
      <ProcessLoader></ProcessLoader>
    </ProcessContextProvider>
  </div>
);

export default Home;