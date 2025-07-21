const Header = ({ course }) => {
  return(
    <div>
      <h1>{course.name}</h1>
    </div>
  )
}

const Part = ({ part }) => {
  return (
    <li>{part.name} {part.exercises}</li>
  )
}

const Content = ({ parts }) => {
  const content = parts.map(part => <Part key={part.id} part={part}/>)
  return(
    <ul>{content}</ul>
  )
}

const Total = ({ parts }) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0)
  return (
    <p><strong>total of {total} exercises</strong></p>
  )
}

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  return <Course course={course} />
}

export default App
