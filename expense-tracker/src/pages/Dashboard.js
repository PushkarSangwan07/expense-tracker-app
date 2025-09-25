import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard({ expenses }) {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const navigate = useNavigate();
  const [animatedValues, setAnimatedValues] = useState({
    balance: 0,
    income: 0,
    expenses: 0
  });

  const totalIncome = expenses
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = expenses
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  useEffect(() => {
    const animateValues = () => {
      setAnimatedValues({
        balance: balance,
        income: totalIncome,
        expenses: totalExpenses
      });
    };
    
    requestAnimationFrame(animateValues);
  }, [balance, totalIncome, totalExpenses]);

  const recentTransactions = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const handleAddTransaction = () => {
    navigate("/expense");
  };

  const handleViewAll = ()=>{
    navigate("/result")
  }

  return (
    <div className="dashboard-container">
      {!isAuthenticated ? (
        <div className="login-section">
          <h2>Welcome to Expense Tracker</h2>
          <button onClick={loginWithRedirect} className="login-btn">
            Sign In
          </button>
        </div>
      ) : (
        <>
          <div className="dashboard-header">
            <div className="header-user">
              <h2>Welcome, {user.name || "User"} 👋</h2>
              <p>Here's your financial overview</p>
            </div>
            <div className="header-actions">
              <button 
                className="btn-primary add-transaction-btn"
                onClick={handleAddTransaction}
              >
                <span className="btn-icon">+</span>
                Add Transaction
              </button>
              <button
                onClick={() => logout({ returnTo: window.location.origin })}
                className="logout-btn"
              >
                <span className="btn-icon">→</span>
                Logout
              </button>
            </div>
          </div>

          <div className="summary-grid">
            <div className="summary-card income">
              <div className="card-icon">💰</div>
              <div className="card-content">
                <h3>Total Income</h3>
                <p>₹{animatedValues.income.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="summary-card expense">
              <div className="card-icon">💸</div>
              <div className="card-content">
                <h3>Total Expenses</h3>
                <p>₹{animatedValues.expenses.toFixed(2)}</p>
              </div>
            </div>
            
            <div className={`summary-card balance ${balance < 0 ? 'negative' : ''}`}>
              <div className="card-icon">{balance >= 0 ? "📈" : "📉"}</div>
              <div className="card-content">
                <h3>Net Balance</h3>
                <p>₹{animatedValues.balance.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="recent-transactions">
            <div className="section-header">
              <h3>Recent Transactions</h3>
              {recentTransactions.length > 0 && (
                <span className="view-all" onClick={handleViewAll} >View All →</span>
              )}
            </div>
            
            {recentTransactions.length === 0 ? (
              <div className="empty-state">
                <p>No transactions yet</p>
                <button 
                  className="btn-primary"
                  onClick={handleAddTransaction}
                >
                  Add Your First Transaction
                </button>
              </div>
            ) : (
              <div className="transactions-list">
                {recentTransactions.map((t) => (
                  <div key={t.id} className="transaction-item">
                    <div className={`transaction-type ${t.type.toLowerCase()}`}>
                      {t.type === "Income" ? "⬆️" : "⬇️"}
                    </div>
                    <div className="transaction-details">
                      <h4>{t.title}</h4>
                      <p>{t.category}</p>
                    </div>
                    <div className={`transaction-amount ${t.type.toLowerCase()}`}>
                      {t.type === "Income" ? "+" : "-"}₹{t.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;


