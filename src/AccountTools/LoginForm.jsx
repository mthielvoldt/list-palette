import React, { useState } from 'react';
import axios from 'axios';


function LoginForm({ loginSuccessCB }) {
  const [state, setState] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    const { id, value } = e.target
    setState(prevState => ({
      ...prevState,
      [id]: value
    }))
  }
  const handleSubmitClick = (e) => {
    e.preventDefault();
    axios.post('/login', state)
      .then(res => {
        if (res.status === 200) {
          loginSuccessCB();
        } else {
          console.log("Problem signing in. ");
        }
      })
  }

  return (
    <form>
      <div className="form-group text-left">
        <label htmlFor="username">Email address</label>
        <input type="email"
          className="form-control"
          id="username"
          value={state.username}
          onChange={handleChange}
          placeholder="you@example.com"
          autoFocus />
      </div>
      <div className="form-group text-left">
        <label htmlFor="password">Password</label>
        <input type="password"
          className="form-control"
          id="password"
          value={state.password}
          onChange={handleChange} />
      </div>
      <button
        type="submit"
        className="btn btn-primary"
        onClick={handleSubmitClick} >
        Sign in
        </button>
    </form>
  );
}

export default LoginForm;