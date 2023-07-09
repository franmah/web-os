import styled from 'styled-components';

export const StyledWindowHeader = styled.header<{ focused: boolean }>`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	/* background-image: linear-gradient(to right,  #D4DBE6, #D5DBE2); */
	background-color: ${({ focused }) => (focused ? '#D4DBE6' : '#E8E8E8')};
	border-top-right-radius: 8px;
	border-top-left-radius: 8px;

	.maximizeContainer,
	.minimizeIcon,
	.closeIcon {
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 46px;
		color: ${({ focused }) => (focused ? 'black' : 'rgb(121, 118, 118);')};

		&:hover {
			color: black;
		}
	}

	.maximizeContainer,
	.minimizeIcon {
		&:hover {
			background-color: #aeb7c7;
		}
	}

	.closeIcon {
		border-top-right-radius: 8px; // TODO: try to inherit from parent
		&:hover {
			background-color: #e81123;
		}
	}
`;
