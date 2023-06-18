import { FC, useEffect, useState } from "react";
import styled from "styled-components";
import { MdKeyboardArrowRight } from 'react-icons/md';
import { GrRefresh } from 'react-icons/gr';
import { pathToFragments } from "../../services/file-system/FilePathService";
import Image from 'next/image';

export const StyledExplorerPathBar = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  border: 2px solid #ECECEC;

  button {
    outline: none;
    background-color: white;
    border: none;
  }

  .left-icon {
    display: flex;
    align-items: center;
    margin-left: 4px;
  }

  .path-fragments-container {
    flex: 1;
    display: flex;
  }

  .path-fragment-container {
    display: flex;
    align-items: center;
    padding: 0px 4px;
    border: 1px solid transparent;

    &:hover {
      cursor: default;
      background-color: #E5F3FF;
      border: 1px solid #D8EDFF;
      user-select: none;
    }

    .arrow-icon {
      display: flex;
      margin-left: 8px;
    }
  }

  .refresh-icon {
    padding: 8px;
  }
`;

const ExplorerPathBar: FC<{ 
  path: string,
}> = ({ path = '' }) => {

const [pathFragments, setPathFragments] = useState<string[]>([]);

  useEffect(() => {
    console.log(pathToFragments(path))
    setPathFragments(pathToFragments(path));
  }, [path]);

  // TODO: move parse to fs service (findPathToFolderInPath(path: string, folderName: string))
  const onFolderClicked = (fragmentIndex: number) => {
    const pathToFolder = '/' + pathFragments.slice(0, fragmentIndex + 1).join('/') + '/';
    console.log(pathToFolder);
  }

  return (
    <StyledExplorerPathBar>

      <section className="path-fragments-container ">
        <div className="left-icon">
          <Image src='/icons/folder-icon.png' alt='folder' height={23} width={23} />
        </div>

        <button className="path-fragment-container" onClick={() => onFolderClicked(0)}>
          <MdKeyboardArrowRight />
        </button>

        {
          pathFragments
            .map((folder, index) => 
              <button className="path-fragment-container" key={folder} onClick={() => onFolderClicked(index)}>
                { folder }
                { 
                  index !== pathFragments.length - 1 ?
                    <div className="arrow-icon">
                      <MdKeyboardArrowRight />
                    </div> 
                      :
                    null 
                }
              </button>
            )
        }
      </section>

      <button className="refresh-icon path-fragment-container" onClick={() => onFolderClicked(pathFragments.length)}>
        <GrRefresh />
      </button>
    </StyledExplorerPathBar>
  );
};

export default ExplorerPathBar;
