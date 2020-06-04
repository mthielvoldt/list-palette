import React, { useEffect, useRef } from 'react';
import './Dropdown.css';

function Dropdown({align, closeCB, children}) {
  const node = useRef();  // for determining if subsequent mouse clicks occur on children. 

  // Add listener to detect all mouse clicks on page.  
  useEffect( () => {
    document.addEventListener("mousedown", handleFocusChange);
    return () => {
      document.removeEventListener("mousedown", handleFocusChange);
    }
    function handleFocusChange(e) {
      if (!node.current.contains(e.target)) {
        closeCB();
      }
    }
  }, [closeCB])


  return (
    <div ref={node} className="dropdown-row">
      <div className={`card col-12 col-lg-3 login-card py-3 hv-center float-${align}`}>
        {children}
      </div>
    </div>
  )
}

export default Dropdown;