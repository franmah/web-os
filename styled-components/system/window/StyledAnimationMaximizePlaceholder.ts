import styled from "styled-components";
import { TASKBAR_HEIGHT_PX } from "../../../constants/TaskbarConsts";
import { MaximizePlaceholderDirection } from "../../../constants/system/window/MaximizePlaceholderDirectionEnum";

const HEIGHT_OFFSET = '15px';

export const StyledAnimationMaximizePlaceholder = styled.div<{
  direction: MaximizePlaceholderDirection,
  zIndex: number,
  animationName: string,
  left: string,
  width: string
}>`
  position: fixed;
  z-index: ${({ zIndex }) => zIndex };
  border-radius: 8px;
  box-shadow: 0px 0px 8px 2px #00000041;
  animation-duration: .3s;
  animation-name: ${({ animationName }) => animationName };
  background-color: rgba(255, 255, 255, 0.103);
  backdrop-filter: blur(15px);
  top: 8px;

  ${props => {
    switch (props.direction) {
      case MaximizePlaceholderDirection.Full:
        return `
          left: 8px;
          width: calc(100% - 16px);
          height: calc(100% - ${ TASKBAR_HEIGHT_PX } - ${ HEIGHT_OFFSET });
        `;

      case MaximizePlaceholderDirection.Left: 
        return `
          left: 8px;
          width: calc(100% / 2 - 8px);
          height: calc(100% - ${ TASKBAR_HEIGHT_PX } - ${ HEIGHT_OFFSET });
        `;

      case MaximizePlaceholderDirection.Right: 
        return `
          right: 8px;
          width: calc(100% / 2 - 8px);
          height: calc(100% - ${ TASKBAR_HEIGHT_PX } - ${ HEIGHT_OFFSET });
        `;

      case MaximizePlaceholderDirection.Height: 
        return `
          height: calc(100% - ${ TASKBAR_HEIGHT_PX } - ${ HEIGHT_OFFSET });
          left: ${ props.left };
          width: ${ props.width };
        `;
    }
  }}
`;