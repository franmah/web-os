import { FC } from "react";
import styled from "styled-components";
import ExplorerPathBar from "./explorer-path-bar";
import { FiArrowRight, FiArrowLeft, FiArrowUp } from 'react-icons/fi';
import { GrSearch } from 'react-icons/gr';

export const StyledExplorerAccessBar = styled.nav`
  display: flex;
  height: 42px;
  margin: 6px 8px;

  .action-section {
    display: flex;
    align-items: center;

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

  .search-section {
    min-width: 300px;
    margin-left: 8px;
    display: flex;
    align-items: center;
    border: 2px solid #ECECEC;
    padding: 0px 4px;

    input {
      border: none;
      width: 100%;
      height: 100%;
    }

    div {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      padding: 0px 8px;
      transform: rotate(90deg);
    }
  }
`;

const ExplorerAccessBar: FC<{ path: string }> = ({ path }) => {

  return (
    <StyledExplorerAccessBar>
      <section className="action-section">
        <FiArrowLeft className="arrow-button" color='#6A6A6A' />
        <FiArrowRight className="arrow-button" color='#6A6A6A' />
        <FiArrowUp className="arrow-button" color={ path === '/' ? "#A3A3A3" : '#6A6A6A'} />
      </section>

      <section className='explorer-path-bar'>
        <ExplorerPathBar
          path={path}
        />
      </section>
      
      <section className="search-section">
        <input placeholder="Search Program Files" />
        <div>
          <GrSearch />
        </div>
      </section>
    </StyledExplorerAccessBar>
  );
};

export default ExplorerAccessBar;