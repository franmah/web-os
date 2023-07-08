import styled from "styled-components";

const BORDER_SIZE = '6px';
const CORNER_LENGTH = '8px';
const CORNER_RADIUS = '8px';
const BORDER_OFFSET = '-4px';

export const StyledWindowBorder = styled.div<{ resizing: boolean, zIndex: number }>`
  width: 100%;
  height: 100%;
  z-index: ${({ zIndex }) => zIndex };

  .children {
    width: 100%;
    height: 100%;

    position: absolute;
    left: 0;
    top: 0;
  }

  .top:hover { cursor: ${({ resizing }) => resizing ? 'inherit' : 'n-resize' }; }
  .topLeft:hover { cursor: ${({ resizing }) => resizing ? 'inherit' : 'se-resize' }; }
  .topRight:hover { cursor: ${({ resizing }) => resizing ? 'inherit' : 'ne-resize' }; }
  .bottom:hover { cursor: ${({ resizing }) => resizing ? 'inherit' : 'n-resize' }; }
  .bottomLeft:hover { cursor: ${({ resizing }) => resizing ? 'inherit' : 'ne-resize' }; }
  .bottomRight:hover { cursor: ${({ resizing }) => resizing ? 'inherit' : 'se-resize' }; }
  .leftCenterTop:hover { cursor: ${({ resizing }) => resizing ? 'inherit' : 'se-resize' }; }
  .leftCenterMiddle:hover { cursor: ${({ resizing }) => resizing ? 'inherit' : 'e-resize' }; }
  .leftCenterBottom:hover { cursor: ${({ resizing }) => resizing ? 'inherit' : 'ne-resize' }; }
  .rightCenterTop:hover { cursor: ${({ resizing }) => resizing ? 'inherit' : 'ne-resize' }; }
  .rightCenterMiddle:hover { cursor: ${({ resizing }) => resizing ? 'inherit' : 'e-resize' }; }
  .rightCenterBottom:hover { cursor: ${({ resizing }) => resizing ? 'inherit' : 'se-resize' }; }

  .topBorder {
    position: absolute;
    top: ${BORDER_OFFSET};
    left: 0px;

    display: flex;
    width: calc(100% + 2px);
    height: ${BORDER_SIZE};
    
    .top {
      flex: 1;
    }

    .topLeft, .topRight {
      width: ${CORNER_LENGTH};
    }

    .topLeft {
      border-top-left-radius: ${CORNER_RADIUS};
    }

    .topRight {
      border-top-right-radius: ${CORNER_RADIUS};
    }
  }

  .centerLeft {
    position: absolute;
    top: 0px;
    left: ${BORDER_OFFSET};
    height: calc(100% + 2px);
    width: ${BORDER_SIZE};

    display: flex;
    flex-direction: column;

    .leftCenterTop {
      height: ${CORNER_LENGTH};
      border-top-left-radius: ${CORNER_RADIUS};
    }

    .leftCenterMiddle {
      flex: 1;
    }

    .leftCenterBottom {
      height: ${CORNER_LENGTH};
      border-bottom-left-radius: ${CORNER_RADIUS};
    }
  }

  .centerRight {
    position: absolute;
    top: 0px;
    left: calc(100% - 2px);
    height: calc(100%);

    display: flex;
    flex-direction: column;
    width: ${BORDER_SIZE};

    .rightCenterTop {
      height:${CORNER_LENGTH};
      border-top-right-radius: ${CORNER_RADIUS};
    }

    .rightCenterMiddle {
      flex: 1;
    }

    .rightCenterBottom {
      height: ${CORNER_LENGTH};
      border-bottom-right-radius: ${CORNER_RADIUS};
    }
  }

  .bottomBorder {
    position: absolute;
    bottom: ${BORDER_OFFSET};
    left: 0px;
    
    display: flex; 
    width: calc(100% + 2px);
    height: ${BORDER_SIZE};

    .bottom {
      flex: 1;
    }

    .bottomLeft, .bottomRight {
      width: ${CORNER_LENGTH};
    }

    .bottomLeft {
      border-bottom-left-radius: ${CORNER_RADIUS};
    }

    .bottomRight {
      border-bottom-right-radius: ${CORNER_RADIUS};
    }
  }
`;