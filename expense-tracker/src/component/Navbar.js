import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">💰 Expense Tracker</div>
      <ul className="nav-links">
        <li>
          <NavLink to="/" end> Dashboard </NavLink>
        </li>
        <li>
          <NavLink to="/expense"> Expense  </NavLink>
        </li>
        <li>
          <NavLink to="/result">  Result </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
