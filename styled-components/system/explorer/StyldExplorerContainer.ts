import styled from 'styled-components';

export const StyledExplorerContainer = styled.div`
	background-color: white;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;

	.main-content {
		display: flex;
		width: 100%;
		height: 100%;

		.quick-access {
			min-width: 200px;
		}

		.divider {
			border-left: 1px solid #f7f7f7;
		}

		.file-view {
			flex: 1;
		}
	}

	.container-footer {
		padding-left: 8px;
		width: 100%;
		user-select: none;
		color: #1e395b;
		margin-bottom: 4px;

		span:first-of-type {
			margin-right: 16px;
		}
	}
`;
