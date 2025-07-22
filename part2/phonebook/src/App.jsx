import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'

const Filter = ({ filter, onFilterChange }) => (
  <div>
    filter shown with <input value={filter} onChange={onFilterChange} />
  </div>
)

const PersonForm = ({ onSubmit, newName, newNumber, onNameChange, onNumberChange }) => (
  <form onSubmit={onSubmit}>
    <div>name: <input value={newName} onChange={onNameChange} /></div>
    <div>number: <input value={newNumber} onChange={onNumberChange} /></div>
    <div><button type="submit">add</button></div>
  </form>
)

const Persons = ({ persons }) => {
  return (
    <ul>
      {persons.map(person => <li key={person.id}>{person.name} {person.number}</li>)}
    </ul>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [filter, setFilter] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const personsToshow = 
    filter === ('') 
      ? persons 
      : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  const addNewPerson = (event) => {
    event.preventDefault()
    const newPerson = { name: newName, number: newNumber, id: persons.length + 1 }
    const isDuplicateName = persons.some(person => person.name === newName)
    
    if (isDuplicateName) {
      alert(`${newName} is already added to phonebook`)
    } else {
      personService
        .create(newPerson)
        .then(response => {
          setPersons(persons.concat(response.data))
        })
    }

    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} onFilterChange={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm
        onSubmit={addNewPerson}
        newName={newName}
        newNumber={newNumber}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons persons={personsToshow} />
    </div>
  )
}

export default App