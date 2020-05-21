import React, { useState } from "react";
import AddItemForm from "../AddItemForm/AddItemForm";
import List from "../List/List";
import mockQuery from '../data.js'
import './App.css';

let nextId = mockQuery.reduce( (accum, current) => 
  ((current.id > accum) ? current.id : accum), 0);
console.log("nextID:", nextId);

let initialState = [];
mockQuery.forEach((elem, index) => {initialState[elem.id] = elem});
console.log(initialState);

function App() {
  const [items, setItems] = useState(initialState);

  function addItem(newText) {
    let newItem = { id: ++nextId, text: newText, children: [] };
    setItems(prevItems => [...prevItems, newItem]);
  }

  function deleteItem(id) {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  }

  function moveItem(source, dest) {
    console.log("reOrder: src: %d dest: %d", source, dest);
    const newItems = [...items];
    //newItems.splice(source, 1); // remove source from array;
    newItems.splice(dest, 0, items[source]);
    console.log(newItems);

    setItems(newItems);
  }

  return (
    <div className="container">
      <div className="heading">
        <h1>To-Do List</h1>
      </div>
      <AddItemForm callback={addItem} />
      <List items={items} index={items[0].child} deleteCB={deleteItem} moveCB={moveItem} />
    </div>
  );
}

export default App;

