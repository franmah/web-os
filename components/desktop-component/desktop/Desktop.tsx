import { FC, Fragment } from 'react';
import DesktopItemContainer from '../item-container/ItemsContainer';
import styles from './desktop.module.scss';
import { File } from '../../../System/file';
import background from '../../../assets/background_image_light.jpg';

const Desktop: FC = () => {
  return (
    <Fragment>
      <img alt="background image" className={styles.backgroundImg} src={background.src}/>I
      <div className={styles.background} id='desktop'>
        <DesktopItemContainer files={File.getRoot().children[0].children}/>
      </div>
    </Fragment>
    
  );
};

export default Desktop;