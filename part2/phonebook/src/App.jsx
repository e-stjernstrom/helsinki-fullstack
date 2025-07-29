import { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'

const Notification = ({message, isError}) => {
  if (!message) return null

  return (
    <div className={`notification ${isError === true ? 'error' : 'success'}`}>
      {message}
    </div>
  )
}

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

const Person = ({ person, toggleDelete }) => {
  return (
    <li>
      {person.name} {person.number}
      <button onClick={toggleDelete}>delete</button>
    </li>
  )
}

const Persons = ({ persons, toggleDelete }) => {
  if (!persons) {
    return ''
  }
  return (
    <ul>
      {persons.map(person => (
        <Person
          key={person.id}
          person={person}
          toggleDelete={() => toggleDelete(person.id)}
        />
      ))}
    </ul>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [filter, setFilter] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [notification, setNotification] = useState('')
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const showNotification = (message, isError = false) => {
    setNotification(message)
    setIsError(isError)

    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const toggleDeleteOf = (id) => {
    const person = persons.find(person => person.id === id)
    if (!person) return
    const confirm = window.confirm(`Delete ${person.name}?`)
    if (!confirm) return

    personService
      .del(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
        showNotification(`Deleted ${person.name}`)
      })
      .catch(error => {
        showNotification(`Information of ${person.name} has already been removed from server`, true)
        setPersons(persons.filter(person => person.id !== id))
      })
  }

  const personsToshow = 
    filter === ('') 
      ? persons 
      : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  const addNewPerson = (event) => {
    event.preventDefault()
    // trap: don't say id: persons.length + 1 as it may cause issues when support delete
    // just let server to generate ids.
    const newPerson = { name: newName, number: newNumber}
    // const isDuplicateName = persons.some(person => person.name === newName)
    const duplicatedPerson = persons.find(person => person.name === newName)
    
    if (duplicatedPerson) {
      // alert(`${newName} is already added to phonebook`)
      const confirm = 
        window.confirm(`${duplicatedPerson.name} is already added to phonebook, replace the old number with a new one?`)
      if (confirm) {
        personService
          .update(duplicatedPerson.id, newPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id === duplicatedPerson.id ? returnedPerson : person))
            showNotification(`Updated ${returnedPerson.name}`)
          })
      }
    } else {
      personService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          showNotification(`Added ${returnedPerson.name}`)
        })
    }

    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <Notification message={notification} isError={isError}/>
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
      <Persons persons={personsToshow} toggleDelete={toggleDeleteOf}/>
    </div>
  )
}

export default App