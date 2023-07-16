import { FC, Fragment, useContext, useEffect, useState } from 'react';
import { DesktopItem } from '../../../types/desktop/DesktopItem';
import { explorerItemToDesktopItem, getNewItemName, pathToDesktopItem } from '../../../services/system/desktop/DesktopItemContainerService';
import {
	getSelectedItemsFromSelectionBoxgWithCtrl,
	moveItemsOnDesktop,
	selectItemsWithShiftKey
} from '../../../services/system/desktop/DesktopItemContainerUiHelperService';
import { NewFolderCommand } from '../../../System/context-menu-commands/commands/NewFolderCommand';
import { SortCommandContainer } from '../../../System/context-menu-commands/command-containers/SortCommand';
import { NewItemCommandContainer } from '../../../System/context-menu-commands/command-containers/NewItemCommand';
import { SortByNameCommand } from '../../../System/context-menu-commands/commands/SortByNameCommand';
import { isEventOriginatedFromWithinTargetIdSubtree } from '../../../services/EventService';
import { DesktopSortOptions, setItemPositions } from '../../../services/system/desktop/DesktopItemPlacementService';
import { ContextMenuCommandList } from '../../../types/system/context-menu/ContextMenu';
import DesktopItemComponent from '../item/DesktopItem';
import SelectionBoxComponent from '../../shared/selection-box/SelectionBox';
import { NewTxtFileCommand } from '../../../System/context-menu-commands/commands/NewTxtFileCommand';
import { CommonFolderPaths } from '../../../constants/system/file-system/CommonFilePaths';
import {
	getCurrentItemNameInPath,
	getFileExtension,
	getParentPath,
	isNewItemNameValid
} from '../../../services/file-system/FilePathService';
import { FileSystemContext } from '../../../contexts/FileSystemContext';
import { ExplorerItem } from '../../../types/system/file/ExplorerItem';
import { getIconPathByExtension } from '../../../services/IconService';

const DesktopItemsContainer: FC<{
	paths: string[];
	fileItems: ExplorerItem[];
	onDesktopContextMenuClick: (event: MouseEvent, commands: ContextMenuCommandList) => void;
	onItemContextMenuClick: (event: MouseEvent) => void;
	onItemCreated: (path: string) => void;
	onItemDoubleClick: (item: DesktopItem) => void;
	onRenameItem: (oldPath: string, newPath: string) => void;
}> = ({ paths, fileItems, onDesktopContextMenuClick, onItemContextMenuClick, onItemCreated, onItemDoubleClick, onRenameItem }) => {
	const fs = useContext(FileSystemContext);

	const [desktopItems, setDesktopItems] = useState<DesktopItem[]>([]);

	// useEffect(() => {
	// 	const items = paths.map(path => pathToDesktopItem(path, fs.isDirectory(path)));
	// 	setDesktopItems(() => [...setItemPositions(items, DesktopSortOptions.default)]);
	// }, [paths]);

	useEffect(() => {
		setDesktopItems(currentItems => {
			const updatedItems: DesktopItem[] = [];

			// Update current items that have been modified
			currentItems.forEach(desktopItem => {
				const matchingFileItem = fileItems.find(fi => fi.id === desktopItem.id);
				if (matchingFileItem) {
					updatedItems.push({
						fsId: matchingFileItem.id,
						iconPath: getIconPathByExtension(getFileExtension(matchingFileItem.name)),
						id: desktopItem.id,
						left: desktopItem.left,
						path: CommonFolderPaths.DESKTOP + '/' + matchingFileItem.name,
						selected: desktopItem.selected,
						top: desktopItem.top
					});
				}
			});

			// Add new items
			const newItems = fileItems.filter(fi => !currentItems.find(ci => ci.id === fi.id));
			updatedItems.push(...newItems.map(i =>
				explorerItemToDesktopItem(i, CommonFolderPaths.DESKTOP + '/' + i.name, fs.isDirectory(CommonFolderPaths.DESKTOP + '/' + i.name))));

			return setItemPositions(updatedItems, DesktopSortOptions.default);
		});
	}, [fileItems]);

	// Any click anywhere in the app should unselect all items
	useEffect(() => {
		const onMouseDown = (event: MouseEvent) => {
			if (event.ctrlKey) {
				return;
			}

			// If mousedown is on desktop unselect all items.
			if ((event.target as any).id === 'desktop') {
				selectItems();
				return;
			}

			// If mousedown event comes from an item then don't unselect
			const isEventFromAnyItem = desktopItems.some(item => isEventOriginatedFromWithinTargetIdSubtree(event, item.id));

			if (!isEventFromAnyItem) {
				selectItems();
			}
		};

		document.addEventListener('mousedown', onMouseDown, true);
		return () => {
			document.removeEventListener('mousedown', onMouseDown, true);
		};
	}, [desktopItems]);

	useEffect(() => {
		const desktop = document.getElementById('desktop');
		desktop?.addEventListener('contextmenu', onContextMenuClick);
		return () => {
			desktop?.removeEventListener('contextmenu', onContextMenuClick);
		};
	}, []);

	const onContextMenuClick = (event: MouseEvent) => {
		const commands = [
			new NewItemCommandContainer([
				new NewFolderCommand(() => addItem(event.clientY, event.clientX, 'folder')),
				new NewTxtFileCommand(() => addItem(event.clientY, event.clientX, 'Text'))
			]),
			new SortCommandContainer([
				new SortByNameCommand(() =>
					setDesktopItems(currentItems => [...setItemPositions(currentItems, DesktopSortOptions.name)])
				)
			])
		];

		onDesktopContextMenuClick(event, commands);
	};

	const addItem = (top: number, left: number, fileType: string) => {
		setDesktopItems(currentItems => {
			const isDirectory = fileType === 'folder';
			const newItemName = getNewItemName(fileType, currentItems);
			const path = CommonFolderPaths.DESKTOP + '/' + newItemName + _getExtension(fileType);
			const item = pathToDesktopItem(path, isDirectory);
			item.left = left;
			item.top = top;

			onItemCreated(item.path);
			return [...currentItems, item];
		});
	};

	const _getExtension = (fileType: string) => {
		if (fileType === 'folder') return '';
		if (fileType === 'Text') return '.txt';
	};

	// TODO: once changes to the File System triggers a render, this should be handled by the FS context
	const handleItemRenamed = (itemToRenameId: string, itemNewName: string) => {
		setDesktopItems(currentItems => {
			if (!itemNewName) {
				return currentItems;
			}

			const itemToRename = currentItems.find(item => item.id === itemToRenameId);
			if (!itemToRename) {
				console.error(`Error renaming item: ${itemToRenameId}. Item not found.`);
				return currentItems;
			}

			const parentPath = getParentPath(itemToRename.path);
			const newPath = parentPath + '/' + itemNewName;

			if (!isNewItemNameValid(itemToRename.path, newPath, fs.isDirectory(itemToRename.path))) {
				return currentItems;
			}

			const isNameAlreadyUsed = currentItems.find(
				i => getCurrentItemNameInPath(i.path) === itemNewName && i.path !== itemToRenameId
			);

			if (isNameAlreadyUsed) {
				return currentItems;
			}

			const updatedItems: DesktopItem[] = currentItems.map(item => ({
				...item,
				path: item.id === itemToRenameId ? newPath : item.path,
				selected: item.id === itemToRenameId
			}));

			onRenameItem(itemToRename.path, newPath);
			return [...updatedItems];
		});
	};

	const moveItem = (
		itemId: string,
		startItemTop: number,
		startItemLeft: number,
		newItemTop: number,
		newItemLeft: number
	) => {
		setDesktopItems(currentItems => {
			const updatedItems = moveItemsOnDesktop(
				currentItems,
				itemId,
				startItemTop,
				startItemLeft,
				newItemTop,
				newItemLeft
			);
			return [...updatedItems];
		});
	};

	const selectItems = (...itemIds: string[]) => {
		setDesktopItems(currentItems => {
			const updated = currentItems.map(i => ({ ...i, selected: itemIds.includes(i.id) }));
			return [...updated];
		});
	};

	const selectItemsWithCtrl = (...itemIds: string[]) => {
		setDesktopItems(currentItems => {
			const updatedItems = currentItems.map(i => ({
				...i,
				selected: itemIds.includes(i.id) ? !i.selected : i.selected
			}));
			return [...updatedItems];
		});
	};

	const selectItemWithShift = (itemId: string, ctrlKey: boolean) => {
		setDesktopItems(currentItems => {
			const clickedItem = currentItems.find(item => item.id === itemId);

			if (!clickedItem || clickedItem.selected) {
				return currentItems;
			}

			return [...selectItemsWithShiftKey(itemId, currentItems, ctrlKey)];
		});
	};

	const handleItemDoubleClick = (item: DesktopItem) => {
		onItemDoubleClick(item);
	};

	const handleSelectionBoxUpdates = (
		elements: HTMLElement[],
		previousElementInBox: HTMLElement[],
		ctrlKey: boolean
	) => {
		const selectedItemIds = elements.map(element => element.id);

		if (!ctrlKey) {
			selectItems(...selectedItemIds);
		} else {
			setDesktopItems(currentDesktopItems => {
				return [
					...getSelectedItemsFromSelectionBoxgWithCtrl(currentDesktopItems, selectedItemIds, previousElementInBox)
				];
			});
		}
	};

	return (
		<Fragment>
			{desktopItems.map((item, index) => (
				<DesktopItemComponent
					key={index}
					item={item}
					moveItem={moveItem}
					selectItems={selectItems}
					selectItemsWithCtrl={selectItemsWithCtrl}
					selectItemsWithShift={selectItemWithShift}
					handleDoubleClick={handleItemDoubleClick}
					handleContextMenuClick={event => onItemContextMenuClick(event)}
					onItemRename={handleItemRenamed}
				/>
			))}

			<SelectionBoxComponent emitSelectedItemsUpdate={handleSelectionBoxUpdates} targetElementId='desktop' />
		</Fragment>
	);
};

export default DesktopItemsContainer;
