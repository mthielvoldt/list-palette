import React, { useState } from "react";
import Location from "../Location/Location"
import AddItemForm from "../AddItemForm/AddItemForm";
import List from "../List/List";
import mockQuery, { toSparseDoubleLink } from '../data.js'
import './App.css';

const initialState = {
  items: toSparseDoubleLink(mockQuery),
  location: 0
};

function App() {
  const [state, setState] = useState(initialState);

  // Adds an item at the beginning of the root list
  function addItem(text) {
    console.log("Add item - parent: %s  text: %s", state.location, text);
    setState(prevState => {
      let prevItems = prevState.items;
      let newItem = {
        id: prevItems.length,
        text: text, 
        checked: false,
      };

      let newItems = prevItems.concat(newItem);

      connectItem(newItems[newItem.id], newItems[prevState.location], newItems, "child");

      return { items: newItems, location: prevState.location };
    });
    // DB: Create new row for new Item. 
    // DB: update parent's child link  (DB doesn't need reverse link updated)
  }

  function dupList(id) { 

    
    setState( prevState => {

      // Start with copying the root item
      let newItem  = {...prevState.items[id], id: prevState.items.length};
      let newItems = prevState.items.concat(newItem);


      connectItem(newItem, newItems[prevState.location] , newItems, "child");
      console.log("duplicate Item:", newItems, prevState.items);
      
      return {items: newItems, location: prevState.location};
    });
    
  }

  function connectItem(item, dest, items, relation) {

    switch (relation) {

    case "before":
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
      break;

    case "after":
      // assume we meant the item to come immediately after dest. 
      item.previous = dest.id;
      item.parent = dest.parent;
      item.next = dest.next;

      if (dest.next != null) {
        items[dest.next].previous = item.id;
      }
      dest.next = item.id;
      break;

    case "child":
      item.previous = null;
      item.parent = dest.id;
      item.next = dest.child;

      if (dest.child != null) {
        items[dest.child] = {...items[dest.child], previous: item.id};
      }
      items[dest.id] = {...dest, child: item.id};
      break;

    default:
      console.error("unspefified relationship to destination");
      return -1;
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
    setState(prevState => {
      // we can't mutate the original array, so we copy the whole damn thing first (Hate this)
      // Note: we don't need to actually remove the item in the front-end, so we don't.
      let newItems = prevState.items.concat();
      return { items: disconnectItem(item, newItems), location: prevState.location };
    });
    // DB operations: 
    // - edit either parent or previous sibling's link. 
    // - remove the row for this item. 
  }

  function moveItem(source, dest, relation) {
    console.log("reOrder: src: %d dest: %d", source, dest);

    setState(prevState => {
      let newItems = prevState.items.concat();

      // cut the item out if it's old position.  
      // do this first because connectItem() clobbers source links. 
      disconnectItem(newItems[source], newItems);
      // re-link to place source item in new position. 
      connectItem(newItems[source], newItems[dest], newItems, relation);
      return { items: newItems, location: prevState.location };
    });

  }

  function toggleItemChecked(id) {
    setState(prevState => {
      let newItem = {...prevState.items[id], checked: !prevState.items[id].checked };
      let newItems = prevState.items.concat();
      newItems[id] = newItem; 

      return { items: newItems, location: prevState.location };
    });
  }

  function setLocation(newLocation) {
    console.log(newLocation);
    setState(prevState => ({ ...prevState, location: newLocation }));
  }

  return (
    <div className="container">
      <div className="heading">
        <h1>ListPalette</h1>
      </div>
      <Location
        items={state.items}
        location={state.location}
        locateCB={setLocation} />
      <AddItemForm location={state.location} callback={addItem} />
      <List
        items={state.items}
        index={state.items[state.location].child}
        position="0"
        deleteCB={deleteItem}
        moveCB={moveItem}
        dupCB={dupList}
        locateCB={setLocation}
        toggleCB={toggleItemChecked}
      />
    </div>
  );
}

export default App;

