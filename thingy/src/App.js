import logo from './logo.svg';
import './App.css';
import React from 'react';

const DEFAULT_TRANSACTIONS = [
  
]
function TransactTable ({ transactions }){
  return(
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Description</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map(t =>(
          <tr key={t.id}>
            <td>{t.id}</td>
            <td>{t.description}</td>
            <td>{t.amount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
class TransactForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { description: '', amount: 0}
  }

  handleSubmit = e => {
    e.preventDefault()
    this.setState({description: '', amount: 0})
    if (!this.props.onSubmit) return
    this.props.onSubmit(this.state)
  }
  handleChange = e => {
    const value = e.target.type === 'number' ? e.target.valueAsNumber : e.target.value
    this.setState({[e.target.name]: value})
  }

  render(){
    return(
      <form onSubmit={this.handleSubmit}>
        <div>
          <label>Description</label>
          <input name='description' autocomplete='off'
          vaue={this.state.description}
          onChange={this.handleChange} />
        </div>
        <div>
          <label>Amount</label>
          <input name='amount' type='number' autocomplete='off'
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
  
 const addTransaction = React.useCallback((t) => {
   const id = Math.max(...transactions.map(t => t.id) + 0) + 1
   setTransactions([...transactions, {id, ...t}])
 }, [transactions])
  
  return (
    <div>
      Total: {total}
      <TransactTable transactions={transactions} />
      <TransactForm onSubmit={addTransaction} />
    </div>
  )
}
export default Account;