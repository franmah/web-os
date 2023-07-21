import styled from 'styled-components';

export const StyledTaskbarApp = styled.button<{ focused: boolean, multipleOpen: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

	cursor: default !important; // Overrides beautiful-dnd
  height: 100%;
  width: 40px;
  margin: 0px 1px;
  padding: 0px 4px;
  padding-top: 4px;

  background-color: ${({ focused }) => focused ? '#FAFAFA' : 'inherit'};
  border: ${({ focused }) => focused ? '1px solid #E9E9E9' : '1px solid transparent'};
  border-radius: 4px;

  box-shadow: ${({ focused, multipleOpen }) => focused && multipleOpen ? '1px 0px #e1e1e1' : ''};
  
  &:hover {
    background-color: #FAFAFA;
    border: 1px solid #E9E9E9;
    box-shadow: ${({ multipleOpen }) => multipleOpen ? '1px 0px #e1e1e1' : ''};
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 2px;
  }

  .open-bar {
    width: ${({ focused }) => focused ? '50%' : '20%'};
    height: 2px;
    border: 1px solid;
    border-color: ${({ focused }) => focused ? '#0064CC' : '#6E6E6E'} ;
    border-radius: 8px;
    background-color: ${({ focused }) => focused ? '#0078D4' : '#858585'};
  }

  &:focus {
    .icon {
      animation-name: click-animation;
      animation-duration: .4s;
    }
  }

  @keyframes click-animation {
    0% { transform: scale(1) }
    50% { transform: scale(.75); }
    100% { transform: scale(1); }
  }
`;

export const StyledExtraBackWindow = styled.div`
  position: absolute;
  z-index: -1;
  bottom: 2px;
  top: 2px;

  margin-left: 20px;
  width: 30px;
  background-color: #FAFAFA;
  border: 1px solid #E9E9E9;
  border-radius: 4px;
`;
