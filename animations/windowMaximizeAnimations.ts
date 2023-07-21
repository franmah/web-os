import { TASKBAR_HEIGHT } from '../constants/Taskbar';

const HEIGHT_OFFSET = '15px';

export const maximizeAnimation = {
	name: 'window-maximize-placeholder-animation',
	animation: (left: number, width: number, height: number) => {
		return `
      @keyframes window-maximize-placeholder-animation {
        0%   {top: ${0}px; left: ${left}px; width: ${width}px; height: ${height}px;}
        100% {top: ${8}px; left: ${8}px; width: calc(100% - 16px); height: calc(100% - ${TASKBAR_HEIGHT}px - ${HEIGHT_OFFSET});}
      }
    `;
	}
};

export const leftMaximizeAnimation = {
	name: 'window-left-maximize-placeholder-animation',
	animation: (top: number, height: number) => {
		return `
      @keyframes window-left-maximize-placeholder-animation {
        0%   {top: ${top}px; left: ${0}px; width: ${0}px; height: ${height}px;}
        100% {top: ${8}px; left: ${8}px; width: calc(100% / 2 - 8px); height: calc(100% - ${TASKBAR_HEIGHT}px - ${HEIGHT_OFFSET});}
      }
    `;
	}
};

export const rightMaximizeAnimation = {
	name: 'window-right-maximize-placeholder-animation',
	animation: (top: number, height: number) => {
		return `
      @keyframes window-right-maximize-placeholder-animation {
        0%   {top: ${top}px; right: ${0}px; width: ${0}px; height: ${height}px;}
        100% {top: ${8}px; right: ${8}px; width:calc(100% / 2 - 8px); height: calc(100% - ${TASKBAR_HEIGHT}px - ${HEIGHT_OFFSET});}
      }
    `;
	}
};

export const heightMaximizeAnimation = {
	name: 'window-height-maximize-placeholder-animation',
	animation: (left: number, width: number, height: number) => {
		return `
      @keyframes window-height-maximize-placeholder-animation {
        0%   {top: 0px; left: ${left}px; width: ${width}; height: ${height}px;}
        100% {top: 0px; left: ${left}px; width: ${width}; height: calc(100% - ${TASKBAR_HEIGHT}px - ${HEIGHT_OFFSET});}
      }
    `;
	}
};

export const minimizeAnimation = {
  animation: (height: number, left: number, top: number, width: number) => {
    return `
      @keyframes window-minimize-animation {
        0% { top: ${top}px; left: ${left}px; width: ${width}px; height: ${height}px; opacity: 100% }
        70% { opacity: 0%; }
        100% { top: ${window.innerHeight}px; left: ${window.innerWidth / 2}px; width: ${0}px; height: ${0}px; }
      }
    `;
  },
  name: 'window-minimize-animation'
};

export const unminimizeAnimation = {
  animation: (height: number, left: number, top: number, width: number) => {
    return `
      @keyframes window-unminimize-animation {
        0% { top: ${window.innerHeight}px; left: ${window.innerWidth / 2}px; width: ${0}px; height: ${0}px; opacity: 0% }
        70% { opacity: 100%; }
        100% { top: ${top}px; left: ${left}px; width: ${width}px; height: ${height}px; opacity: 100% }
      }
    `;
  },
  name: 'window-unminimize-animation'
};
