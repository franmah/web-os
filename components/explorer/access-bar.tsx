import { FC } from "react";
import ExplorerPathBar from "./explorer-path-bar";
import { FiArrowRight, FiArrowLeft, FiArrowUp } from 'react-icons/fi';
import { GrSearch } from 'react-icons/gr';
import { getCurrentFolderOrFileNameInPath, getParentPath } from "../../services/file-system/FilePathService";
import { StyledExplorerAccessBar } from "../../styled-components/system/explorer/styled-explorer-access-bar";

const ExplorerAccessBar: FC<{
  path: string,
  pathsFlow: string[],
  previousFolder: () => void,
  nextFolder: () => void,
  updatePath: (path: string) => void
}> = ({ path, pathsFlow, updatePath, previousFolder, nextFolder}) => {

  return (
    <StyledExplorerAccessBar
      previousArrowDisabled={pathsFlow[0] === path}
      nextArrowDisabled={pathsFlow.at(-1) === path}
      parentArrowDisabled={path === '/'}
    >
      <section className="action-section">
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