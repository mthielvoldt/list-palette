import React, { useState, useEffect } from "react";
import Location from "../Location/Location"
import AddItemForm from "../AddItemForm/AddItemForm";
import List from "../List/List";
import Header from "../Header/Header";
import toSparseDoubleLink from '../formatData.js';
import { dupHelper, mergeHelper, connectItem, disconnectItem } from './Helpers';
import initialItems from "../initialItems";
import './App.css';
const axios = require('axios').default;

const initialState = {
  items: initialItems,
  location: 0,
  user: null
}

function App() {
  const [state, setState] = useState(initialState);
  useEffect(loadItems, []);

  function loadItems() {
    axios.get("/items")
      .catch(e => {
        console.warn("Problem fetching item from server.\n", e);
        return { data: initialState };
      })
      .then(res => {
        setState({ items: toSparseDoubleLink(res.data.items), user: res.data.user, location: 0 });
      })
      .catch(e => {
        console.error("Error creating items array.\n", e);
      });
  }

  function logOut() {
    axios.get('/logout');
    setState(initialState);
  }

  function saveAllItems(user) {
    // when a new user signs up, let's save all the data they have. 
    // The front end works with a sparse array - when an item is deleted, it's 
    // original index is never reused.  We don't want to add deleted items, so 
    // we filter out all the empty items before sending. 
    const packed = state.items.filter(
      item => (typeof (item.id) !== undefined && item.id > 0));
    const dbChanges = {insert: packed, update: [state.items[0]]};
    axios.put('/items', dbChanges)
    .then(loadItems)
    .catch(console.log);
  }

  function editState({ type, data }) {
    console.log("Edit State - ", type, data);
    switch (type) {
      case 'ADD_ITEM':
        addItem(data);
        break;
      case 'EDIT_ITEM':
        editItem(data.id, data.text);
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

    let newItem = {
      id: state.items.length,
      text: text,
      checked: false,
      child: null
    };

    let newItems = state.items.concat(newItem);

    connectItem(newItem.id, state.location, newItems, "child");

    // DB: Create new row for new Item, and also updates parent (no 'previous' link in DB). 
    const dbData = { insert: [newItems[newItem.id]], update: [newItems[newItem.parent]] };
    axios.put("/items", dbData);

    setState({ ...state, items: newItems });
  }

  function editItem(id, text) {
    let newItems = state.items.concat();
    newItems[id].text = text;
    axios.put("/items", { update: [newItems[id]] });
    setState({ ...state, items: newItems });
  }

  function dupList(id) {
    let newItems = state.items.concat();
    let dbChanges = dupHelper(id, state.location, newItems);
    axios.put('/items', dbChanges);
    setState({ ...state, items: newItems });
  }

  function mergeLists(src, dest) {
    let newItems = state.items.concat();
    let dbChanges = mergeHelper(src, dest, newItems);
    axios.put('/items', dbChanges);
    setState({ ...state, items: newItems });
  }

  function deleteList(id) {
    // Note: we don't need to actually remove the item in the front-end, so we don't.
    let newItems = state.items.concat();
    let dbChanges = disconnectItem(id, newItems); // mutates newItems, but not embedded objects.
    axios.put("/items", dbChanges);
    setState({ ...state, items: newItems });

    // DB operations: 
    // - edit either parent or previous sibling's link. 
    // - remove the row for this item. 
  }

  function moveList(src, dest, relation) {
    let newItems = state.items.concat();

    // cut the item out if it's old position.  
    // do this first because connectItem() clobbers source links. 
    let dbChanges = disconnectItem(src, newItems);
    // re-link to place source item in new position. 
    dbChanges = connectItem(src, dest, newItems, relation, dbChanges);
    axios.put('/items', dbChanges);
    setState({ ...state, items: newItems });
  }

  function toggleListChecked(id) {
    let newItems = state.items.concat();
    newItems[id].checked = (newItems[id].checked === 'checked') ? 'unchecked' : 'checked';
    axios.put('/items', { update: [newItems[id]] });

    setState({ ...state, items: newItems });
  }

  function setLocation(newLocation) {
    setState(prevState => ({ ...prevState, location: newLocation }));
  }

  return (
    <>
      <Header
        user={state.user}
        loadItemsCB={loadItems}
        logOutCB={logOut} 
        saveAllItemsCB={saveAllItems} />
      <div className="container">

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
    </>
  );
}

export default App;

