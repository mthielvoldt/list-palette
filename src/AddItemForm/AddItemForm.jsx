import React, { useState } from "react";
import './AddItemForm.css';

function AddItemForm({ editState }) {
  const [inputText, setInputText] = useState("");

  function handleChange(event) {
    const newValue = event.target.value;
    setInputText(newValue);
  }

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      addItem();
    }
  }

  // calls parent function that adds item to the list, passing the newly entered text.
  function addItem() {
    if (inputText === "") return;
    editState({type: "ADD_ITEM", data: inputText});
    setInputText("");
  }

  return (
    <div className="form">
      <input 
        onChange={handleChange} 
        onKeyPress={handleKeyPress}
        type="text" 
        value={inputText} />
      <button onClick={addItem}>
        <span className="add-span">Add</span>
      </button>
    </div>
  );
}
export default AddItemForm;
