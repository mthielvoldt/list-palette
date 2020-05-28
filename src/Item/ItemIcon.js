import React from 'react';

function ItemIcon({ type, onDrop, onClick }) {

  return (
    <img src={'/icons/'+type +'-icon.svg'} alt={type+" icon"} className="icon"
      onClick={onClick}
      onDrop={onDrop} />
  );
}

export default ItemIcon;
