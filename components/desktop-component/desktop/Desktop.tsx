import { FC } from 'react';
import DesktopItemContainer from '../item-container/ItemsContainer';
import styles from './desktop.module.scss';
import { File } from '../../../System/file';

const Desktop: FC = () => {
  return (
    <div className={styles.background} id='desktop'>
      <DesktopItemContainer files={File.getRoot().children[0].children}/>
    </div>
  );
};

export default Desktop;