import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './SearchBox.css';
import { useState } from 'react';

export default function SearchBox({updateInfo}){
    let [city, setCity] = useState("");
    let [error, setError] = useState(false);
    const API_URL = "http://api.openweathermap.org/geo/1.0/direct";
    const API_URL2 = "https://api.openweathermap.org/data/2.5/weather";
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
    const getWeather = async () => {
        try{
            let response = await fetch(`${API_URL}?q=${city}&limit=${1}&appid=${API_KEY}`);
            let jsonResponse = await response.json();
            let lat = jsonResponse[0].lat;
            let lon = jsonResponse[0].lon;
            let response2 = await fetch(`${API_URL2}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
            let jsonResponse2 = await response2.json();
            console.log(jsonResponse2);
            let result = {
                city: city,
                temp: jsonResponse2.main.temp,
                tempMin: jsonResponse2.main.temp_min,
                tempMax: jsonResponse2.main.temp_max,
                humidity: jsonResponse2.main.humidity,
                feelsLike: jsonResponse2.main.feels_like,
                weather: jsonResponse2.weather[0].description,
            }
            return result;
        } catch(err){
            throw err;
        }
    }

    let handleInputChange = (evt) => {
        setCity(evt.target.value);
    }

    let handleSubmit = async (evt) => {
        try{
            evt.preventDefault();
            setCity("");
            let newInfo = await getWeather();
            updateInfo(newInfo)
        } catch(err){
            setError(true);
        }
    }
    return(
        <div className='SearchBox'>
            <h3>Search for the weather</h3>
            <form onSubmit={handleSubmit}>
                <TextField value={city} onChange={handleInputChange} id="city" label="City Name" variant="outlined" />
                <br /><br />
                <Button type='submit' variant="contained">Search</Button>
                {error && <p style={{color: "red"}}>No such place exists</p>}
            </form>
        </div>
    )
}