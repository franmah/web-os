import styled from "styled-components";

export const StyledHeaderInformationH1 = styled.h1<{ focused: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  min-width: 50px;
  font-size: small;
  overflow: hidden;
  white-space: nowrap;
  font-size: 12;
  font-weight: normal;
  color: ${({ focused }) => focused ? 'black' : 'rgb(121, 118, 118);' }; 
`;
