import styled from 'styled-components';

export const StyledTaskbarWeather = styled.section`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;

	border: 1px solid transparent;
	border-radius: 6px;
	margin-left: 8px;
	padding-left: 8px;
	padding-right: 32px;

	&:hover {
		border: 1px solid #eeeeee;
		background-color: rgba(255, 255, 255, 0.637);
	}

	.placeholderIcon {
		color: #1d7fc0;
	}

	.weather {
		display: flex;
		justify-content: center;
		align-items: center;

		.weatherIcon {
			display: flex;
			justify-content: center;
			align-items: center;
		}
		
		.weatherInfo {
			display: flex;
			flex-direction: column;
			padding-left: 8px;
			font-size: small;

			.forecast {
				color: #707070;
			}
		}
	}
`;
