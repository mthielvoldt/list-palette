import React, { useState } from "react";
import AddItemForm from "../AddItemForm/AddItemForm";
import List from "../List/List";
import startingState from '../data.js'
import './App.css';

let nextId = startingState.reduce( (accum, current) => 
  ((current.id > accum) ? current.id : accum), 0);
console.log("nextID:", nextId);

function App() {
  const [items, setItems] = useState(startingState);

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
      <List items={items} deleteCB={deleteItem} moveCB={moveItem} />
    </div>
  );
}

export default App;

