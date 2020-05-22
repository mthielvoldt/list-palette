import React, { useState } from "react";
import AddItemForm from "../AddItemForm/AddItemForm";
import List from "../List/List";
import mockQuery, {toSparseDoubleLink} from '../data.js'
import './App.css';

const initialState = toSparseDoubleLink(mockQuery);

function App() {
  const [items, setItems] = useState(initialState);

  // Adds an item at the beginning of the root list
  function addItem(text, parent) {
    console.log("Add item - parent: %s  text: %s", parent, text);
    setItems(prevItems => {
      let newItem = { id: prevItems.length, next: prevItems[parent].child, child: null, text: text };
      prevItems[parent].child = prevItems.length;
      return prevItems.concat(newItem);
    });
    
    // DB: Create new row for new Item. 
    // DB: update parent's child link 
  }

  function deleteItem(id, parent, previous) {
    console.log("Delete item - id: %d  parent: %d  previous: %d", id, parent, previous );
    setItems(prevItems => {
      
      // we can't mutate the original array, so we copy the whole damn thing first (Hate this)
      // Note: we don't need to actually remove the item in the front-end, so we don't.
      let newItems = prevItems.concat();

      // first we manage the links. 
      // is the item the first in its list? 
      // then we have to make its parent point to it's next sibling
      if (previous == null) {
        newItems[parent].child = prevItems[id].next;
      } else {
        newItems[previous].next = prevItems[id].next;
      }
      return newItems;
    });
    // DB operations: 
    // - edit either parent or previous sibling's link. 
    // - remove the row for this item. 
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
      <List items={items} index={items[0].child} parent="0" deleteCB={deleteItem} moveCB={moveItem} />
    </div>
  );
}

export default App;

