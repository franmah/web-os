import styled from 'styled-components';

export const StyledFileViewRow = styled.div<{
	columnSizes: { [column: string]: string };
	selected: boolean;
}>`
	display: flex;
	background-color: ${({ selected }) => (selected ? '#CCE8FF' : '')};
	margin-bottom: 4px;
	height: 28px;
	overflow: hidden;

	.column {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		padding: 8px 8px;

		&:first-child {
			padding-right: 100px;
		}

		.select-checkbox {
			visibility: ${({ selected }) => (selected ? 'visible' : 'hidden')};
		}
	}

	.name-col {
		flex: ${({ columnSizes }) => `0 0 ${columnSizes['name']}`};
		display: flex;
		align-items: center;

		.icon {
			margin: 0px 6px;
		}

		.name-input {
			outline: none;
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

	&:hover {
		background-color: ${({ selected }) => (selected ? '#CCE8FF' : '#E5F3FF')};

		.select-checkbox {
			visibility: visible;
		}
	}
`;
