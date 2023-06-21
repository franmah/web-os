import { FC } from "react";
import styled from "styled-components";
import { getCurrentFolderOrFileNameInPath } from "../../services/file-system/FilePathService";
import { BsFillPinAngleFill } from 'react-icons/bs';
import Image from 'next/image';

export const StyledExplorerQuickAccess = styled.nav`
  padding: 8px 4px;

  .divider {
    margin: 16px 4px;
    border-bottom: 2px solid #D9D9D9;
  }
  
  /* CHANGE TO A COMMON TYPE SINCE THEY'RE ALL THE SAME */
  /* left icon, folder icon, folder name, extra icon */
  .pinned-folder {
    padding: 8px 4px;
    padding-left: 15%;
    margin: 4px 0px;
    user-select: none;

    display: flex;
    align-items: center;

    .folder-name {
      margin-left: 4px;
      flex: 1;
    }

    &:hover {
      background-color: #D9D9D9;
      cursor: pointer;
    }
  }
`;

const ExplorerFileQuickAccess: FC<{
  pinnedFolderPaths: string[],
}> = ({
  pinnedFolderPaths
}) => {
  return (
    <StyledExplorerQuickAccess>

      <section className="pinned-folders">
        {
          pinnedFolderPaths.map(path => 
            <div className="pinned-folder" key={path}>
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