import React, { useState } from "react";
import Location from "../Location/Location"
import AddItemForm from "../AddItemForm/AddItemForm";
import List from "../List/List";
import mockQuery, { toSparseDoubleLink } from '../data.js'
import {dupHelper, mergeHelper, connectItem, disconnectItem} from './Helpers'
import './App.css';

const initialState = {
  items: toSparseDoubleLink(mockQuery),
  location: 0
};

function App() {
  const [state, setState] = useState(initialState);

  function editState({ type, data }) {
    console.log("Edit State - ", type, data);
    switch (type) {
      case 'ADD_ITEM':
        addItem(data);
        break;
      case 'MOVE_LIST':
        moveList(data.src, data.dest, data.relation);
        break;
      case 'DUPLICATE_LIST':
        dupList(data);
        break;
      case 'DELETE_LIST':
        deleteList(data);
        break;
      case 'TOGGLE_LIST_CHECKED':
        toggleListChecked(data);
        break;
      case 'MERGE_LISTS':
        mergeLists(data.src, data.dest);
        break;
      case 'SET_LOCATION':
        setLocation(data);
        break;
      default:
        console.error("Action type not specified.");
    }
  }

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

      connectItem(newItem.id, prevState.location, newItems, "child");

      return { items: newItems, location: prevState.location };
    });
    // DB: Create new row for new Item. 
    // DB: update parent's child link  (DB doesn't need reverse link updated)
  }

  function dupList(id) {
    setState(({ items, location }) => {
      let newItems = items.concat();

      dupHelper(id, location, newItems );

      console.log("duplicate Item:", newItems);

      return { items: newItems, location: location };
    });

  }

  function mergeLists(src, dest) {
    setState(({ items, location }) => {
      let newItems = items.concat();
      mergeHelper(src, dest, newItems);
      return { items: newItems, location: location };
    });
  }

  function deleteList(id) {
    setState(prevState => {
      // we can't mutate the original array, so we copy the whole damn thing first (Hate this)
      // Note: we don't need to actually remove the item in the front-end, so we don't.
      let newItems = prevState.items.concat();
      disconnectItem(id, newItems); // mutates newItems, but not embedded objects.
      return { items: newItems, location: prevState.location };
    });
    // DB operations: 
    // - edit either parent or previous sibling's link. 
    // - remove the row for this item. 
  }

  function moveList(src, dest, relation) {
    setState(prevState => {
      let newItems = prevState.items.concat();

      // cut the item out if it's old position.  
      // do this first because connectItem() clobbers source links. 
      disconnectItem(src, newItems);
      // re-link to place source item in new position. 
      connectItem(src, dest, newItems, relation);
      return { items: newItems, location: prevState.location };
    });
  }

  function toggleListChecked(id) {
    setState(prevState => {
      let newItem = { ...prevState.items[id], checked: !prevState.items[id].checked };
      let newItems = prevState.items.concat();
      newItems[id] = newItem;

      return { items: newItems, location: prevState.location };
    });
  }

  function setLocation(newLocation) {
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
        editState={editState} />
      <AddItemForm
        location={state.location}
        editState={editState} />
      <List
        items={state.items}
        index={state.items[state.location].child}
        position="0"
        editState={editState}
      />
    </div>
  );
}

export default App;

