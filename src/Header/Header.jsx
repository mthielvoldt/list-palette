import React, { useState } from 'react';
import Dropdown from './Dropdown';
import RegisterForm from '../AccountTools/RegisterForm';
import LoginForm from '../AccountTools/LoginForm';
import AccountMenu from '../AccountTools/AccountMenu';

function NavBar({ user, loadItemsCB, logOutCB, saveAllItemsCB }) {
  const [viewState, setViewState] = useState("none");

  function loginSuccess() {
    setViewState("none");
    loadItemsCB();
  }
  function logOut() {
    setViewState("none");
    logOutCB();
  }
  function onRegisterSuccess(name) {
    setViewState("none");
    saveAllItemsCB(name);
  }

  function clearViewState(e) { setViewState('none') }

  const signInUp = (
    <>
      <button className="btn btn-success mx-1 my-2 my-sm-0" onClick={e => setViewState("login")}>Sign in</button>
      <button className="btn btn-outline-success my-2 my-sm-0" onClick={e => setViewState("register")}>Sign up</button>
    </>
  );

  const Account = (
    <div className="navbar-nav">
      <button className="nav-link mr-1" onClick={e=>{setViewState("userd")}}>{user}</button>
      <button className="btn btn-secondary my-2 my-sm-0" onClick={logOut}>Sign out</button>
    </div>
  );


  return (
    <header className="fixed-top">
      <nav className="navbar navbar-expand-md navbar-dark bg-dark">
        <a className="navbar-brand" href="/">List Palette</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item" >
              <button className="nav-link" onClick={e => { setViewState("about") }}>About</button>
            </li>
          </ul>
          {(user !== null) ? Account : signInUp}
        </div>
      </nav>
      {(viewState === "user") &&
        <Dropdown align="right" closeCB={clearViewState} >
          <AccountMenu logOutCB={logOut} />
        </Dropdown>
      }
      {(viewState === "register") &&
        <Dropdown align="right" closeCB={clearViewState} >
          <RegisterForm onRegisterSuccess={onRegisterSuccess}/>
        </Dropdown>
      }
      {(viewState === "login") &&
        <Dropdown align="right" closeCB={clearViewState}>
          <LoginForm loginSuccessCB={loginSuccess} />
        </Dropdown>
      }
      {(viewState === "about") &&
        <Dropdown align="left" closeCB={clearViewState}>
          <p>ListPalette is a place where you can organize lists and mix them together.  You can:</p>
          <ul>
            <li>Drag items to re-order them.</li>
            <li>Expand items to view sub-items</li>
            <li>Open an item to add sub-items.</li>
            <li>Merge items by dragging one into another's dropzone</li>
          </ul>
          <p>Feel free to edit the example lists.  To save your work for later, sign up for an account.</p>
        </Dropdown>
      }
    </header>

  );
}
export default NavBar;
