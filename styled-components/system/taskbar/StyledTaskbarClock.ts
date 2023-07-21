import styled from 'styled-components';

export const StyledTaskbarClock = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	height: 100%;
	align-items: flex-end;
	font-size: 12px;
	text-align: center;
	color: black;
	padding: 0px 8px;
	margin-right: 8px;

	border: 1px solid transparent;
	border-radius: 4px;
	
	&:hover {
		background-color: #f8f8f8;
		border-radius: 4px;
    border: 1px solid #E9E9E9;
		cursor: default;
	}
`;
