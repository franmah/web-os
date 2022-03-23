import Desktop from '../components/desktop';
import type { NextPage } from 'next';
import Taskbar from '../components/taskbar';

const Home: NextPage = () => (
  <div>
    <Desktop />
    <Taskbar />
  </div>
);

export default Home;