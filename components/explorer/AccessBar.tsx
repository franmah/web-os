import { FC, useEffect, useRef } from 'react';
import ExplorerPathBar from './ExplorerPathBar';
import { FiArrowRight, FiArrowLeft, FiArrowUp } from 'react-icons/fi';
import { GrSearch } from 'react-icons/gr';
import { getCurrentItemNameInPath, getParentPath } from '../../services/file-system/FilePathService';
import { StyledExplorerAccessBar } from '../../styled-components/system/explorer/StyledExplorerAccessBar';

const ExplorerAccessBar: FC<{
	path: string;
	pathsFlow: string[];
	searchView: boolean;
	previousFolder: () => void;
	nextFolder: () => void;
	updatePath: (path: string) => void;
	searchFolder: (searchString: string) => void;
	refreshFileViewPaths: () => void;
}> = ({ path, pathsFlow, searchView, updatePath, previousFolder, nextFolder, searchFolder, refreshFileViewPaths }) => {
	const searchInput = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (!searchView && searchInput.current) searchInput.current.value = '';
	}, [path, searchView]);

	const handleUpdatePath = (newPath: string) => {
		if (!searchView) {
			updatePath(newPath);
		}
	};

	return (
		<StyledExplorerAccessBar
			previousArrowDisabled={pathsFlow[0] === path}
			nextArrowDisabled={pathsFlow.at(-1) === path}
			parentArrowDisabled={path === '/'}
		>
			<section className='action-section'>
				<FiArrowLeft
					size={30}
					className={`arrow-button ${pathsFlow[0] === path ? 'disabled' : 'enabled'}`}
					onClick={previousFolder}
				/>
				<FiArrowRight
					className={`arrow-button ${pathsFlow.at(-1) === path ? 'disabled' : 'enabled'}`}
					onClick={nextFolder}
				/>
				<FiArrowUp
					className={`arrow-button ${path === '/' ? 'disabled' : 'enabled'}`}
					onClick={() => updatePath(getParentPath(path))}
				/>
			</section>

			<section className='explorer-path-bar'>
				<ExplorerPathBar refreshFileViewPaths={refreshFileViewPaths} path={path} updatePath={handleUpdatePath} />
			</section>

			<section className='search-section'>
				<input
					ref={searchInput}
					placeholder={'Search ' + (getCurrentItemNameInPath(path) || 'computer')}
					onChange={e => searchFolder(e.target.value)}
				/>
				<div className='search-button'>
					<GrSearch onClick={() => searchInput.current?.focus()} />
				</div>
			</section>
		</StyledExplorerAccessBar>
	);
};

export default ExplorerAccessBar;
