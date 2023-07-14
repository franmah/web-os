import Image from 'next/image';
import { FC, useEffect, useRef, useState } from 'react';
import styles from './desktop-item.module.scss';
import globalStyles from '../../../styles/global.module.scss';
import { DesktopItem } from '../../../types/desktop/DesktopItem';
import { ITEM_HEIGHT, ITEM_WIDTH, SHORTENED_NAME_LENGTH } from '../../../constants/Desktop';
import { getCurrentItemNameInPath } from '../../../services/file-system/FilePathService';

const DesktopItemComponent: FC<{
	item: DesktopItem;
	moveItem: (itemId: string, startItemTop: number, startItemLeft: number, newItemTop: number, newItemLeft: number) => void;
	selectItems: (...ids: string[]) => void;
	selectItemsWithCtrl: (...ids: string[]) => void;
	selectItemsWithShift: (id: string, ctrlKey: boolean) => void;
	handleDoubleClick: (item: DesktopItem) => void;
	handleContextMenuClick: (event: MouseEvent) => void;
	onItemRename: (itemPath: string, itemNewName: string) => void;
}> = ({
	item,
	moveItem,
	selectItems,
	selectItemsWithCtrl,
	selectItemsWithShift,
	handleDoubleClick,
	handleContextMenuClick,
	onItemRename
}) => {

	const [inputNameValue, setInputNameValue] = useState<string>(getCurrentItemNameInPath(item.path));
	const [renaming, setRenaming] = useState<boolean>(false);

	const INPUT_ID = item.id + '_input';
	const TEXT_ID = item.id + '_text';

	const distanceMouseToItemTopRef = useRef(0);
	const distanceMouseToItemLeftRef = useRef(0);

	useEffect(() => {
		const renameItem = (event: KeyboardEvent) => {
			if (event.key === 'Enter')
				onItemDoneRenaming();
		};

		if (renaming) {
			const textAreaElement = document.getElementById(INPUT_ID);
			document.addEventListener('mousedown', onMouseDown);
			document.addEventListener('keyup', renameItem);
			resizeTextArea(textAreaElement);
		}

		return () => {
			if (renaming) {
				document.removeEventListener('mousedown', onMouseDown);
				document.removeEventListener('keyup', renameItem);
			}
		};
	});

	const onDoubleClick = () => {
		handleDoubleClick(item);
	};

	const onClick = (event: any) => {
		if (event.shiftKey) {
			selectItemsWithShift(item.id, event.ctrlKey);
		} else if (event.ctrlKey) {
			selectItemsWithCtrl(item.id);
		} else {
			selectItems(item.id);
		}
	};

	const onDragEnd = (event: any) => {
		const { top, left } = getDestopItemNewPositionRelativeToMouse(
			event,
			distanceMouseToItemTopRef.current,
			distanceMouseToItemLeftRef.current
		);
		moveItem(item.id, item.top, item.left, top, left);
	};

	const onDragStart = (event: any) => {
		distanceMouseToItemTopRef.current = event.clientY - item.top;
		distanceMouseToItemLeftRef.current = event.clientX - item.left;

		if (!item.selected) {
			selectItems(item.id);
		}
	};

	const onContextMenuClick = (event: MouseEvent) => {
		event.preventDefault();
		handleContextMenuClick(event);
	};

	const onMouseDown = (event: any) => {
		if (event?.target?.id !== INPUT_ID && event?.target?.id !== TEXT_ID) {
			onItemDoneRenaming();
		}
	};

	const onItemDoneRenaming = () => {
		if (inputNameValue && inputNameValue.trim() !== '') {
			setRenaming(false);
			onItemRename(item.id, inputNameValue.trim());
		}
	};

	const formatItemName = (): string => {
		const name = getCurrentItemNameInPath(item.path);
		if (item.selected || name.length <= SHORTENED_NAME_LENGTH) {
			return name;
		}

		const shortenedName = name.substring(0, SHORTENED_NAME_LENGTH);
		return shortenedName + '...';
	};

	const onItemNameClick = () => {
		if (item.selected) {
			setRenaming(true);
		}
	};

	const getDestopItemNewPositionRelativeToMouse = (
		event: any,
		mouseToElementTopOffset: number,
		mouseToElementLeftOffset: number
	) => {
		return {
			left: +event.clientX - mouseToElementLeftOffset,
			top: +event.clientY - mouseToElementTopOffset
		};
	};

	const getClass = () => {
		const selectionClass = item.selected ? styles.dekstopItemSelected : styles.dekstopItemNotSelected;
		return styles.desktopItem + ' ' + globalStyles.unselectableText + ' ' + selectionClass;
	};

	const onTextareaChange = (event: any) => {
		setInputNameValue(() => event?.target?.value);
		resizeTextArea();
	};

	const resizeTextArea = (textAreaElement?: HTMLElement | null) => {
		if (textAreaElement) {
			textAreaElement.style.height = textAreaElement.scrollHeight + 'px';
		}
	};

	return (
		<div
			id={item.id}
			draggable={!renaming}
			className={getClass()}
			onDragEnd={onDragEnd}
			onClick={onClick}
			onDragStart={onDragStart}
			onDoubleClick={onDoubleClick}
			style={{
				left: item.left,
				minHeight: ITEM_HEIGHT,
				top: item.top,
				width: ITEM_WIDTH
			}}
		>
			<Image src={item.iconPath} alt={'icon'} width={48} height={40} />

			{renaming ? (
				<textarea
					id={INPUT_ID}
					autoFocus
					onFocus={event => event?.target?.select()}
					value={inputNameValue}
					onChange={onTextareaChange}
				></textarea>
			) : (
				<div id={TEXT_ID} onClick={onItemNameClick}>
					{formatItemName()}
				</div>
			)}
		</div>
	);
};

export default DesktopItemComponent;
