import { FC } from "react";
import styled from "styled-components";
import ExplorerPathBar from "./explorer-path-bar";

export const StyledExplorerAccessBar = styled.nav`
  display: flex;
  height: 42px;

  .action-section {
    display: flex;
  }

  .explorer-path-bar {
    flex: 1;
  }
`;

const ExplorerAccessBar: FC<{ path: string }> = ({ path }) => {

  return (
    <StyledExplorerAccessBar>
      <section className="action-section">
        <div>PREV</div>
        <div>Next</div>
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