import React, { useState } from "react";
import AddItemForm from "../AddItemForm/AddItemForm";
import List from "../List/List";
import mockQuery, { toSparseDoubleLink } from '../data.js'
import './App.css';

const initialState = toSparseDoubleLink(mockQuery);

function App() {
  const [items, setItems] = useState(initialState);

  // Adds an item at the beginning of the root list
  function addItem(text, parent) {
    console.log("Add item - parent: %s  text: %s", parent, text);
    setItems(prevItems => {
      let newItem = {
        id: prevItems.length,
        next: prevItems[parent].child,
        child: null,
        previous: null,
        parent: parent,
        text: text
      };

      // make next sibling point to this as its previous. 
      prevItems[prevItems[parent].child].previous = newItem.id;

      // make parent point to this as its child. 
      prevItems[parent].child = newItem.id; // DB


      return prevItems.concat(newItem);
    });
    // DB: Create new row for new Item. 
    // DB: update parent's child link  (DB doesn't need reverse link updated)
  }

  function connectItem(item, dest, items, relation) {

    if (relation === "before") {
      item.previous = dest.previous;
      item.parent = dest.parent;
      item.next = dest.id;

      // handle connection above item
      if (dest.previous === null) {
        items[dest.parent].child = item.id;
      } else {  // dest was not first item
        items[dest.previous].next = item.id;
      }
      dest.previous = item.id;

    } else {
      // assume we meant the item to come immediately after dest. 
      item.previous = dest.id;
      item.parent = dest.parent;
      item.next = dest.next;

      if (dest.next != null ) {
        items[dest.next].previous = item.id;
      }
      dest.next = item.id;
    }
    return items;
  }

  // Take the identified item out of the flow by patching the links 
  // to cut it out. 
  function disconnectItem(item, newItems) {
    // is the item the first in its list? 
    // then we have to make its parent point to it's next sibling
    if (item.previous === null) {
      newItems[item.parent].child = item.next;
    } else {
      newItems[item.previous].next = item.next;
    }
    // Patch reverse link
    if (item.next !== null) {
      newItems[item.next].previous = item.previous;
      newItems[item.next].parent = item.parent;
    }
    return newItems;
  }

  function deleteItem(item) {
    console.log("Delete item:", item);
    setItems(items => {
      // we can't mutate the original array, so we copy the whole damn thing first (Hate this)
      // Note: we don't need to actually remove the item in the front-end, so we don't.
      let newItems = items.concat();
      return disconnectItem(item, newItems);
    });
    // DB operations: 
    // - edit either parent or previous sibling's link. 
    // - remove the row for this item. 
  }

  function moveItem(source, dest, relation) {
    console.log("reOrder: src: %d dest: %d", source, dest);

    setItems(prevItems => {
      let newItems = prevItems.concat();

      // cut the item out if it's old position.  
      // do this first because connectItem() clobbers source links. 
      disconnectItem(newItems[source], newItems);
      // re-link to place source item in new position. 
      connectItem(newItems[source], newItems[dest], newItems, relation);
      return newItems;
    });

  }

  return (
    <div className="container">
      <div className="heading">
        <h1>To-Do List</h1>
      </div>
      <AddItemForm callback={addItem} />
      <List
        items={items}
        index={items[0].child}
        position="0"
        deleteCB={deleteItem}
        moveCB={moveItem}
      />
    </div>
  );
}

export default App;

