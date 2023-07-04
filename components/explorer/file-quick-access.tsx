import { FC, useContext, useState } from "react";
import { getCurrentItemNameInPath } from "../../services/file-system/FilePathService";
import { BsFillPinAngleFill } from 'react-icons/bs';
import Image from 'next/image';
import { StyledExplorerQuickAccess } from "../../styled-components/system/explorer/styled-explorer-quick-access";
import { ExplorerQuickAccessContext } from "../../contexts/explorer-quick-access-context";
import { ProcessContext } from "../../contexts/processContext";
import { UnpinFromQuickAccessCommand } from "../../System/contextMenuCommands/commands/unpinFromQuickAccessCommand";
import { CommonFolderPaths } from "../../constants/system/file-system/CommonFilePaths";
import { getFolderIcon } from "../../services/icon-service";


const ExplorerFileQuickAccess: FC<{
  currentPath: string,
  pinnedFolderPaths: string[],
  updatePath: (path: string) => void
}> = ({
  currentPath,
  pinnedFolderPaths,
  updatePath
}) => {

  const { openProcess } = useContext(ProcessContext);
  const { unpinFromQuickAccess } = useContext(ExplorerQuickAccessContext);

  const [selectedElementFocusedOut, setSelectedElementFocusedOut] = useState<string>('');

  const handleContextMenuClick = (event: any, path: string) => {
    // TODO: check if file or folder (should be folder but still check)
    event.preventDefault();
    event.stopPropagation();

    const command = new UnpinFromQuickAccessCommand(() => unpinFromQuickAccess(path));

    openProcess('contextMenu', {
      top: event.clientY,
      left: event.clientX,
      commands: [command]
    });
  };

  return (
    <StyledExplorerQuickAccess>

      <section className="pinned-folders">

        {/* HOME BUTTON */}
        <button
          className={`pinned-folder ${
            currentPath === CommonFolderPaths.ROOT ? 
              selectedElementFocusedOut === '/' ? 'blured' : 'focused' : ''
            }`
          }
          key={CommonFolderPaths.ROOT}
          onClick={() => updatePath(CommonFolderPaths.ROOT)}
          onContextMenu={e => handleContextMenuClick(e, CommonFolderPaths.ROOT)}
          onFocus={() => setSelectedElementFocusedOut('')}
          onBlur={() => setSelectedElementFocusedOut(CommonFolderPaths.ROOT)}
        >
          <div className="left-side">
            <Image src={getFolderIcon(CommonFolderPaths.ROOT)} alt='home icon' height={23} width={23} />
            <div className="folder-name"> Home </div>
          </div>
        </button> 

        <div className="divider"></div>

        {
          pinnedFolderPaths.map(path => 
            <button
              className={`pinned-folder ${path === currentPath ? selectedElementFocusedOut === path ? 'blured' : 'focused' : ''}`}
              key={path}
              onClick={() => updatePath(path)}
              onContextMenu={e => handleContextMenuClick(e, path)}
              onFocus={() => setSelectedElementFocusedOut('')}
              onBlur={() => setSelectedElementFocusedOut(path)}
            >
              <div className="left-side">
                <Image src={getFolderIcon(path)} alt='folder icon' height={18} width={18} />
                <div className="folder-name">{getCurrentItemNameInPath(path)}</div>
              </div>

              <BsFillPinAngleFill color="#95A0A6" />

            </button> 
          )
        }
      </section>

      <div className="divider"></div>

    </StyledExplorerQuickAccess>
  )
}

export default ExplorerFileQuickAccess;