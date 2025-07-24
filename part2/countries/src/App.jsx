import { useState, useEffect } from 'react'
import axios from 'axios'

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
      <p>find countiees <input value={filter} onChange={handleFilterChange} /></p>
      <DisplayCountries countries={countries} filter={filter}/>
    </div>
  )
}

export default App
