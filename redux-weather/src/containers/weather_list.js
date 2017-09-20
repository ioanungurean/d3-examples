import React, { Component } from 'react';
import { connect } from 'react-redux';
import Chart from '../components/chart';
import GoogleMap from '../components/google_map';

class WeatherList extends Component {
  renderWeather(cityData) {
    const cityName = cityData.city.name;
    const temps = cityData.list.map(weather => weather.main.temp - 273.15);
    const pressures = cityData.list.map(weather => weather.main.pressure * 0.75006375541921);
    const humidities = cityData.list.map(weather => weather.main.humidity);
    const {lon, lat} = cityData.city.coord;

    return (
      <tr key={cityName}>
        <td><b>{cityName}</b></td>
        <td><Chart data={temps} limit={5} color="orange" units="°C" /></td>
        <td><Chart data={pressures} limit={5} color="green" units="mmHg" /></td>
        <td><Chart data={humidities} limit={5} color="blue" units="%"/></td>
        <td><GoogleMap lon={lon} lat={lat} /></td>
      </tr>
    );
  }

  render() {
    return (
      <table className="table table-hover">
        <thead>
          <tr>
            <th>City</th>
            <th>Temperature (°C)</th>
            <th>Preasure (mmHg)</th>
            <th>Humidity (%)</th>
            <th>Map</th>
          </tr>
        </thead>
        <tbody>
          {this.props.weather.map(this.renderWeather)}
        </tbody>
      </table>
    );
  }
}


function mapStateToProps(state) {
  return {
    weather: state.weather
  };
};


export default connect(mapStateToProps)(WeatherList);
