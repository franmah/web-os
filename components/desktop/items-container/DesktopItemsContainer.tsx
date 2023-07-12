import { ExplorerFile } from '../../../types/system/file/ExplorerElement';
import { FC, Fragment, useEffect, useState } from 'react';
import { DesktopItem } from '../../../types/desktop/DesktopItem';
import {
	DEFAULT_FOLDER_ICON_PATH,
	getNewItemName,
	toItemWrappers
} from '../../../services/system/desktop/DesktopItemContainerService';
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
import { defaultProcessByExtension } from '../../../System/process/ProcessDirectoryByExtension';
import { ProcessDirectory } from '../../../System/process/ProcessDirectory';
import { CommonFolderPaths } from '../../../constants/system/file-system/CommonFilePaths';
import { getCurrentItemNameInPath } from '../../../services/file-system/FilePathService';

const DesktopItemContainer: FC<{
	paths: string[];
	onDesktopContextMenuClick: (event: MouseEvent, commands: ContextMenuCommandList) => void;
	onItemContextMenuClick: (event: MouseEvent) => void;
	onFileChange: (newItem: DesktopItem) => void;
	onFolderChange: (item: DesktopItem) => void;
	onItemDoubleClick: (item: DesktopItem) => void;
}> = ({
	paths,
	onDesktopContextMenuClick,
	onItemContextMenuClick,
	onFileChange,
	onFolderChange,
	onItemDoubleClick
}) => {
	const [desktopItems, setDesktopItems] = useState<DesktopItem[]>([]);

	useEffect(() => {
		const items = toItemWrappers(paths);
		setDesktopItems(() => [...setItemPositions(items, DesktopSortOptions.default)]);
	}, [paths]);

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

	const addItem = (top: number, left: number, type: string) => {
		if (type === 'folder') {
			return addFolder(top, left);
		}

		setDesktopItems(currentItems => {
			const newItemName = getNewItemName(type, currentItems);
			let extension = '';

			if (type === 'Text') {
				extension = 'txt';
			}

			const item: DesktopItem = {
				left,
				renaming: true,
				selected: false,
				top,
				path: CommonFolderPaths.DESKTOP + '/' + newItemName // TODO: is that correct?
			};

			onFileChange(item);
			return [...currentItems, item];
		});
	};

	const addFolder = (top: number, left: number) => {
		setDesktopItems(currentItems => {
			const newItemName = getNewItemName('Folder', currentItems);
			const item: DesktopItem = {
				left,
				renaming: true,
				selected: false,
				top,
				path: CommonFolderPaths.DESKTOP + '/' + newItemName // TODO: is that correct?
			};

			onFolderChange(item);
			return [...currentItems, item];
		});
	};

	const onItemRenamed = (itemPath: string, itemNewName: string) => {
		setDesktopItems(currentItems => {
			if (!itemNewName || itemNewName.trim() === '') {
				return currentItems;
			}

			const isNameAlreadyUsed = currentItems.find(i => getCurrentItemNameInPath(i.path) === itemNewName && i.path !== itemPath);

			if (!isNameAlreadyUsed) {
				const updatedItems: DesktopItem[] = currentItems.map(i => ({
					...i,
					name: i.path === itemPath ? itemNewName : getCurrentItemNameInPath(i.path),
					renaming: false,
					selected: i.path === itemPath
				}));

				const newItem = updatedItems.find(i => i.path === itemPath) as DesktopItem;

				onFileChange(newItem);

				return [...updatedItems];
			}

			return currentItems;
		});
	};

	const moveItem = (
		itemPath: string,
		startItemTop: number,
		startItemLeft: number,
		newItemTop: number,
		newItemLeft: number
	) => {
		setDesktopItems(currentItems => {
			const updatedItems = moveItemsOnDesktop(
				currentItems,
				itemPath,
				startItemTop,
				startItemLeft,
				newItemTop,
				newItemLeft
			);
			return [...updatedItems];
		});
	};

	const selectItems = (...itemPaths: string[]) => {
		setDesktopItems(currentItems => {
			const updated = currentItems.map(i => ({ ...i, selected: itemPaths.includes(i.path) }));
			return [...updated];
		});
	};

	const selectItemsWithCtrl = (...itemPaths: string[]) => {
		setDesktopItems(currentItems => {
			const updatedItems = currentItems.map(i => ({
				...i,
				selected: itemPaths.includes(i.path) ? !i.selected : i.selected
			}));
			return [...updatedItems];
		});
	};

	const selectItemWithShift = (itemPath: string, ctrlKey: boolean) => {
		setDesktopItems(currentItems => {
			const clickedItem = currentItems.find(item => item.path === itemPath);

			if (!clickedItem || clickedItem.selected) {
				return currentItems;
			}

			return [...selectItemsWithShiftKey(itemPath, currentItems, ctrlKey)];
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

	const handleItemRenaming = (itemPath: string) => {
		setDesktopItems(currentItems => {
			return currentItems.map(i => ({
				...i,
				renaming: i.path === itemPath
			}));
		});
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
					handleItemRenamed={onItemRenamed}
					startRenaming={handleItemRenaming}
				/>
			))}

			<SelectionBoxComponent emitSelectedItemsUpdate={handleSelectionBoxUpdates} targetElementId='desktop' />
		</Fragment>
	);
};

export default DesktopItemContainer;
