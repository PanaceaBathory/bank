import logo from './logo.svg';
import './App.css';
import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};



const DEFAULT_TRANSACTIONS = [

]
const DEFAULT_MODAL = {
  state: false,
  id: ''
}
function TransactTable({ transactions, onDelete, onModal }) {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Delete</th>
            <th>Edit</th>
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
              <td><button onClick={() => {
                onModal({ id: t.id, state: true })
              }}>Edit</button></td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
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
function EditModal({ info, setModal, updateTable }) {
  const editFetch = React.useCallback((t) => {
    fetch('http://127.0.0.1:5000/' + info.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'

      },
      body: JSON.stringify(t)
    })
      .then(res => res.json())
      .then(data => updateTable(data))
      .then(() => {
        setModal({ id: '', state: false })
      })
  }, [setModal, info.id])


  return (
    <div>
      <Modal
        open={info.state}
        onClose={() => {
          setModal({ id: '', state: false })
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TransactForm onSubmit={editFetch} />
        </Box>
      </Modal>
    </div>
  );
}

function Account() {
  const [transactions, setTransactions] = React.useState(DEFAULT_TRANSACTIONS)
  const [modalState, setModalState] = React.useState(DEFAULT_MODAL)
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
  const modalMod = React.useCallback((t) => {
    setModalState(t)
  }, [])

  const updateEntries = React.useCallback((t) => {
    const ntransaction = [...transactions]
    const index = transactions.findIndex((e) =>
      e.id === t.id
    )
    ntransaction[index] = t
    setTransactions(ntransaction)
  })
  return (
    <div>
      Total: {total}
      <TransactTable transactions={transactions} onDelete={removeTransaction} onModal={modalMod} />
      <TransactForm onSubmit={addTransaction} />
      <EditModal info={modalState} setModal={modalMod} updateTable={updateEntries} />
    </div>
  )
}
export default Account;