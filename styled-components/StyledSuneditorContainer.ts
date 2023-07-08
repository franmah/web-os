import styled from "styled-components";

export const StyledSunEditorContainer = styled.div`

  width: 100%;
  height: 100%;
  background-color: white;
  overflow: scroll;

  // Make suneditor toolbar buttons smaller 
  .se-toolbar li button {
      width: 20px;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
  }
`;
