import { FC } from "react";
import ExplorerPathBar from "./explorer-path-bar";
import { FiArrowRight, FiArrowLeft, FiArrowUp } from 'react-icons/fi';
import { GrSearch } from 'react-icons/gr';
import { getCurrentFolderOrFileNameInPath } from "../../services/file-system/FilePathService";
import { StyledExplorerAccessBar } from "../../styled-components/system/explorer/styled-explorer-access-bar";


const ExplorerAccessBar: FC<{
  path: string,
  pathsFlow: string[],
  previousFolder: () => void,
  nextFolder: () => void,
  updatePath: (path: string) => void
}> = ({ path, pathsFlow, updatePath, previousFolder, nextFolder}) => {

  return (
    <StyledExplorerAccessBar>
      <section className="action-section">
        <FiArrowLeft
          size={30}
          className="arrow-button"
          color={ pathsFlow[0] === path ? '#6a6a6a39' : '#6A6A6A' }
          onClick={previousFolder}
        />
        <FiArrowRight
          className="arrow-button"
          color={ pathsFlow.at(-1) === path ? '#6a6a6a39' : '#6A6A6A' }
          onClick={nextFolder}
        />
        <FiArrowUp className="arrow-button" color={ path === '/' ? "#A3A3A3" : '#6A6A6A'}  />
      </section>

      <section className='explorer-path-bar'>
        <ExplorerPathBar
          path={path}
          updatePath={updatePath}
        />
      </section>
      
      <section className="search-section">
        <input placeholder={'Search ' + getCurrentFolderOrFileNameInPath(path)} />
        <div>
          <GrSearch />
        </div>
      </section>
    </StyledExplorerAccessBar>
  );
};

export default ExplorerAccessBar;