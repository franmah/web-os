import { FC, Fragment, useContext } from 'react';
import DesktopItemContainer from '../items-container/DesktopItemsContainer';
import styles from './desktop.module.scss';
import background from '../../../assets/background_image_light.jpg';
import background1080 from '../../../assets/background_image_light.jpg';
import background1440 from '../../../assets/background_image_light.jpg';
import background2400 from '../../../assets/background_image_light.jpg';
import { FileSystemContext } from '../../../contexts/FileSystemContext';
import { ProcessContext } from '../../../contexts/ProcessContext';
import { ContextMenuCommandList } from '../../../types/system/context-menu/ContextMenu';
import { DesktopItem } from '../../../types/desktop/DesktopItem';

const Desktop: FC = () => {
  const { getDesktop, appendFile, mkdir } = useContext(FileSystemContext);
  const { openProcess } = useContext(ProcessContext);

  const handleItemContextMenuClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDesktopContextMenuClick = (event: MouseEvent, commands: ContextMenuCommandList) => {
    event.preventDefault();
    event.stopPropagation();

    openProcess('contextMenu', {
      commands,
      left: event.clientX,
      top: event.clientY
    });
  };

  const openItemProcess = (item: DesktopItem) => {
    // const explorerItem = getDesktop().children.find(c => c.id === item.id);
    // openProcess('sunTextEditor', { file: explorerItem  });
    openProcess('explorer', { startPath: '/Desktop' });
  };

  const handleFileChange = (newItem: DesktopItem) => {
    const oldFile = getDesktop().children?.find(file => file.id === newItem.id);
    if (!oldFile) {
      appendFile(newItem.name, newItem.iconPath, getDesktop(), newItem.id);
    }
  };

  const handleFolderChange = (item: DesktopItem) => {
    const oldFolder = getDesktop().children?.find(file => file.id === item.id);

    if (!oldFolder) {
      mkdir(item.name, getDesktop());
    }
  };

  return (
    <Fragment>
      {
        // <Image> doesn't support srcSet.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt="background image"
          className={styles.backgroundImg}
          src={background.src}
          srcSet={`${background1080.src} 1920w, ${background1440.src} 3440w, ${background2400.src} 3840w`}
        />
      }

      <div className={styles.background} id='desktop'
        // onDrop={handleUserComputerFileDrop}
        // onDragOver={(e) => e.preventDefault() } // Needed to prevent browser from opening user's file on drop
      >
        <DesktopItemContainer
          files={getDesktop().children}
          onDesktopContextMenuClick={handleDesktopContextMenuClick}
          onItemContextMenuClick={handleItemContextMenuClick}
          onFileChange={handleFileChange}
          onFolderChange={handleFolderChange}
          onItemDoubleClick={openItemProcess}
        />
      </div>
    </Fragment>
  );
};

export default Desktop;

// const handleUserComputerFileDrop: DragEventHandler<HTMLDivElement> = (event) => {
//   event.preventDefault();
//   // Prevent file from being opened
//   // console.log({ file: event.dataTransfer });

//   if (event.dataTransfer.items) {
//     Array.from(event.dataTransfer.items).forEach(item => {

//       console.log({ item })
//       const f: any = item.webkitGetAsEntry();

//       if (!f) { return; }
//       console.log({ f })

//       if (f.isDirectory) {
//         const dirReader = f.createReader();

//         // Read subfiles/subfolder
//         dirReader.readEntries(entries => {
//           // console.log({ entries: entries })

//           entries.forEach(entry => {

//             // Read a file
//             if (entry.isFile) {
//               entry.file(file => {
//                 console.log({ file })

//                 // // Read content
//                 // // For some reason the type of the file doesn't work
//                 // file.text().then(text => console.log({ text }))

//                 const reader = new FileReader();

//                 reader.onload = function(event) {
//                   const blob = new Blob([event.target.result], { type: file.type });
//                   console.log(`Blob for ${file.name}:`, blob);

//                   // Do something with the Blob object
//                 };

//                 reader.readAsArrayBuffer(file);
//               });
//             }
//           })

//         })

//       }
//     })
//   }
// }