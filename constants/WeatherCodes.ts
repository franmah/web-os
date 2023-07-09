export type WeatherLookup = {
	[code: number]: {
		actual: string; // actual forecast sent by the api
		icon: string;
		forecast: string; // shortened forecast to fit in weather component
	};
};

export const weatherCodeLookupDay: WeatherLookup = {
	1000: {
		actual: 'Sunny',
		icon: '/weather/day/day_clear.png',
		forecast: 'Sunny'
	},
	1003: {
		actual: 'Partly cloudy',
		icon: '/weather/day/day_partial_cloud.png',
		forecast: 'Partly cloudy'
	},
	1006: {
		actual: 'Cloudy',
		icon: '/weather/clouds/cloudy.png',
		forecast: 'Cloudy'
	},
	1009: {
		actual: 'Overcast',
		icon: '/weather/clouds/overcast.png',
		forecast: 'Overcast'
	},
	1030: {
		actual: 'Mist',
		icon: '/weather/clouds/mist.png',
		forecast: 'Mist'
	},
	1063: {
		actual: 'Patchy rain possible',
		icon: '/weather/clouds/rain.png',
		forecast: 'Patchy'
	},
	1066: {
		actual: 'Patchy snow possible',
		icon: '/weather/day/day_sleet.png',
		forecast: 'Patchy snow possible'
	},
	1069: {
		actual: 'Patchy sleet possible',
		icon: '/weather/day/day_sleet.png',
		forecast: 'Patchy sleet possible'
	},
	1072: {
		actual: 'Patchy freezing drizzle possible',
		icon: '/weather/day/day_sleet.png',
		forecast: 'Patchy'
	},
	1087: {
		actual: 'Thundery outbreaks possible',
		icon: '/weather/clouds/rain_thunder.png',
		forecast: 'Thundery outbreaks possible'
	},
	1114: {
		actual: 'Blowing snow',
		icon: '/weather/day/day_snow.png',
		forecast: 'Snow'
	},
	1117: {
		actual: 'Blizzard',
		icon: '/weather/clouds/snow.png',
		forecast: 'Blizzard'
	},
	1135: {
		actual: 'Fog',
		icon: '/weather/clouds/fog.png',
		forecast: 'Fog'
	},
	1147: {
		actual: 'Freezing fog',
		icon: '/weather/clouds/fog.png',
		forecast: 'Freezing fog'
	},
	1150: {
		actual: 'Patchy light drizzle',
		icon: '/weather/day/day_partial_cloud.png',
		forecast: 'Patchy light drizzle'
	},
	1153: {
		actual: 'Light drizzle',
		icon: '/weather/day/day_partial_cloud.png',
		forecast: 'Light drizzle'
	},
	1168: {
		actual: 'Freezing drizzle',
		icon: '/weather/day/day_partial_cloud.png',
		forecast: 'Freezing drizzle'
	},
	1171: {
		actual: 'Heavy freezing drizzle',
		icon: '/weather/day/day_sleet.png',
		forecast: 'Heavy freezing drizzle'
	},
	1180: {
		actual: 'Patchy light rain',
		icon: '/weather/day/day_rain.png',
		forecast: 'Light rain'
	},
	1183: {
		actual: 'Light rain',
		icon: '/weather/day/day_rain.png',
		forecast: 'Light rain'
	},
	1186: {
		actual: 'Moderate rain at times',
		icon: '/weather/clouds/rain.png',
		forecast: 'Moderate rain'
	},
	1189: {
		actual: 'Moderate rain',
		icon: '/weather/clouds/rain.png',
		forecast: 'Moderate rain'
	},
	1192: {
		actual: 'Heavy rain at times',
		icon: '/weather/clouds/rain.png',
		forecast: 'Heavy rain'
	},
	1195: {
		actual: 'Heavy rain',
		icon: '/weather/clouds/rain.png',
		forecast: 'Heavy rain'
	},
	1198: {
		actual: 'Light freezing rain',
		icon: '/weather/day/day_rain.png',
		forecast: 'Light freezing rain'
	},
	1201: {
		actual: 'Moderate or heavy freezing rain',
		icon: '/weather/clouds/rain.png',
		forecast: 'Moderate freezing rain'
	},
	1204: {
		actual: 'Light sleet',
		icon: '/weather/day/day_sleet.png',
		forecast: 'Light sleet'
	},
	1207: {
		actual: 'Moderate or heavy sleet',
		icon: '/weather/clouds/sleet.png',
		forecast: 'Moderate sleet'
	},
	1210: {
		actual: 'Patchy light snow',
		icon: '/weather/day/day_snow.png',
		forecast: 'Light snow'
	},
	1213: {
		actual: 'Light snow',
		icon: '/weather/day/day_snow.png',
		forecast: 'Light snow'
	},
	1216: {
		actual: 'Patchy moderate snow',
		icon: '/weather/clouds/snow.png',
		forecast: 'Moderate snow'
	},
	1219: {
		actual: 'Moderate snow',
		icon: '/weather/clouds/snow.png',
		forecast: 'Moderate snow'
	},
	1222: {
		actual: 'Patchy heavy snow',
		icon: '/weather/clouds/snow.png',
		forecast: 'Heavy snow'
	},
	1225: {
		actual: 'Heavy snow',
		icon: '/weather/clouds/snow.png',
		forecast: 'Heavy snow'
	},
	1237: {
		actual: 'Ice pellets',
		icon: '/weather/clouds/snow.png',
		forecast: 'Ice pellets'
	},
	1240: {
		actual: 'Light rain shower',
		icon: '/weather/day/day_rain.png',
		forecast: 'Light rain'
	},
	1243: {
		actual: 'Moderate or heavy rain shower',
		icon: '/weather/clouds/rain.png',
		forecast: 'Moderate rain'
	},
	1246: {
		actual: 'Torrential rain shower',
		icon: '/weather/clouds/rain.png',
		forecast: 'Torrential rain'
	},
	1249: {
		actual: 'Light sleet showers',
		icon: '/weather/day/day_sleet.png',
		forecast: 'Light sleet showers'
	},
	1252: {
		actual: 'Moderate or heavy sleet showers',
		icon: '/weather/clouds/sleet.png',
		forecast: 'Moderate or heavy sleet'
	},
	1255: {
		actual: 'Light snow showers',
		icon: '/weather/day/day_snow.png',
		forecast: 'Light snow'
	},
	1258: {
		actual: 'Moderate or heavy snow showers',
		icon: '/weather/clouds/snow.png',
		forecast: 'Moderate snow'
	},
	1261: {
		actual: 'Light showers of ice pellets',
		icon: '/weather/day/day_snow.png',
		forecast: 'Light ice pellets'
	},
	1264: {
		actual: 'Moderate or heavy showers of ice pellets',
		icon: '/weather/clouds/snow.png',
		forecast: 'Moderate ice pellets'
	},
	1273: {
		actual: 'Patchy light rain with thunder',
		icon: '/weather/day/day_rain_thunder.png',
		forecast: 'Light rain with thunder'
	},
	1276: {
		actual: 'Moderate or heavy rain with thunder',
		icon: '/weather/clouds/rain_thunder.png',
		forecast: 'Moderate rain with thunder'
	},
	1279: {
		actual: 'Patchy light snow with thunder',
		icon: '/weather/day/day_snow_thunder.png',
		forecast: 'Light snow with thunder'
	},
	1282: {
		actual: 'Moderate or heavy snow with thunder',
		icon: '/weather/clouds/snow_thunder.png',
		forecast: 'Moderate snow with thunder'
	}
};

export const weatherCodeLookupNight: WeatherLookup = {
	1000: {
		actual: 'Clear',
		icon: '/weather/night/night_half_moon_clear.png',
		forecast: 'Clear'
	},
	1003: {
		actual: 'Partly cloudy',
		icon: '/weather/night/night_half_moon_partial_cloud.png',
		forecast: 'Partly cloudy'
	},
	1006: {
		actual: 'Cloudy',
		icon: '/weather/night//night_half_moon_partial_cloud.png',
		forecast: 'Cloudy'
	},
	1009: {
		actual: 'Overcast',
		icon: '/weather/clouds/overcast.png',
		forecast: 'Overcast'
	},
	1030: {
		actual: 'Mist',
		icon: '/weather/night/night_half_moon_clear.png',
		forecast: 'Mist'
	},
	1063: {
		actual: 'Patchy rain possible',
		icon: '/weather/night/night_half_moon_rain.png',
		forecast: 'Patchy rain possible'
	},
	1066: {
		actual: 'Patchy snow possible',
		icon: '/weather/night/night_half_moon_snow.png',
		forecast: 'Patchy snow possible'
	},
	1069: {
		actual: 'Patchy sleet possible',
		icon: '/weather/night/night_half_moon_sleet.png',
		forecast: 'Patchy sleet possible'
	},
	1072: {
		actual: 'Patchy freezing drizzle possible',
		icon: '/weather/night/night_half_moon_clear.png',
		forecast: 'Patchy freezing drizzle possible'
	},
	1087: {
		actual: 'Thundery outbreaks possible',
		icon: '/weather/clouds/thunder.png',
		forecast: 'Thundery outbreaks possible'
	},
	1114: {
		actual: 'Blowing snow',
		icon: '/weather/night/night_half_moon_snow.png',
		forecast: 'Blowing snow'
	},
	1117: {
		actual: 'Blizzard',
		icon: '/weather/clouds/snow.png',
		forecast: 'Blizzard'
	},
	1135: {
		actual: 'Fog',
		icon: '/weather/night/night_half_moon_clear.png',
		forecast: 'Fog'
	},
	1147: {
		actual: 'Freezing fog',
		icon: '/weather/clouds/fog.png',
		forecast: 'Freezing fog'
	},
	1150: {
		actual: 'Patchy light drizzle',
		icon: '/weather/night/night_half_moon_clear.png',
		forecast: 'Light drizzle'
	},
	1153: {
		actual: 'Light drizzle',
		icon: '/weather/night',
		forecast: 'Light drizzle'
	},
	1168: {
		actual: 'Freezing drizzle',
		icon: '/weather/night/night_half_moon_rain.png',
		forecast: 'Freezing drizzle'
	},
	1171: {
		actual: 'Heavy freezing drizzle',
		icon: '/weather/night/night_half_moon_rain.png',
		forecast: 'Heavy freezing drizzle'
	},
	1180: {
		actual: 'Patchy light rain',
		icon: '/weather/night/night_half_moon_rain.png',
		forecast: 'Light rain'
	},
	1183: {
		actual: 'Light rain',
		icon: '/weather/night/night_half_moon_.png',
		forecast: 'Light rain'
	},
	1186: {
		actual: 'Moderate rain at times',
		icon: '/weather/night/night_half_moon_rain.png',
		forecast: 'Moderate rain'
	},
	1189: {
		actual: 'Moderate rain',
		icon: '/weather/night/night_half_moon_rain.png',
		forecast: 'Moderate rain'
	},
	1192: {
		actual: 'Heavy rain at times',
		icon: '/weather/clouds/rain.png',
		forecast: 'Heavy rain'
	},
	1195: {
		actual: 'Heavy rain',
		icon: '/weather/clouds/rain.png',
		forecast: 'Heavy rain'
	},
	1198: {
		actual: 'Light freezing rain',
		icon: '/weather/night/night_half_moon_rain.png',
		forecast: 'Light freezing rain'
	},
	1201: {
		actual: 'Moderate or heavy freezing rain',
		icon: '/weather/night/night_half_moon_rain.png',
		forecast: 'Moderate freezing rain'
	},
	1204: {
		actual: 'Light sleet',
		icon: '/weather/night/night_half_moon_sleet.png',
		forecast: 'Light sleet'
	},
	1207: {
		actual: 'Moderate or heavy sleet',
		icon: '/weather/clouds/sleet.png',
		forecast: 'Moderate or heavy sleet'
	},
	1210: {
		actual: 'Patchy light snow',
		icon: '/weather/night/night_half_moon_snow.png',
		forecast: 'Light snow'
	},
	1213: {
		actual: 'Light snow',
		icon: '/weather/night/night_half_moon_snow.png',
		forecast: 'Light snow'
	},
	1216: {
		actual: 'Patchy moderate snow',
		icon: '/weather/night/night_half_moon_snow.png',
		forecast: 'Moderate snow'
	},
	1219: {
		actual: 'Moderate snow',
		icon: '/weather/night/night_half_moon_snow.png',
		forecast: 'Moderate snow'
	},
	1222: {
		actual: 'Patchy heavy snow',
		icon: '/weather/clouds/snow.png',
		forecast: 'Heavy snow'
	},
	1225: {
		actual: 'Heavy snow',
		icon: '/weather/clouds/snow.png',
		forecast: 'Heavy snow'
	},
	1237: {
		actual: 'Ice pellets',
		icon: '/weather/night/night_half_moon_snow.png',
		forecast: 'Ice pellets'
	},
	1240: {
		actual: 'Light rain shower',
		icon: '/weather/night/night_half_moon_rain.png',
		forecast: 'Light rain'
	},
	1243: {
		actual: 'Moderate or heavy rain shower',
		icon: '/weather/night/night_half_moon_rain.png',
		forecast: 'Moderate rain'
	},
	1246: {
		actual: 'Torrential rain shower',
		icon: '/weather/clouds/rain.png',
		forecast: 'Torrential rain'
	},
	1249: {
		actual: 'Light sleet showers',
		icon: '/weather/night/night_half_moon_rain.png',
		forecast: 'Light rain'
	},
	1252: {
		actual: 'Moderate or heavy sleet showers',
		icon: '/weather/clouds/sleet.png',
		forecast: 'Moderate or heavy sleet'
	},
	1255: {
		actual: 'Light snow showers',
		icon: '/weather/night/night_half_moon_snow.png',
		forecast: 'Light snow'
	},
	1258: {
		actual: 'Moderate or heavy snow showers',
		icon: '/weather/night/night_half_moon_snow.png',
		forecast: 'Moderate snow'
	},
	1261: {
		actual: 'Light showers of ice pellets',
		icon: '/weather/night/night_half_moon_snow.png',
		forecast: 'Light ice pellets'
	},
	1264: {
		actual: 'Moderate or heavy showers of ice pellets',
		icon: '/weather/night/night_half_moon_snow.png',
		forecast: 'Moderate ice pellets'
	},
	1273: {
		actual: 'Patchy light rain with thunder',
		icon: '/weather/night/night_half_moon_rain_thunder.png',
		forecast: 'Light rain with thunder'
	},
	1276: {
		actual: 'Moderate or heavy rain with thunder',
		icon: '/weather/night/night_half_moon_rain_thunder.png',
		forecast: 'Moderate rain with thunder'
	},
	1279: {
		actual: 'Patchy light snow with thunder',
		icon: '/weather/night/night_half_moon_snow_thunder.png',
		forecast: 'Light snow with thunder'
	},
	1282: {
		actual: 'Moderate or heavy snow with thunder',
		icon: '/weather/night/night_half_moon_snow_thunder.png',
		forecast: 'Moderate snow with thunder'
	}
};
