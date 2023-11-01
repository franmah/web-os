import { FC, useEffect, useState } from 'react';
import { ExplorerFileViewHeader } from './FileViewHeader';
import { ExplorerFileViewRow } from './FileViewRow';
import { isEventOriginatedFromWithinTargetIdSubtree } from '../../../services/EventService';
import { StyledExplorerFileViewContainer } from '../../../styled-components/system/explorer/StyledFileViewContainer';
import {
	ExplorerFileViewSortDirections,
	ExplorerFileViewSortFields,
	START_COLUMN_SIZES
} from '../../../constants/system/explorer/Explorer';

export const FILE_VIEW_CONTAINER_ROWS_HTML_ID = 'file-view-container-rows';

const ExplorerFileViewContainer: FC<{
	paths: string[];
	openFile: (path: string) => void;
	updateNumSelectedItems: (number: number) => void;
	onRenameItem: (path: string, newName: string) => Promise<void>;
	onDeleteItems: (...path: string[]) => void;
}> = ({ paths, openFile, updateNumSelectedItems, onRenameItem, onDeleteItems }) => {

	const [sort, setSorting] = useState<{
		column: ExplorerFileViewSortFields;
		direction: ExplorerFileViewSortDirections;
	}>({ column: ExplorerFileViewSortFields.NAME, direction: ExplorerFileViewSortDirections.ASC });

	const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
	const [lastSelectedFilePath, setLastFileSelected] = useState<string | null>(null); // Last file selected with left click and no ctrl key. (Used for shift select)

	useEffect(() => {
		setSelectedChildren([]);
		updateNumSelectedItems(0);
	}, [paths]);

	useEffect(() => {
		const deleteSelectedItems = (e: any) => {
			const DELETE_KEY_CODE = 46;
			if (e.which === DELETE_KEY_CODE || e.key === 'Delete') {
				onDeleteItems(...selectedChildren);
			}
		};

		document.addEventListener('keydown', deleteSelectedItems);

		return () => {
			document.removeEventListener('keydown', deleteSelectedItems);
		};
	}, [selectedChildren]);

	useEffect(() => {
		const handleUnselectOnClick = (event: MouseEvent) => {
			if (!isEventOriginatedFromWithinTargetIdSubtree(event, FILE_VIEW_CONTAINER_ROWS_HTML_ID)) {
				handleSelectAllChildren(false);
			}
		};

		document.addEventListener('click', handleUnselectOnClick);
		() => {
			document.removeEventListener('click', handleUnselectOnClick);
		};
	}, [paths]);

	const handleFileSelected = (path: string, selected: boolean, unselectAll = false) => {
		if (unselectAll) {
			setLastFileSelected(path);
			handleSelectAllChildren(false);
		}

		setSelectedChildren(currentlySelectedChildren => {
			if (selected) {
				updateNumSelectedItems(currentlySelectedChildren.length + 1);
				return [...currentlySelectedChildren, path];
			} else {
				const selectedChildren = [...currentlySelectedChildren].filter(c => c !== path);
				updateNumSelectedItems(selectedChildren.length);
				return selectedChildren;
			}
		});
	};

	const handleSelectAllChildren = (selected: boolean) => {
		if (selected) {
			setSelectedChildren(paths);
			updateNumSelectedItems(paths.length);
		} else {
			setSelectedChildren([]);
			updateNumSelectedItems(0);
		}
	};

	const handleShiftFileSelect = (path: string) => {
		try {
			setSelectedChildren(selectedPaths => {
				const lastSelectedFile = lastSelectedFilePath || paths?.[0];
				const lastSelectedFilePosition = paths.findIndex(p => p === lastSelectedFile);
				const selectedFilePosition = paths.findIndex(p => p === path);

				for (const p of paths) {
					const isTrue = p === path;
				}

				return [...paths.filter((path, index) =>
					Math.min(lastSelectedFilePosition, selectedFilePosition) <= index &&
					index <= Math.max(lastSelectedFilePosition, selectedFilePosition)
				)];
			});
		} catch (error) {
			console.error('Error selecting files with shift.', error);
		}
	};

	const handleSortChildren = (column: ExplorerFileViewSortFields, direction: ExplorerFileViewSortDirections) => {
		setSorting({
			column,
			direction
		});
	};

	const sortFn = (child1: string, child2: string) => {
		const leftOperand = sort.direction === ExplorerFileViewSortDirections.ASC ? 1 : -1;
		const rightOperand = sort.direction === ExplorerFileViewSortDirections.ASC ? -1 : 1;

		switch (sort.column) {
			case ExplorerFileViewSortFields.NAME:
				return child1 > child2 ? leftOperand : rightOperand;
			default:
				return 0;
		}
	};

	return (
		<StyledExplorerFileViewContainer>
			{paths.length > 0 ? (
				<ExplorerFileViewHeader
					columnSizes={START_COLUMN_SIZES}
					allFilesChecked={selectedChildren.length === paths.length && paths.length > 0}
					sortColumn={sort.column}
					sortDirection={sort.direction}
					onSelectAllChildren={handleSelectAllChildren}
					onSort={handleSortChildren}
				/>
			) : null}

			{paths.length === 0 ? <div className='empty-folder-text'>This folder is empty.</div> : null}

			<div id={FILE_VIEW_CONTAINER_ROWS_HTML_ID}>
				{paths?.sort(sortFn)?.map(child => {
					const isSelected = !!selectedChildren.find(c => c === child);
					return (
						<ExplorerFileViewRow
							columnSizes={START_COLUMN_SIZES}
							key={'file_view_container_' + child}
							isSelected={isSelected}
							path={child}
							onFileSelected={handleFileSelected}
							onShiftFileSelected={handleShiftFileSelect}
							openFile={openFile}
							onRenameItem={onRenameItem}
							onDeleteItem={onDeleteItems}
						/>
					);
				})}
			</div>
		</StyledExplorerFileViewContainer>
	);
};

export default ExplorerFileViewContainer;
