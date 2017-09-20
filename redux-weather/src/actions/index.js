import axios from 'axios';

const API_KEY = '29d299024fb91e923bd30784052f0903';
const ROOT_URL = `http://api.openweathermap.org/data/2.5/forecast?appid=${API_KEY}`;

export const FETCH_WEATHER = 'FETCH_WEATHER';

export function fetchWeather(city) {
  console.log(city);
  const url = `${ROOT_URL}&q=${city},ro`;
  const request = axios.get(url);

  return {
    type: FETCH_WEATHER,
    payload: request
  };
}
