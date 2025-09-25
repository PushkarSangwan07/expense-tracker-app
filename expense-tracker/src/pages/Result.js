import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./Result.css";

function Result({ expenses, onDelete }) {
  const { getAccessTokenSilently } = useAuth0();

  const categoryTotals = expenses
    .filter((item) => item.type === "Expense")
    .reduce((acc, curr) => {
      const key = curr.category || "Other";
      acc[key] = (acc[key] || 0) + Number(curr.amount || 0);
      return acc;
    }, {});

  const pieData = Object.entries(categoryTotals).map(([category, total]) => ({
    name: category,
    value: total,
  }));

  const handleDelete = async (id) => {
    try {
      const token = await getAccessTokenSilently({
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      });
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/expenses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      onDelete(id);
    } catch (err) {
      console.error(err);
      alert("Error deleting expense.");
    }
  };

  const getId = (item) => item._id || item.id;

  const getCardClass = (name) => {
    switch (name) {
      case "Food": return "food-card";
      case "Travel": return "travel-card";
      case "Shopping": return "shopping-card";
      case "Entertainment": return "entertainment-card";
      default: return "other-card";
    }
  };

  const getEmoji = (name) => {
    switch (name) {
      case "Food": return "🍔";
      case "Transport": return "✈️";
      case "Shopping": return "🛍️";
      case "Bills" : return"🧾"
      default: return "📌";
    }
  };

  return (
    <div className="result-container">
      <h2>Expenses by Category</h2>
      {pieData.length === 0 ? (
        <p>No expenses recorded.</p>
      ) : (
        <div className="category-grid">
          {pieData.map(({ name, value }, i) => (
            <div key={i} className={`category-card ${getCardClass(name)}`}>
              <span className="category-icon">{getEmoji(name)}</span>
              <h4>{name}</h4>
              <p>₹{value.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}

      <h2 style={{ marginTop: "2rem" }}>All Transactions</h2>
      {expenses.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Title</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Date</th>
              <th>Notes</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((item) => (
              <tr key={getId(item)}>
                <td className={item.type === "Income" ? "income" : "expense"}>
                  {item.type}
                </td>
                <td>{item.title}</td>
                <td>
                  {item.type === "Income" ? "+" : "-"}₹{Number(item.amount).toFixed(2)}
                </td>
                <td>{item.category}</td>
                <td>{String(item.date).slice(0, 10)}</td>
                <td>{item.notes || "-"}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(getId(item))}
                  >
                    ❌ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Result;





