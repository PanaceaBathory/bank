import logo from './logo.svg';
import './App.css';
import React from 'react';

const DEFAULT_TRANSACTIONS = [

]
function TransactTable({ transactions, onDelete }) {

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Description</th>
          <th>Amount</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map(t => (
          <tr key={t.id}>
            <td>{t.id}</td>
            <td>{t.description}</td>
            <td>{t.amount}</td>
            <td><button onClick={() => {
              onDelete(t.id)
            }}>Delete</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
class TransactForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { description: '', amount: 0 }
  }

  handleSubmit = e => {
    e.preventDefault()
    this.setState({ description: '', amount: 0 })
    if (!this.props.onSubmit) return
    this.props.onSubmit(this.state)
  }
  handleChange = e => {
    const value = e.target.type === 'number' ? e.target.valueAsNumber : e.target.value
    this.setState({ [e.target.name]: value })
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label>Description</label>
          <input name='description' autoComplete='off'
            vaue={this.state.description}
            onChange={this.handleChange} />
        </div>
        <div>
          <label>Amount</label>
          <input name='amount' type='number' autoComplete='off'
            value={this.state.amount}
            onChange={this.handleChange} />
        </div>
        <button type='submit'>Submit</button>
      </form>
    )
  }
}

function Account() {
  const [transactions, setTransactions] = React.useState(DEFAULT_TRANSACTIONS)
  const total = React.useMemo(() => transactions.reduce((a, b) => a + b.amount, 0), [transactions])
  React.useEffect(() => {
    fetch('http://127.0.0.1:5000/')
      .then(res => res.json())
      .then(data => setTransactions(Object.values(data)))
  }, [])

  const addTransaction = React.useCallback((t) => {

    fetch('http://127.0.0.1:5000/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'

      },
      body: JSON.stringify(t)
    })
      .then(res => res.json())
      .then(data => setTransactions([...transactions, data]))
      ;

  }, [transactions])

  const removeTransaction = React.useCallback((t) => {
    fetch('http://127.0.0.1:5000/' + t, {
      method: 'DELETE',
      headers: {

      },

    })
      .then(() => {
        setTransactions(transactions.filter((e) => { return e.id !== t }))
      })
  }, [transactions])
  return (
    <div>
      Total: {total}
      <TransactTable transactions={transactions} onDelete={removeTransaction} />
      <TransactForm onSubmit={addTransaction} />
    </div>
  )
}
export default Account;