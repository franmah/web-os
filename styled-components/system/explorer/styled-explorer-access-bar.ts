import styled from "styled-components";

export const StyledExplorerAccessBar = styled.nav<{
  previousArrowDisabled: boolean,
  nextArrowDisabled: boolean,
  parentArrowDisabled: boolean
}>`
  display: flex;
  height: 28px;
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
      user-select: none;
    }

    .enabled {
      color: #6A6A6A;

      &:hover {
        cursor: default;
        background-color: #E5F3FF;
        border: 1px solid #D8EDFF;
      }
    }

    .disabled {
      color: #6A6A6A39;
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
    border: 1px solid #D9D9D9;
    padding: 0px 4px;

    input {
      border: none;
      width: 100%;
      height: 100%;

      &:focus {
        outline: none;
      }
    }

    .search-button {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      padding: 0px 8px;
      transform: rotate(90deg);
    }
  }
`;