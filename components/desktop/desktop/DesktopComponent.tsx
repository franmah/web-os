import { DragEventHandler, FC, Fragment, useContext } from 'react';
import DesktopItemContainerComponent from '../items-container/ItemsContainerComponent';
import styles from './desktop.module.scss';
import background from '../../../assets/background_image_light.jpg';
import background_1080 from '../../../assets/background_image_light.jpg';
import background_1440 from '../../../assets/background_image_light.jpg';
import background_2400 from '../../../assets/background_image_light.jpg';
import { FileSystemContext } from '../../../contexts/FileSystemContext';
import { ProcessContext } from '../../../contexts/processContext';
import { ContextMenuCommandList } from '../../../types/system/contextMenu/contextMenu';
import { DesktopItem } from '../../../types/desktop/DesktopItem';
import { FOLDER_ICON_PATH } from '../../../constants/FileSystemConsts';

const Desktop: FC = () => {
  const { getDesktop, addFile } = useContext(FileSystemContext);
  const  { openProcess } = useContext(ProcessContext);

  const handleItemContextMenuClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDesktopContextMenuClick = (event: MouseEvent,  commands: ContextMenuCommandList) => {
    event.preventDefault();
    event.stopPropagation();

    openProcess('contextMenu', {
      top: event.clientY,
      left: event.clientX,
      commands
    });
  };

  const openItemProcess = (item: DesktopItem) => {
    openProcess('sunTextEditor', { originalContent: 'start content' });
  };

  const handleFileChange = (newItem: DesktopItem) => {
    const oldFile = getDesktop().children?.find(file => file.id === newItem.id);

    if (!oldFile) {
      addFile(newItem.name, FOLDER_ICON_PATH, getDesktop(), newItem.id);
    }
  };

  const handleUserComputerFileDrop: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    // Prevent file from being opened
    // console.log({ file: event.dataTransfer });

    if (event.dataTransfer.items) {
      Array.from(event.dataTransfer.items).forEach(item => {

        console.log({ item })
        const f: any = item.webkitGetAsEntry();


        if (!f) { return; }
        console.log({ f })

        if (f.isDirectory) {
          const dirReader = f.createReader();

          // Read subfiles/subfolder
          dirReader.readEntries(entries => {
            // console.log({ entries: entries })

            entries.forEach(entry => {

              // Read a file
              if (entry.isFile) {
                entry.file(file => {
                  console.log({ file })

                  // // Read content
                  // // For some reason the type of the file doesn't work
                  // file.text().then(text => console.log({ text }))


                  const reader = new FileReader();
        
                  reader.onload = function(event) {
                    const blob = new Blob([event.target.result], { type: file.type });
                    console.log(`Blob for ${file.name}:`, blob);
                    
                    // Do something with the Blob object
                  };
                  
                  reader.readAsArrayBuffer(file);
                });
              }
            })

          })

        }
      })
    }
  }

  return (
    <Fragment>
      <img
        alt="background image"
        className={styles.backgroundImg}
        src={background.src}
        srcSet={`${background_1080.src} 1920w, ${background_1440.src} 3440w, ${background_2400.src} 3840w`}
      />
      
      <div className={styles.background} id='desktop'
        onDrop={handleUserComputerFileDrop}
        onDragOver={(e) => e.preventDefault() } // Needed to prevent browser from opening file on drop
      >
        <DesktopItemContainerComponent 
          files={getDesktop().children}
          onDesktopContextMenuClick={handleDesktopContextMenuClick}
          onItemContextMenuClick={handleItemContextMenuClick}
          onFileChange={handleFileChange}
          onItemDoubleClick={openItemProcess}
        />
      </div>
    </Fragment>
  );
};

export default Desktop;