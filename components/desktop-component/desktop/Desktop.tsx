import { FC } from 'react';
import DesktopItemContainer from '../item-container/ItemsContainer';
import styles from './desktop.module.scss';
import { FileProcess } from '../../../processes/FileProcess';

const Desktop: FC = () => {
  return (
    <div className={styles.background} id='desktop'>
      <DesktopItemContainer files={FileProcess.getRoot().children[0].children}/>
    </div>
  );
};

export default Desktop;