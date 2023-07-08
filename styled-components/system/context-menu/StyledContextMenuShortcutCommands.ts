import styled from "styled-components";

export const StyledContextMenuShortcutCommands = styled.section`
  width: 100%;
  display: flex;
  padding: .5em;

  .command {
    padding: 4px;
    margin-right: .5em;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    
    &:hover {
      background-color: #EFEFEF;
    }
  }
`;