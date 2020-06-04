import React, { useState } from 'react';
import axios from 'axios';


function RegisterForm({ onRegisterSuccess }) {
  const [state, setState] = useState({ name: "", email: "", password: "", confirmPassword: "", error: "" });

  const handleChange = (e) => {
    const { id, value } = e.target;

    // if there had been a non-matching password error, clear it when user begins to correct problem
    if (id === "password" || id === "confirmPassword") {
      setState({ ...state, [id]: value, error: "" })
    } else {
      setState({ ...state, [id]: value });
    }
  }
  const handleSubmitClick = (e) => {
    e.preventDefault();
    if (state.password === state.confirmPassword) {
      axios.post('/register', state)
      .then(res => {onRegisterSuccess(res.data.name);})
      .catch( err => {
        console.error(err);
        setState({...state, error: err.response.data })
      });
    } else {
      setState({ ...state, password: "", confirmPassword: "", error: "Passwords do not match" });
    }
  }

  return (
    <form>
      <div className="form-group text-left">
        <label htmlFor="name">Name</label>
        <input type="text"
          className="form-control"
          id="name"
          value={state.name}
          onChange={handleChange}
          placeholder="Enter Name"
          aria-describedby="nameHelp"
          autoFocus />
      </div>
      <div className="form-group text-left">
        <label htmlFor="email1">Email address</label>
        <input type="email"
          className="form-control"
          id="email"
          value={state.email}
          onChange={handleChange}
          placeholder="Enter email"
          aria-describedby="emailHelp" />
        <small id="emailHelp" className="form-text text-muted">We'll never share your email.</small>
      </div>
      <div className="form-group text-left">
        <label htmlFor="password">Password</label>
        <input type="password"
          className="form-control"
          id="password"
          value={state.password}
          onChange={handleChange}
          placeholder="Password" />
      </div>
      <div className="form-group text-left">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input type="password"
          className="form-control"
          id="confirmPassword"
          value={state.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password" />
      </div>
      {(state.error) &&
        <div class="alert alert-danger" role="alert">
          {state.error}
        </div>
      }
      <button
        type="submit"
        className="btn btn-primary"
        onClick={handleSubmitClick} >
        Register
        </button>
    </form>
  );
}

export default RegisterForm;