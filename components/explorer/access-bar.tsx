import { FC, useContext, useEffect } from "react";
import styled from "styled-components";
import ExplorerPathBar from "./explorer-path-bar";
import { FiArrowRight, FiArrowLeft, FiArrowUp } from 'react-icons/fi';
import { FileSystemContext } from "../../contexts/FileSystemContext";

export const StyledExplorerAccessBar = styled.nav`
  display: flex;
  height: 42px;

  .action-section {
    display: flex;
    align-items: center;
    padding: 8px;

    .arrow-button {
      width: 100%;
      height: 100%;
      padding: 0px 8px;
      border: 1px solid transparent;
      border-radius: 3px;
      
      &:hover {
        cursor: default;
        background-color: #E5F3FF;
        border: 1px solid #D8EDFF;
        user-select: none;
      }
    }
  }

  .explorer-path-bar {
    flex: 1;
  }
`;

const ExplorerAccessBar: FC<{ path: string }> = ({ path }) => {

  const { readdirV2 } = useContext(FileSystemContext);

  useEffect(() => {
    readdirV2(path).then(files => console.log(files)).catch(error => console.log(error));
  }, [path])

  return (
    <StyledExplorerAccessBar>
      <section className="action-section">
        <FiArrowLeft className="arrow-button" />
        <FiArrowRight className="arrow-button" />
        <FiArrowUp className="arrow-button" />
      </section>

      <section className='explorer-path-bar'>
        <ExplorerPathBar
          path={path} 
        />
      </section>
      
      <section>
        Search
      </section>
    </StyledExplorerAccessBar>
  );
};

export default ExplorerAccessBar;