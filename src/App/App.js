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

      connectItem( newItem.id, prevState.location, newItems, "child");

      return { items: newItems, location: prevState.location };
    });
    // DB: Create new row for new Item. 
    // DB: update parent's child link  (DB doesn't need reverse link updated)
  }

  function dupList(id) { 


    setState( ({items, location}) => {

      // Start with copying the root item - 
      // putting the copy at the end of the previous array
      let newItem  = {...items[id], id: items.length};  

      // shallow-copy items array
      let newItems = items.concat(newItem);

      // connectItem expects to be able to mutate the array iteself
      // but not the linked-to objects in the array.  It makes new copies of those if they will be changed. 
      connectItem(newItem.id, location , newItems, "child");
      console.log("duplicate Item:", newItems);
      
      return {items: newItems, location: location};
    });
    
  }

  function connectItem(srcId, destId, items, relation) {
    // This function replaces 3 elements of the 'items' array with new objects: 
    // items[srcId], items[destId], and a third item that depends on the relation parameter. 
    // The original objects referenced by the 'items' array are not mutated, but 
    // the 'items' array itself (the object references) is mutated. 

    // make copy of src and dest. 
    let srcItem = {...items[srcId]};
    let destItem = {...items[destId]};

    switch (relation) {

    case "before":  // plug in srcItem immediately before destItem
      srcItem.previous = destItem.previous;
      srcItem.parent = destItem.parent;
      srcItem.next = destItem.id;

      // handle connection above source item
      if (destItem.previous === null) {
        items[destItem.parent] = {...items[destItem.parent], child: srcItem.id };
      } else {  // dest was not first item
        items[destItem.previous] = {...items[destItem.previous], next: srcItem.id };
      }
      destItem.previous = srcItem.id;
      break;

    case "after": // plug in srcItem immediately after destItem
      srcItem.previous = destItem.id;
      srcItem.parent = destItem.parent;
      srcItem.next = destItem.next;

      if (destItem.next != null) {
        items[destItem.next] = {...items[destItem.next], previous: srcItem.id};
      }
      destItem.next = srcItem.id;
      break;

    case "child": // plug in srcItem as first child of destItem
      srcItem.previous = null;
      srcItem.parent = destItem.id;
      srcItem.next = destItem.child;

      if (destItem.child != null) {
        items[destItem.child] = {...items[destItem.child], previous: srcItem.id};
      }
      destItem.child = srcItem.id;
      break;

    default:
      console.error("unspefified relationship to destination");
      return -1;
    }

    // plug srcItem and destItem with updated links back into array. 
    items[srcItem.id] = srcItem;
    items[destItem.id] = destItem;
  }

  // Take the identified item out of the flow by patching the links to cut it out. 
  function disconnectItem(id, items) {
    // This function mutates the 'items' array by replacing the object references, 
    // but it does not mutate any of the objects pointed to by the 'items' elements. 

    let item = items[id]; // syntactic convenience.  Item is not mutated; 

    // is the item the first in its list? 
    // then we have to make its parent point to it's next sibling
    if (item.previous === null) {
      items[item.parent] = {...items[item.parent], child: item.next};
    } else {
      items[item.previous]= {...items[item.previous], next: item.next};
    }

    // Patch reverse link
    if (item.next !== null) {
      items[item.next] = {...items[item.next], previous: item.previous};
    }
  }

  function deleteItem(id) {
    console.log("Delete item:", id);
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

