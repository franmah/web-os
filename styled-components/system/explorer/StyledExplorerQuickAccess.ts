import styled from 'styled-components';

export const StyledExplorerQuickAccess = styled.nav`
	padding: 8px 4px;

	.divider {
		margin: 16px 4px;
		border-bottom: 1px solid #d6d6d6;
	}

	/* CHANGE TO A COMMON TYPE SINCE THEY'RE ALL THE SAME */
	/* left icon, folder icon, folder name, extra icon */
	.pinned-folder {
		border: none;
		background-color: white;
		padding: 8px 4px;
		padding-left: 15%;
		margin: 4px 0px;
		user-select: none;

		display: flex;
		align-items: center;
		width: 100%;

		.left-side {
			display: flex;
			align-items: center;
			flex: 1;

			.folder-name {
				margin-left: 4px;
				overflow: hidden;
			}
		}

		&:hover {
			background-color: #e5f3ff;
			cursor: pointer;
		}
	}

	.focused {
		background-color: #cce8ff;

		&:hover {
			background-color: 'CCE8FF';
		}
	}

	.blured {
		background-color: #d9d9d9;
	}
`;
