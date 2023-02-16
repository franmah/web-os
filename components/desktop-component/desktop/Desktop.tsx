import { FC, Fragment } from 'react';
import DesktopItemContainer from '../item-container/ItemsContainer';
import styles from './desktop.module.scss';
import { File } from '../../../System/file';

const Desktop: FC = () => {
  return (
    <Fragment>
      <div className={styles.background} id='desktop'>
        <DesktopItemContainer files={File.getRoot().children[0].children}/>
      </div>
    </Fragment>
    
  );
};

export default Desktop;