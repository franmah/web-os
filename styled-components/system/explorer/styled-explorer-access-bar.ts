import styled from "styled-components";

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
      margin-right: 8px;
      
      &:hover {
        cursor: default;
        background-color: #E5F3FF;
        border: 1px solid #D8EDFF;
        user-select: none;
      }
    }
  }

  .explorer-path-bar {
    flex: 3;
  }

  .search-section {
    flex: 1;
    margin-left: 8px;
    display: flex;
    align-items: center;
    border: 2px solid #ECECEC;
    padding: 0px 4px;

    input {
      border: none;
      width: 100%;
      height: 100%;

      &:focus {
        outline: none;
      }
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