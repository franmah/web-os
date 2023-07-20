import styled from 'styled-components';
import { WINDOW_MIN_HEIGH, WINDOW_MIN_WIDTH } from '../../../components/system/window/Window';

export const StyledWindow = styled.div<{
	focused: boolean;
	top: number;
	left: number;
	width: number;
	height: number;
	zIndex: number;
	minimized: boolean;
	minimizeAnimationName: string;
}>`
	/* visibility: ${({ minimized }) => minimized ? 'hidden' : 'visible'}; */
	position: absolute;
	background-color: #ced8eb;

	top: ${({ top }) => `${top}px`};
	left: ${({ left }) => `${left}px`};
	width: ${({ width }) => `${width}px`};
	height: ${({ height }) => `${height}px`};
	z-index: ${({ zIndex }) => zIndex};

	min-width: ${() => `${WINDOW_MIN_WIDTH}px`};
	min-height: ${() => `${WINDOW_MIN_HEIGH}px`};
	border-radius: 8px;

	box-shadow: ${({ focused }) => (focused ? '0px 0px 16px 2px #0000003a' : '0px 0px 4px 2px #0000002a')};

	.centerContent {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		border-radius: 8px;
	}

	${({ minimized, minimizeAnimationName }) => {
		console.log('showing animation: ' + minimized);
		const animation = minimized ?
			`
				top: -1000px;
				left: -1000px;
				min-width: 0px;
				min-height: 0px;
				width: 0px;
				height: 0px;
				animation-duration: .5s;
				animation-name: ${minimizeAnimationName}
			` : '';
		return animation;
	}}
`;
