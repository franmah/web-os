import styled from 'styled-components';

export const StyledExplorerFileViewHeader = styled.div<{
	columnSizes: { [column: string]: string };
}>`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	margin-bottom: 16px;

	.name-col {
		flex: ${({ columnSizes }) => `0 0 ${columnSizes['name']}`};

		.left-side {
			display: flex;
			align-items: center;

			.name-col-checkbox {
				margin-right: 8px;
			}
		}
	}

	.date-modified-col {
		flex: ${({ columnSizes }) => `0 0 ${columnSizes['dateModified']}`};
	}

	.type-col {
		flex: ${({ columnSizes }) => `0 0 ${columnSizes['type']}`};
	}

	.size-col {
		flex: ${({ columnSizes }) => `0 0 ${columnSizes['size']}`};
	}

	.column {
		text-align: start;
		color: #515858;
		font-weight: normal;
		padding: 0px 8px 4px 8px;
		border-right: 1px solid #d9d9d9;

		&:first-child {
			padding-right: 100px;
		}

		.sort-icon {
			position: relative;
			top: 0px;
			left: 50%;
			width: 1px;
			height: 10px;
			visibility: hidden;
		}

		.active-sort-icon {
			visibility: visible;
		}

		&:hover {
			background-color: #e5f3ff;
		}
	}

	.header-section-divider {
		border-left: 1px solid red;
		padding: 0px 3px;

		&:hover {
			cursor: ew-resize;
		}
	}
`;
