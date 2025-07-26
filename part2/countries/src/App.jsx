import { useState, useEffect } from 'react'
import axios from 'axios'

const CityWeather = ({ city }) => {
  const api_key = import.meta.env.VITE_WEATHER_KEY
  const [weather, setWeather] = useState(null)

  const kelvinToCelsius = (kelvin) => ((kelvin - 273.15).toFixed(1))

  useEffect(() => {
    axios
      .get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${api_key}`)
      .then(resGeo => {
        const lat = resGeo.data[0].lat
        const lon = resGeo.data[0].lon
        return(axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`))
      })
      .then(resWeather => {
        setWeather(resWeather.data)
      })
  }, [city])

  if (!weather) {
    return null
  }

  return (
    <div>
      <h3>Weather in {city}</h3>
      <p>Temperature {kelvinToCelsius(weather.main.temp)} Celsius</p>
      <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description} />
      <p>Wind {weather.wind.speed} m/s</p>
    </div>
  )
}

const ShowCountry = ({ country }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>
        Capital {country.capital
        ? country.capital.map(capital => (
          <span key={capital}>{capital} </span>
        ))
        : 'N/A'}
      </p>
      <p>Area {country.area}</p>
      <h3>Languages</h3>
      <ul>
        {country.languages
          ? Object.values(country.languages).map(language => (
            <li key={language}>{language}</li>
          ))
          : <li>N/A</li>}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt} />
      {country.capital
        ? country.capital.map(capital => (
          <CityWeather key={capital} city={capital} />
        ))
        : <CityWeather city={country.name.common} />}
    </div>
  )
}

const CountryRow = ({ country }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div key={country.name.official}>
      {country.name.common} <button onClick={() => setExpanded(!expanded)}>{expanded ? 'Hide' : 'Show'}</button>
      {expanded && <ShowCountry country={country} />}
    </div>
  )
}

const DisplayCountries = ({ countries, filter }) => {
  const filtered = countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))

  if (filtered.length > 10) {
    return (<div>Too many matches, specify another filter</div>)
  }

  if (filtered.length === 1) {
    return (<ShowCountry country={filtered[0]} />)
  }

  return (
    <div>
      {filtered.map(country => (
        <CountryRow key={country.name.official} country={country}/>
      ))}
    </div>
  )
}

function App() {
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState([])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])
  

  return (
    <div>
      <p>find countries <input value={filter} onChange={handleFilterChange} /></p>
      <DisplayCountries countries={countries} filter={filter}/>
    </div>
  )
}

export default App
