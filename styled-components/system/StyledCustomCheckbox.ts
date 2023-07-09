import styled from 'styled-components';

export const StyledCheckbox = styled.div<{ checked: boolean }>`
	width: 14px;
	height: 14px;

	border-radius: 0.2em;
	border: 0.1em solid #626262;
	background-color: ${({ checked }) => (checked ? '#196EBF' : '#F3F3F3')};

	&:hover {
		background-color: ${({ checked }) => (checked ? '#196EBF' : '#EAEAEA')};
	}

	.clip-path-container {
		width: 100%;
		height: 100%;
		background-color: #e2edf7;
		clip-path: polygon(75% 24%, 81% 29%, 43% 77%, 15% 63%, 20% 57%, 40% 67%);
	}
`;
