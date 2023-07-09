import styled from 'styled-components';

const BORDER_RADIUS = '6px';

export const StyledMaximizeOptionsModalMain = styled.div`
	height: 100%;
	display: grid;
	padding: 8px;

	grid-template-columns: 1fr 1fr;
	grid-template-rows: 1fr 1fr;
	gap: 12px;

	.item {
		background-color: #cfd8e1;
		border: 1px solid #7d868f;

		&:hover {
			background-color: #0067c0;
		}
	}

	.topLeft {
		display: flex;
		justify-content: space-between;

		.left {
			height: 100%;
			flex: 1;
			margin-right: 4px;
			border-radius: ${BORDER_RADIUS} 0px 0px ${BORDER_RADIUS};
		}

		.right {
			flex: 1;
			height: 100%;
			border-radius: 0px ${BORDER_RADIUS} ${BORDER_RADIUS} 0px;
		}
	}

	.topRight {
		display: flex;
		justify-content: space-between;

		.left {
			height: 100%;
			flex: 3;
			margin-right: 4px;
			border-radius: ${BORDER_RADIUS} 0px 0px ${BORDER_RADIUS};
		}

		.right {
			flex: 2;
			height: 100%;
			border-radius: 0px ${BORDER_RADIUS} ${BORDER_RADIUS} 0px;
		}
	}

	.bottomLeft {
		display: grid;
		grid-template-areas:
			'left top'
			'left bottom';
		gap: 2px;

		.left {
			grid-area: left;
			height: 100%;
			flex: 3;
			margin-right: 4px;
			border-radius: ${BORDER_RADIUS} 0px 0px ${BORDER_RADIUS};
		}

		.top {
			grid-area: top;
			border-radius: 0px ${BORDER_RADIUS} 0px 0px;
			margin-bottom: 4px;
		}

		.bottom {
			grid-area: bottom;
			border-radius: 0px 0px ${BORDER_RADIUS} 0px;
		}
	}

	.bottomRight {
		display: grid;
		gap: 4px;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 1fr;

		.topLeft {
			height: 100%;
			border-radius: ${BORDER_RADIUS} 0px 0px 0px;
		}

		.topRight {
			border-radius: 0px ${BORDER_RADIUS} 0px 0px;
		}

		.bottomLeft {
			border-radius: 0px 0px 0px ${BORDER_RADIUS};
		}

		.bottomRight {
			border-radius: 0px 0px ${BORDER_RADIUS} 0px;
		}
	}
`;
