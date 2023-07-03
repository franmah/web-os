import { FC, useContext } from "react";
import { getCurrentFolderOrFileNameInPath } from "../../services/file-system/FilePathService";
import { BsFillPinAngleFill } from 'react-icons/bs';
import Image from 'next/image';
import { StyledExplorerQuickAccess } from "../../styled-components/system/explorer/styled-explorer-quick-access";
import { ExplorerQuickAccessContext } from "../../contexts/explorer-quick-access-context";
import { ProcessContext } from "../../contexts/processContext";
import { UnpinFromQuickAccessCommand } from "../../System/contextMenuCommands/commands/unpinFromQuickAccessCommand";


const ExplorerFileQuickAccess: FC<{
  pinnedFolderPaths: string[],
  updatePath: (path: string) => void
}> = ({
  pinnedFolderPaths,
  updatePath
}) => {

  const { openProcess } = useContext(ProcessContext);
  const { unpinFromQuickAccess } = useContext(ExplorerQuickAccessContext);

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
        {
          pinnedFolderPaths.map(path => 
            <div
              className="pinned-folder"
              key={path}
              onDoubleClick={() => updatePath(path)}
              onContextMenu={e => handleContextMenuClick(e, path)}
            >

              <Image src='/icons/folder-icon.png' alt='folder icon' height={23} width={23} />
              <div className="folder-name">{getCurrentFolderOrFileNameInPath(path)}</div>
              <BsFillPinAngleFill color="#95A0A6" />

            </div> 
          )
        }
      </section>

      <div className="divider"></div>

    </StyledExplorerQuickAccess>
  )
}

export default ExplorerFileQuickAccess;