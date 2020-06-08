import React from 'react';

function ClickableIcon({ type, onClick }) {

  return (
    <img src={'/icons/'+type +'-icon.svg'} alt={type+" icon"} className="icon"
      onClick={onClick}/>
  );
}

export default ClickableIcon;
