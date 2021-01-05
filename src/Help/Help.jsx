import React from 'react';

function Help() {
  return (
    <>
      <p>ListPalette is a place where you can organize lists and mix them together.  You can:</p>
      <ul>
        <li>Drag items to re-order them.</li>
        <li>Expand <img src="icons/expand-icon.svg" height="24" className="mx-1" alt="expand icon"/> an item to view sub-items</li>
        <li>Open <img src="icons/focus-icon.svg" height="24" className="mx-1" alt="focus icon"/> an item to add sub-items.</li>
        <li>Merge items by dragging one into another's dropzone<img src="icons/merge-icon.svg" height="24" className="mx-1" alt="merge icon"/></li>
      </ul>
      <p>Feel free to edit the example.  To save your work, sign up for a free account.</p>
    </>
  );
}
export default Help;