import { FC } from 'react';
import DesktopItemContainer from './element-container';
import styles from './desktop.module.scss';
import { ExplorerFile } from '../../types/ExplorerElement';

const Desktop: FC = () => {
  return (
    <div className={styles.background} id='desktop'>
      <DesktopItemContainer files={getFakeDesktopFiles()}/>
    </div>
  );
};

function getFakeDesktopFiles(): ExplorerFile[] {
  const elements: ExplorerFile[] = [
    {
      children: [],
      iconPath: '/icons/folder-icon.png',
      name: 'num #1',
      parent: null
    },
    {
      children: [],
      iconPath: '/icons/folder-icon.png',
      name: 'num #2',
      parent: null
    },
    {
      children: [],
      iconPath: '/icons/folder-icon.png',
      name: 'num #3',
      parent: null
    },
    {
      children: [],
      iconPath: '/icons/folder-icon.png',
      name: 'num #4',
      parent: null
    },
    {
      children: [],
      iconPath: '/icons/folder-icon.png',
      name: 'num #5',
      parent: null
    }
    ];

  return elements;
}

export default Desktop;