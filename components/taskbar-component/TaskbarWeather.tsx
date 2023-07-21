import { FC, useEffect, useState } from 'react';
import { getWeatherInformation } from '../../services/WeatherService';
import { BiFoodMenu } from 'react-icons/bi';
import globalStyles from '../../styles/global.module.scss';
import Image from 'next/image';
import { Weather } from '../../types/taskbar/Weather';
import { StyledTaskbarWeather } from '../../styled-components/system/taskbar/StyledTaskbarWeather';

const TaskbarWeather: FC<{}> = () => {
	const [weather, setWeather] = useState<Weather | null>(null);

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(onCurrentPositionAllowed, error => console.warn(error));
	}, []);

	const onCurrentPositionAllowed = async (position: any) => {
		const latitude = position?.coords?.latitude;
		const longitude = position?.coords?.longitude;
		const weatherData = await getWeatherInformation(latitude, longitude);
		setWeather(weatherData);
	};

	return (
		<StyledTaskbarWeather className={globalStyles.unselectableText}>
			{weather ? (
				<div className='weather'>
					<Image className='weatherIcon' src={weather.icon} alt='weather' width={28} height={28} />

					<div className='weatherInfo'>
						<div>
							{weather.temperature}°{weather.temperatureUnit}
						</div>
						<div className='forecast'> {weather.forecast} </div>
					</div>
				</div>
			) : (
				<BiFoodMenu size={26} className='placeholderIcon' />
			)}
		</StyledTaskbarWeather>
	);
};

export default TaskbarWeather;
