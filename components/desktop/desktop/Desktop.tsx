import { FC, Fragment, useContext, useEffect, useState } from 'react';
import DesktopItemsContainer from '../items-container/DesktopItemsContainer';
import styles from './desktop.module.scss';
import background from '../../../assets/background_image_light.jpg';
import background1080 from '../../../assets/background_image_light.jpg';
import background1440 from '../../../assets/background_image_light.jpg';
import background2400 from '../../../assets/background_image_light.jpg';
import { FileSystemContext } from '../../../contexts/FileSystemContext';
import { ProcessContext } from '../../../contexts/ProcessContext';
import { ContextMenuCommandList } from '../../../types/system/context-menu/ContextMenu';
import { DesktopItem } from '../../../types/desktop/DesktopItem';
import { CommonFolderPaths } from '../../../constants/system/file-system/CommonFilePaths';
import { getCurrentItemNameInPath, getFileExtension } from '../../../services/file-system/FilePathService';
import { ProcessDirectoryByExtension } from '../../../System/process/ProcessDirectoryByExtension';
import { ExplorerItem } from '../../../types/system/file/ExplorerItem';
import { saveAnalyticsEvent } from '../../../services/AnalyticsService';
import { AnalyticEvents } from '../../../constants/AnalyticEvents';
import { ProcessNameEnum } from '../../../System/process/ProcessNameEnum';

const Desktop: FC = () => {
	const fs = useContext(FileSystemContext);
	const { openProcess } = useContext(ProcessContext);

	const [fileItems, setFileItems] = useState<ExplorerItem[]>([]);

	useEffect(() => {
		fs.opendir(CommonFolderPaths.DESKTOP).then(items => setFileItems([...items]));
	}, [fs]);

	const handleItemContextMenuClick = (event: MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
	};

	const handleDesktopContextMenuClick = (event: MouseEvent, commands: ContextMenuCommandList) => {
		event.preventDefault();
		event.stopPropagation();

		openProcess(ProcessNameEnum.CONTEXT_MENU, {
			commands,
			left: event.clientX,
			top: event.clientY
		});
	};

	const openItemProcess = (item: DesktopItem) => {
		if (fs.isDirectory(item.path)) {
			return openProcess(ProcessNameEnum.EXPLORER, { startPath: item.path });
		}

		const fileName = getCurrentItemNameInPath(item.path);
		const extension = getFileExtension(fileName);
		const processName = ProcessDirectoryByExtension[extension];
		if (!processName) {
			console.error('Tried to open an unkown extension. file: ' + item.path);
		} else {
			openProcess(ProcessNameEnum.DOOM);
		}
	};

	const handleNewItemCreated = (path: string) => {
		if (fs.isDirectory(path)) {
			fs.mkdir(path).then(() => saveAnalyticsEvent(AnalyticEvents.CREATE_FILE, { app: 'desktop', path }));
		} else {
			fs.appendFileV2(path).then(() => saveAnalyticsEvent(AnalyticEvents.CREATE_FILE, { app: 'desktop', path }));
		}
	};

	const handleRenameItem = (oldPath: string, newPath: string) => {
		fs.renameFolderV2(oldPath, getCurrentItemNameInPath(newPath));
	};

	const handleDeleteItems = (...paths: string[]) => {
		saveAnalyticsEvent(AnalyticEvents.DELETE_FILE, { app: ProcessNameEnum.DESKTOP, paths: JSON.stringify(paths) });
		for (const path of paths) {
			fs.deleteFolderV2(path);
		}
	};

	return (
		<Fragment>
			{
				// <Image> doesn't support srcSet.
				// eslint-disable-next-line @next/next/no-img-element
				<img
					alt='background image'
					className={styles.backgroundImg}
					src={background.src}
					srcSet={`${background1080.src} 1920w, ${background1440.src} 3440w, ${background2400.src} 3840w`}
				/>
			}

			<div
				className={styles.background}
				id='desktop'
				// onDrop={handleUserComputerFileDrop}
				// onDragOver={(e) => e.preventDefault() } // Needed to prevent browser from opening user's file on drop
			>
				<DesktopItemsContainer
					fileItems={fileItems}
					onDeleteItems={handleDeleteItems}
					onDesktopContextMenuClick={handleDesktopContextMenuClick}
					onItemContextMenuClick={handleItemContextMenuClick}
					onItemCreated={handleNewItemCreated}
					onRenameItem={handleRenameItem}
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
