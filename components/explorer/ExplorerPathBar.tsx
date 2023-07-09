import { FC, useEffect, useState } from 'react';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { GrRefresh } from 'react-icons/gr';
import { convertPathToFragments } from '../../services/file-system/FilePathService';
import Image from 'next/image';
import { StyledExplorerPathBar } from '../../styled-components/system/explorer/StyledExplorerPathBar';
import { getFolderIcon } from '../../services/IconService';

const ExplorerPathBar: FC<{
  path: string,
  updatePath: (path: string) => void,
  refreshFileViewPaths: () => void
}> = ({ path = '', updatePath, refreshFileViewPaths }) => {

const [pathFragments, setPathFragments] = useState<string[]>([]);

  useEffect(() => {
    setPathFragments(convertPathToFragments(path));
  }, [path]);

  // TODO: move parse to fs service (findPathToFolderInPath(path: string, folderName: string))
  const onFolderClicked = (fragmentIndex: number) => {
    const pathToFolder = '/' + pathFragments.slice(0, fragmentIndex + 1).join('/') + '/';
    updatePath(pathToFolder);
  };

  return (
    <StyledExplorerPathBar>

      <section className="path-fragments-container ">
        <div className="left-icon">
          <Image src={getFolderIcon(path)} alt='folder' height={18} width={18} />
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
        <GrRefresh onClick={refreshFileViewPaths}/>
      </button>

    </StyledExplorerPathBar>
  );
};

export default ExplorerPathBar;