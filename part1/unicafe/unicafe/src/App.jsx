import { useState } from 'react'
const Button = (props) => (
  <button onClick={props.handleClick}>
  {props.text}
  </button>
)

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad
  const avg = (1 * good + 0 * neutral + (-1) * bad) / total
  const content = total !== 0
  ? (
    <table>
      <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={total} />
        <StatisticLine text="average" value={avg} />
        <StatisticLine text="positive" value={(good / total) * 100 + '%'} />
      </tbody>
    </table>
  ) : (<p>No feedback given</p>)
  return (
    <div>{content}</div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
    <h1>give feedback</h1>
    <Button text="good" handleClick={() => setGood(good + 1)}/>
    <Button text="neutral" handleClick={() => setNeutral(neutral + 1)}/>
    <Button text="bad" handleClick={() => setBad(bad + 1)}/>
    <h2>statistics</h2>
    <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
