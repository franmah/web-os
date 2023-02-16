import { FC, Fragment } from 'react';
import DesktopItemContainer from '../item-container/ItemsContainer';
import styles from './desktop.module.scss';
import { File } from '../../../System/file';
import background from '../../../assets/background_image_light.jpg';
import background_1080 from '../../../assets/background_image_light_1080_2.jpg';
import background_1440 from '../../../assets/background_image_light_1440_2.jpg';
import background_2400 from '../../../assets/background_image_light_2400_2.jpg';

const Desktop: FC = () => {
  return (
    <Fragment>
      <img
        alt="background image"
        className={styles.backgroundImg}
        src={background.src}
        srcSet={`${background_1080.src} 1920w, ${background_1440.src} 3440w, ${background_2400.src} 3840w`}
      />
      <div className={styles.background} id='desktop'>
        <DesktopItemContainer files={File.getRoot().children[0].children}/>
      </div>
    </Fragment>
    
  );
};

export default Desktop;