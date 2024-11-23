import { parse } from 'node-html-parser';
import { dateString } from './utils.js';

const LATITUDE = 40.667436;
const LONGITUDE = -73.9827496;

export default async function (): Promise<string> {
  try {
    // fetch the website content
    const response = await fetch(`https://forecast.weather.gov/MapClick.php?lat=${LATITUDE}&lon=${LONGITUDE}`);
    const html = await response.text();

    // find tomorrow's forecast
    const root = parse(html);
    const forecastDiv = root.querySelector('#detailed-forecast-body');
    const dayTwoForecast = forecastDiv?.querySelectorAll('div')[5]?.innerHTML;

    return dayTwoForecast ? dayTwoForecast : `Error parsing page - ${dateString()}`;
  } catch (error) {
    console.error(error);
    return `Error fetching weather data: ${error}`;
  }
}
