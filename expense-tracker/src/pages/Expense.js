import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import './Expense.css';

function Expense({ addExpense }) {
  const [type, setType] = useState('Expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !amount || !category || !date) {
      alert('Please fill in all required fields.');
      return;
    }

    try {

      const token = await getAccessTokenSilently({
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      });

      const expenseData = {
        type,
        title,
        amount: parseFloat(amount),
        category,
        date,
        notes,
      };

    
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(expenseData),
      });
      

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add expense');
      }

      
      addExpense(data.data);

      
      setType('Expense');
      setTitle('');
      setAmount('');
      setCategory('');
      setDate('');
      setNotes('');

      navigate('/result');
    } catch (error) {
      
      alert(`Error adding expense: ${error.message}`);
    }
  };

  return (
    <div className="expense-container">
      <h2>Add Transaction</h2>
      <form onSubmit={handleSubmit} className="expense-form">
        <label>Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)} required>
          <option value="Expense">Expense</option>
          <option value="Income">Income</option>
        </select>

        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Grocery shopping or Salary"
          required
        />

        <label>Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g., 50"
          required
        />

        <label>Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">-- Select Category --</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Shopping">Shopping</option>
          <option value="Bills">Bills</option>
          <option value="Income">Income</option>
          <option value="Other">Other</option>
        </select>

        <label>Date*</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <label>Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes..."
        />

        <button type="submit">Add Transaction</button>
      </form>
    </div>
  );
}

export default Expense;




