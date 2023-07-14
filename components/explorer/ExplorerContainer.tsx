import { FC, useContext, useEffect, useState } from 'react';
import ExplorerAccessBar from './AccessBar';
import ExplorerFileQuickAccess from './FileQuickAccess';
import ExplorerFileViewContainer from './file-view/FileViewContainer';
import { FileSystemContext } from '../../contexts/FileSystemContext';
import { StyledExplorerContainer } from '../../styled-components/system/explorer/StyldExplorerContainer';
import {
	convertPathToFragments,
	getCurrentItemNameInPath,
	getFileExtension
} from '../../services/file-system/FilePathService';
import { ExplorerQuickAccessContext } from '../../contexts/ExplorerQuickAccessContext';
import { CommonFolderPaths } from '../../constants/system/file-system/CommonFilePaths';
import { ProcessContext } from '../../contexts/ProcessContext';
import { ProcessDirectoryByExtension } from '../../System/process/ProcessDirectoryByExtension';

const ExplorerContainer: FC<{ params: { startPath: string } }> = ({ params: { startPath } }) => {
	const fs = useContext(FileSystemContext);
	const quickAccessContext = useContext(ExplorerQuickAccessContext);
	const { openProcess } = useContext(ProcessContext);

	const [pathsFlow, setPathsFlow] = useState<string[]>([startPath]);
	const [path, setPath] = useState<string>(startPath);
	const [fileViewPaths, setFileViewPaths] = useState<string[]>([]);
	const [useSearchView, setUseSearchView] = useState<boolean>(false);
	const [numItemsSelected, setNumItemsSelected] = useState<number>(0);

	useEffect(() => {
		resetFileViewPathsToCurrentPath();
	}, [path]);

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

	const openFile = (newPath: string) => {
		// TODO: fix newPath starting with // sometimes (following code removes the extra /)
		if (newPath[1] === '/') newPath = '/' + newPath.substring(2, newPath.length);

		if (!fs.isDirectory(newPath)) {
			const extension = getFileExtension(getCurrentItemNameInPath(newPath));
			return openProcess(ProcessDirectoryByExtension[extension]);
		}

		setUseSearchView(false);
		resetFileViewPathsToCurrentPath();

		const currentPathIndexInFlow = pathsFlow.findIndex(p => p === path);
		setPathsFlow(flow => [...flow.slice(0, currentPathIndexInFlow + 1), newPath]);
		setPath(newPath);
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
		return fs.renameFolderV2(path, newName).then(() => {
			// TODO: remove one file tree updates automatically.
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

	const handleDeleteItem = (pathToDelete: string) => {
		fs.deleteFolderV2(pathToDelete)
			.then(() => quickAccessContext.unpinFromQuickAccess(pathToDelete))
			.then(() => resetFileViewPathsToCurrentPath());
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
						onDeleteItem={handleDeleteItem}
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
