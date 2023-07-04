import { FC, useEffect, useState } from "react";
import { MdKeyboardArrowRight } from 'react-icons/md';
import { GrRefresh } from 'react-icons/gr';
import { convertPathToFragments } from "../../services/file-system/FilePathService";
import Image from 'next/image';
import { StyledExplorerPathBar } from "../../styled-components/system/explorer/styled-explorer-path-bar";
import { CommonFolderPaths } from "../../constants/system/file-system/CommonFilePaths";

const ExplorerPathBar: FC<{ 
  path: string,
  updatePath: (path: string) => void
}> = ({ path = '', updatePath }) => {

const [pathFragments, setPathFragments] = useState<string[]>([]);

  useEffect(() => {
    setPathFragments(convertPathToFragments(path));
  }, [path]);

  // TODO: move parse to fs service (findPathToFolderInPath(path: string, folderName: string))
  const onFolderClicked = (fragmentIndex: number) => {
    const pathToFolder = '/' + pathFragments.slice(0, fragmentIndex + 1).join('/') + '/';
    updatePath(pathToFolder);
  }

  const getLeftIcon = (): string => {
    switch (path) {
      case CommonFolderPaths.ROOT:
        return '/icons/win11_home.png'
      default:
        return '/icons/folder-icon.png'
    }
  }

  return (
    <StyledExplorerPathBar>

      <section className="path-fragments-container ">
        <div className="left-icon">
          <Image src={getLeftIcon()} alt='folder' height={23} width={23} />
        </div>

        <button className="path-fragment-container">
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
