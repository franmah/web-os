import { FC } from "react";
import styled from "styled-components";
import ExplorerPathBar from "./explorer-path-bar";
import { FiArrowRight, FiArrowLeft, FiArrowUp } from 'react-icons/fi';

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
      
      <section>
        Search
      </section>
    </StyledExplorerAccessBar>
  );
};

export default ExplorerAccessBar;