import React, { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import Dashboard from './pages/Dashboard';
import Expense from './pages/Expense';
import Navbar from './component/Navbar';
import Result from './pages/Result';
import LoginButton from './pages/Login';

function App() {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const [expenses, setExpenses] = useState([]);

  const storageKey = user ? `expenses_${user.sub}` : null;

  useEffect(() => {
    const loadExpenses = async () => {
      if (!isAuthenticated) {
        setExpenses([]);
        return;
      }

      const cachedData = storageKey && localStorage.getItem(storageKey);
      if (cachedData) {
        setExpenses(JSON.parse(cachedData));
      }

      try {
        const token = await getAccessTokenSilently({
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        });

        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/expenses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Fetch status:', res.status);
        const responseText = await res.text();
        console.log('Response text:', responseText);

        if (!res.ok) throw new Error('Failed to fetch expenses');
        const data = JSON.parse(responseText);
        setExpenses(data.data || []);
        if (storageKey) localStorage.setItem(storageKey, JSON.stringify(data.data || []));
      } catch (err) {
        console.error('Error fetching expenses:', err.message);
        alert('Failed to fetch expenses. Please try again later.');
      }
    };

    loadExpenses();
  }, [isAuthenticated, user, getAccessTokenSilently, storageKey]);

  useEffect(() => {
    if (storageKey && expenses.length > 0) {
      const cachedData = localStorage.getItem(storageKey);
      const newExpensesData = JSON.stringify(expenses);
      if (cachedData !== newExpensesData) {
        localStorage.setItem(storageKey, newExpensesData);
      }
    }
  }, [expenses, storageKey]);

  const handleDeleteLocal = (id) => {
    setExpenses(prev => prev.filter(item => item._id !== id && item.id !== id));
  };

  const addExpense = (newExpense) => {
    if (!newExpense || !newExpense.title || !newExpense.amount) {
      alert('Invalid expense data');
      return;
    }
    setExpenses(prev => [...prev, newExpense]);
  };

  return (
    <>
      {isAuthenticated && <Navbar />}

      <div className='div-container'>
        <Routes>
          <Route path='/' element={<LoginButton />} />
          <Route path='/dashboard' element={<Dashboard expenses={expenses} />} />
          <Route path='/expense' element={<Expense addExpense={addExpense} />} />
          <Route path='/result' element={<Result expenses={expenses} onDelete={handleDeleteLocal} />} />
        </Routes>
      </div>
    </>
  );
}

export default App;





