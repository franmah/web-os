import styled from "styled-components";

export const StyledExplorerQuickAccess = styled.nav`
  padding: 8px 4px;

  .divider {
    margin: 16px 4px;
    border-bottom: 2px solid #D9D9D9;
  }
  
  /* CHANGE TO A COMMON TYPE SINCE THEY'RE ALL THE SAME */
  /* left icon, folder icon, folder name, extra icon */
  .pinned-folder {
    border: none;
    background-color: white;
    padding: 8px 4px;
    padding-left: 15%;
    margin: 4px 0px;
    user-select: none;

    display: flex;
    align-items: center;
    width: 100%;

    .left-side {
      display: flex;
      align-items: center;
      flex: 1;

      .folder-name {
      margin-left: 4px;
      flex: 0;
      }
    }

    &:hover {
      background-color: #E5F3FF;
      cursor: pointer;
    }
  }

  .focused {
    background-color: #CCE8FF;

    &:hover {
      background-color: 'CCE8FF';
    }
  }

  .blured {
    background-color: #D9D9D9;
  }
`;