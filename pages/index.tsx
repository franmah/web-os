import Desktop from '../components/desktop-component/desktop/Desktop';
import type { NextPage } from 'next';
import Taskbar from '../components/taskbar/Taskbar';

const Home: NextPage = () => (
  <div>
    <Desktop />
    <Taskbar />
  </div>
);

export default Home;