import { FC, useState } from 'react';
import DesktopElement from './element';
import { ExplorerElement } from '../../types/ExplorerElement';
import { FcAbout } from 'react-icons/fc';
import styles from './desktop.module.scss';

const Desktop: FC = () => {
  const [elements, setElements] = useState<ExplorerElement[]>(getFakeDesktopElement());

  return (
    <div className={styles.background}>
      { elements.map((e, index) =>
        <DesktopElement key={index} element={e}/>
      ) }
    </div>
  );
};

function getFakeDesktopElement(): ExplorerElement[] {
  const elements: ExplorerElement[] = [{
    children: [],
    icon: <FcAbout size={40}/>,
    name: 'This is a very long name that should be shortened.txt',
    parent: null
  }];
  return elements;
}

export default Desktop;