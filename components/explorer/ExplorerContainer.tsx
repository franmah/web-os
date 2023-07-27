import { FC, useContext, useEffect, useState } from 'react';
import ExplorerAccessBar from './AccessBar';
import ExplorerFileQuickAccess from './FileQuickAccess';
import ExplorerFileViewContainer from './file-view/FileViewContainer';
import { FileSystemContext } from '../../contexts/FileSystemContext';
import { StyledExplorerContainer } from '../../styled-components/system/explorer/StyldExplorerContainer';
import {
	convertPathToFragments,
	getParentPath,
	isNewItemNameValid,
	removeDoubleSlashes
} from '../../services/file-system/FilePathService';
import { ExplorerQuickAccessContext } from '../../contexts/ExplorerQuickAccessContext';
import { CommonFolderPaths } from '../../constants/system/file-system/CommonFilePaths';
import { ProcessContext } from '../../contexts/ProcessContext';
import { AnalyticEvents } from '../../constants/AnalyticEvents';
import { saveAnalyticsEvent } from '../../services/AnalyticsService';

const ExplorerContainer: FC<{ params: { startPath: string } }> = ({ params: { startPath } }) => {
	const fs = useContext(FileSystemContext);
	const quickAccessContext = useContext(ExplorerQuickAccessContext);
	const processContext = useContext(ProcessContext);

	const [pathsFlow, setPathsFlow] = useState<string[]>([startPath]);
	const [path, setPath] = useState<string>(startPath || '');
	const [fileViewPaths, setFileViewPaths] = useState<string[]>([]);
	const [useSearchView, setUseSearchView] = useState<boolean>(false);
	const [numItemsSelected, setNumItemsSelected] = useState<number>(0);

	useEffect(() => {
		resetFileViewPathsToCurrentPath();
	}, [fs, path]);

	const resetFileViewPathsToCurrentPath = () => {
		fs.readdirV2(path)
			.then(files =>
				setFileViewPaths(
					files?.map(child => (path === CommonFolderPaths.ROOT ? path + child : path + '/' + child)) || []
				)
			)
			.catch(error => {
				console.error('Error reading files: ' + error);
				setPath(CommonFolderPaths.ROOT);
			});
	};

	const openFile = (filePath: string) => {
		// TODO: fix newPath starting with // sometimes (following code removes the extra /)
		filePath = removeDoubleSlashes(filePath);

		if (!fs.isDirectory(filePath)) {
			return processContext.openFile(filePath);
		}

		setUseSearchView(false);
		resetFileViewPathsToCurrentPath();

		const currentPathIndexInFlow = pathsFlow.findIndex(p => p === filePath);
		setPathsFlow(flow => [...flow.slice(0, currentPathIndexInFlow + 1), filePath]);
		setPath(filePath);
	};

	const previousFolder = () => {
		if (useSearchView) return;

		const currentPathIndexInFlow = pathsFlow.findIndex(p => p === path);
		if (currentPathIndexInFlow - 1 >= 0) setPath(pathsFlow[currentPathIndexInFlow - 1]);
	};

	const nextFolder = () => {
		if (useSearchView) return;

		const currentPathIndexInFlow = pathsFlow.findIndex(p => p === path);
		if (currentPathIndexInFlow + 1 < pathsFlow.length) setPath(pathsFlow[currentPathIndexInFlow + 1]);
	};

	const searchFolder = (searchString: string) => {
		if (!searchString || searchString.length === 0) {
			resetFileViewPathsToCurrentPath();
			setUseSearchView(false);
			return;
		}

		setUseSearchView(true);
		fs.searchFolderV2(path, searchString).then(paths => setFileViewPaths(paths));
	};

	// TODO: once file tree updates automatically: move it back to file-view-row
	const handleRenameItem = (path: string, newName: string): Promise<void> => {
		const newPath = getParentPath(path) + '/' + newName;
		if (!isNewItemNameValid(path, newPath, fs.isDirectory(path))) return Promise.reject();

		return fs.renameFolderV2(path, newName).then(() => {
			// TODO: once file tree updates automatically.
			setFileViewPaths(paths => {
				const fragments = convertPathToFragments(path);
				fragments[fragments.length - 1] = newName;
				const updatedPath = '/' + fragments.join('/');
				paths = paths.map(p => (p === path ? updatedPath : p));
				return [...paths];
			});

			return Promise.resolve();
		});
	};

	const handleDeleteItems = (...pathsToDelete: string[]) => {
		saveAnalyticsEvent(AnalyticEvents.DELETE_FILE, { app: 'desktop', paths: JSON.stringify(pathsToDelete) });
		for (const path of pathsToDelete) {
			fs.deleteFolderV2(path).then(() => quickAccessContext.unpinFromQuickAccess(path));
		}
	};

	return (
		<StyledExplorerContainer>
			<ExplorerAccessBar
				path={useSearchView ? `Search Results in ${convertPathToFragments(path).at(-1)}` : path}
				pathsFlow={pathsFlow}
				updatePath={openFile}
				nextFolder={nextFolder}
				previousFolder={previousFolder}
				searchFolder={searchFolder}
				searchView={useSearchView}
				refreshFileViewPaths={resetFileViewPathsToCurrentPath}
			/>

			<section className='main-content'>
				<div className='quick-access'>
					<ExplorerFileQuickAccess
						currentPath={path}
						pinnedFolderPaths={quickAccessContext.getQuickAccessPaths()}
						updatePath={openFile}
					/>
				</div>

				<div className='divider'></div>

				<div className='file-view'>
					<ExplorerFileViewContainer
						onRenameItem={handleRenameItem}
						openFile={openFile}
						updateNumSelectedItems={setNumItemsSelected}
						paths={fileViewPaths}
						onDeleteItems={handleDeleteItems}
					/>
				</div>
			</section>

			<footer className='container-footer'>
				<span>{fileViewPaths.length ? `${fileViewPaths.length} items` : null}</span>
				<span>{numItemsSelected > 0 ? `${numItemsSelected} items selected` : null}</span>
			</footer>
		</StyledExplorerContainer>
	);
};

export default ExplorerContainer;
