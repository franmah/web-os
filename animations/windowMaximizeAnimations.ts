export const maximizeAnimation = {
  name: 'window-maximize-animation',
  animation: (left: number, width: number, height: number) => {
    return `
      @keyframes window-maximize-animation {
        0%   {top: ${0}px; left: ${left}px; width: ${width}px; height: ${height}px;}
        95%   {top: ${0}px; left: ${8}px; width: calc(100% - 16px); height: calc(100% - 65px);}
        100% {top: ${8}px; left: ${8}px; width: calc(100% - 16px); height: calc(100% - 65px);}
      }
    `;
  }
};

export const leftMaximizeAnimation = {
  name: 'window-left-maximize-animation',
  animation: (top: number, height: number) => {
    return `
      @keyframes window-left-maximize-animation {
        0%   {top: ${top}px; left: ${0}px; width: ${0}px; height: ${height}px;}
        90%   {top: ${8}px; left: ${0}px; width: calc(100% / 2 - 8px); height: calc(100% - 65px);}
        100% {top: ${8}px; left: ${8}px; width: calc(100% / 2 - 8px); height: calc(100% - 65px);}
      }
    `;
  }
};

export const rightMaximizeAnimation = {
  name: 'window-right-maximize-animation',
  animation: (top: number, height: number) => {
    return `
      @keyframes window-right-maximize-animation {
        0%   {top: ${top}px; right: ${0}px; width: ${0}px; height: ${height}px;}
        90%   {top: ${8}px; right: ${8}px; width: calc(100% / 2 - 8px); height: calc(100% - 65px);}
        100% {top: ${8}px; right: ${8}px; width:calc(100% / 2 - 8px); height: calc(100% - 65px);}
      }
    `;
  }
};
