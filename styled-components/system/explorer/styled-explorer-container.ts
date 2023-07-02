import styled from "styled-components";

export const StyledExplorerContainer = styled.div`
  background-color: white;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .main-content {
    display: flex;
    width: 100%;
    height: 100%;

    .quick-access {
      min-width: 200px;
    }

    .divider {
      border-left: 1px solid #F7F7F7;
    }

    .file-view {
      flex: 1;
    }
  }

  .container-footer {
    padding-left: 8px;
    width: 100%;
    user-select: none;
  }
`;
