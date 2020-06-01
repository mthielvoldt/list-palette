import React, { useState, useEffect } from "react";

function NavBar({ user }) {

  const signInUp = (
    <>
      <button className="btn btn-success mx-1 my-2 my-sm-0" type="submit">Sign in</button>
      <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Sign up</button>
    </>
  );

  const Account = (
    <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Rileyt</button>
  );


  return (
    <header>
      <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <a className="navbar-brand" href="#">List Palette</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">About</a>
            </li>
          </ul>
          {(user !== null) ? Account : signInUp }
        </div>
      </nav>
    </header>

  );
}
export default NavBar;
