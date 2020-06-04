import React from 'react';

function AccountMenu({logOutCB}) {
  return (
    <span>
      <button className="btn btn-primary" onClick={logOutCB}>Sign off</button>
    </span>
    
  );
}
export default AccountMenu;