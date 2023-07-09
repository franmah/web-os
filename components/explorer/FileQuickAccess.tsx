import { FC, useContext, useState } from 'react';
import { getCurrentItemNameInPath } from '../../services/file-system/FilePathService';
import { BsFillPinAngleFill } from 'react-icons/bs';
import Image from 'next/image';
import { StyledExplorerQuickAccess } from '../../styled-components/system/explorer/StyledExplorerQuickAccess';
import { ExplorerQuickAccessContext } from '../../contexts/ExplorerQuickAccessContext';
import { ProcessContext } from '../../contexts/ProcessContext';
import { UnpinFromQuickAccessCommand } from '../../System/context-menu-commands/commands/UnpinFromQuickAccessCommand';
import { CommonFolderPaths } from '../../constants/system/file-system/CommonFilePaths';
import { getFolderIcon } from '../../services/IconService';

const ExplorerFileQuickAccess: FC<{
	currentPath: string;
	pinnedFolderPaths: string[];
	updatePath: (path: string) => void;
}> = ({ currentPath, pinnedFolderPaths, updatePath }) => {
	const { openProcess } = useContext(ProcessContext);
	const { unpinFromQuickAccess } = useContext(ExplorerQuickAccessContext);

	const [selectedElementFocusedOut, setSelectedElementFocusedOut] = useState<string>('');

	const handleContextMenuClick = (event: any, path: string) => {
		// TODO: check if file or folder (should be folder but still check)
		event.preventDefault();
		event.stopPropagation();

		const command = new UnpinFromQuickAccessCommand(() => unpinFromQuickAccess(path));

		openProcess('contextMenu', {
			commands: [command],
			left: event.clientX,
			top: event.clientY
		});
	};

	const getHomeButtonClassName = (): string => {
		if (currentPath === CommonFolderPaths.ROOT)
			return selectedElementFocusedOut === CommonFolderPaths.ROOT ? 'blured' : 'focused';

		return '';
	};

	const getPinnedFolderClassName = (folderPath: string): string => {
		if (folderPath !== currentPath) return '';

		return folderPath === selectedElementFocusedOut ? 'blured' : 'focused';
	};

	return (
		<StyledExplorerQuickAccess>
			<section className='pinned-folders'>
				{/* HOME BUTTON */}
				<button
					className={`pinned-folder ${getHomeButtonClassName()}`}
					key={CommonFolderPaths.ROOT}
					onClick={() => updatePath(CommonFolderPaths.ROOT)}
					onFocus={() => setSelectedElementFocusedOut('')}
					onBlur={() => setSelectedElementFocusedOut(CommonFolderPaths.ROOT)}
				>
					<div className='left-side'>
						<Image src={getFolderIcon(CommonFolderPaths.ROOT)} alt='home icon' height={23} width={23} />
						<div className='folder-name'> Home </div>
					</div>
				</button>

				<div className='divider'></div>

				{pinnedFolderPaths.map(path => (
					<button
						className={`pinned-folder ${getPinnedFolderClassName(path)}`}
						key={path}
						onClick={() => updatePath(path)}
						onContextMenu={e => handleContextMenuClick(e, path)}
						onFocus={() => setSelectedElementFocusedOut('')}
						onBlur={() => setSelectedElementFocusedOut(path)}
					>
						<div className='left-side'>
							<Image src={getFolderIcon(path)} alt='folder icon' height={18} width={18} />
							<div className='folder-name'>{getCurrentItemNameInPath(path)}</div>
						</div>

						<BsFillPinAngleFill color='#95A0A6' />
					</button>
				))}
			</section>

			<div className='divider'></div>
		</StyledExplorerQuickAccess>
	);
};

export default ExplorerFileQuickAccess;
