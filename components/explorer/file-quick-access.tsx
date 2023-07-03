import { FC } from "react";
import { getCurrentFolderOrFileNameInPath } from "../../services/file-system/FilePathService";
import { BsFillPinAngleFill } from 'react-icons/bs';
import Image from 'next/image';
import { StyledExplorerQuickAccess } from "../../styled-components/system/explorer/styled-explorer-quick-access";

const ExplorerFileQuickAccess: FC<{
  pinnedFolderPaths: string[],
  updatePath: (path: string) => void
}> = ({
  pinnedFolderPaths,
  updatePath
}) => {
  return (
    <StyledExplorerQuickAccess>

      <section className="pinned-folders">
        {
          pinnedFolderPaths.map(path => 
            <div className="pinned-folder" key={path} onDoubleClick={() => updatePath(path)}>
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