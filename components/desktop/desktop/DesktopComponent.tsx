import { FC, Fragment, useContext } from 'react';
import DesktopItemContainerComponent from '../items-container/ItemsContainerComponent';
import styles from './desktop.module.scss';
import background from '../../../assets/background_image_light.jpg';
import background_1080 from '../../../assets/background_image_light_1080_2.jpg';
import background_1440 from '../../../assets/background_image_light_1440_2.jpg';
import background_2400 from '../../../assets/background_image_light_2400_2.jpg';
import { FileSystemContext } from '../../../contexts/FileSystemContext';
import { ProcessContext } from '../../../contexts/processContext';
import { ContextMenuCommandList } from '../../../types/system/contextMenu/contextMenu';

const Desktop: FC = () => {
  const { getDesktop } = useContext(FileSystemContext);
  const processContext = useContext(ProcessContext);

  const handleItemContextMenuClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDesktopContextMenuClick = (event: MouseEvent,  commands: ContextMenuCommandList) => {
    event.preventDefault();
    event.stopPropagation();

    processContext.openProcess('contextMenu', {
      top: event.clientY,
      left: event.clientX,
      commands
    });
  };

  return (
    <Fragment>
      <img
        alt="background image"
        className={styles.backgroundImg}
        src={background.src}
        srcSet={`${background_1080.src} 1920w, ${background_1440.src} 3440w, ${background_2400.src} 3840w`}
      />
      
      <div className={styles.background} id='desktop'>
        <DesktopItemContainerComponent 
          files={getDesktop().children}
          onDesktopContextMenuClick={handleDesktopContextMenuClick}
          onItemContextMenuClick={handleItemContextMenuClick}
        />
      </div>
    </Fragment>
  );
};

export default Desktop;