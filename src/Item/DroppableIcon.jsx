import React from 'react';

function DroppableIcon({ type, onDrop }) {

  function handleDragOver(e) {
    if (e.preventDefault) e.preventDefault(); // Necessary. Allows us to drop.
    if (e.stopPropagation) e.stopPropagation();
    e.target.classList.add("icon-drag-over");
    return false;
  }
  function handleDragLeave(e) {
    if (e.stopPropagation) {
      e.stopPropagation(); // Stops some browsers from redirecting.
    }
    e.target.classList.remove("icon-drag-over");
  }

  return (
    <img src={'/icons/' + type + '-icon.svg'} alt={type + " icon"} className="icon"
      onDrop={onDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    />
  );
}

export default DroppableIcon;
