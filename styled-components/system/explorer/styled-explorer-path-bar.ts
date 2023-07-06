import styled from "styled-components";

export const StyledExplorerPathBar = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  border: 1px solid #D9D9D9;

  button {
    outline: none;
    background-color: white;
    border: none;
  }

  .left-icon {
    display: flex;
    align-items: center;
    margin-left: 4px;
    user-select: none;
  }

  .path-fragments-container {
    flex: 1;
    display: flex;
  }

  .path-fragment-container {
    font-size: 12px;
    display: flex;
    align-items: center;
    padding: 0px 4px;
    border: 1px solid transparent;

    &:hover {
      cursor: default;
      background-color: #E5F3FF;
      border: 1px solid #D8EDFF;
      user-select: none;
    }

    .arrow-icon {
      display: flex;
      margin-left: 8px;
    }
  }

  .refresh-icon {
    padding: 8px;
  }
`;