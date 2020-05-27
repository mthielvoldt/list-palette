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
      case 'MERGE_LIST':
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

      // Start with copying the root item - 
      // putting the copy at the end of the previous array
      let newParentItem = { ...items[id], id: items.length, child: items.length + 1 };

      // shallow-copy items array, inserting the duplicated root. 
      let newItems = items.concat(newParentItem);

      // connectItem expects to be able to mutate the array iteself
      // but not the linked-to objects in the array.  It makes new copies of those if they will be changed. 
      connectItem(newParentItem.id, location, newItems, "child");

      /**Now, we recursively copy all the children of the parent item, 
       * starting with the parent item's first child. 
       * origId = items[id].child (the original to copy = first child of duplicated root)
       * newId = newItems.length (the end of the new array; the index for new elements)
       * parent = newItem.id (the new root).
       * previous = null - item will be located at the top of its list. 
       */
      if (items[id].child != null) {
        copyItem(items[id].child, newItems.length, newParentItem.id, null);
      }

      function copyItem(origId, newId, parent, previous) {
        let origItem = items[origId];
        let newItem = { ...origItem, id: newId, parent: parent, previous: previous, child: null, next: null }
        newItems.push(newItem);

        if (origItem.child != null) {
          newItem.child = newId + 1;
          newId = copyItem(origItem.child, newId + 1, newId, null);
        }
        if (origItem.next != null) {
          //console.log("newItem:", newItem, "newItemCopy:", newItemCopy);
          newItem.next = newId + 1; // at this point, newId will have been incremented by every child above. 
          newId = copyItem(origItem.next, newId + 1, parent, newItem.id);
        }
        //console.log("origItem, newItem:", origItem, newItem);
        return newId;
      }



      console.log("duplicate Item:", newItems);

      return { items: newItems, location: location };
    });

  }

  function mergeLists(src, dest) {

  }

  function connectItem(srcId, destId, items, relation) {
    // This function replaces 3 elements of the 'items' array with new objects: 
    // items[srcId], items[destId], and a third item that depends on the relation parameter. 
    // The original objects referenced by the 'items' array are not mutated, but 
    // the 'items' array itself (the object references) is mutated. 

    // make copy of src and dest. 
    let srcItem = { ...items[srcId] };
    let destItem = { ...items[destId] };

    switch (relation) {

      case "before":  // plug in srcItem immediately before destItem
        srcItem.previous = destItem.previous;
        srcItem.parent = destItem.parent;
        srcItem.next = destItem.id;

        // handle connection above source item
        if (destItem.previous === null) {
          items[destItem.parent] = { ...items[destItem.parent], child: srcItem.id };
        } else {  // dest was not first item
          items[destItem.previous] = { ...items[destItem.previous], next: srcItem.id };
        }
        destItem.previous = srcItem.id;
        break;

      case "after": // plug in srcItem immediately after destItem
        srcItem.previous = destItem.id;
        srcItem.parent = destItem.parent;
        srcItem.next = destItem.next;

        if (destItem.next != null) {
          items[destItem.next] = { ...items[destItem.next], previous: srcItem.id };
        }
        destItem.next = srcItem.id;
        break;

      case "child": // plug in srcItem as first child of destItem
        srcItem.previous = null;
        srcItem.parent = destItem.id;
        srcItem.next = destItem.child;

        if (destItem.child != null) {
          items[destItem.child] = { ...items[destItem.child], previous: srcItem.id };
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
      items[item.parent] = { ...items[item.parent], child: item.next };
    } else {
      items[item.previous] = { ...items[item.previous], next: item.next };
    }

    // Patch reverse link
    if (item.next !== null) {
      items[item.next] = { ...items[item.next], previous: item.previous };
    }
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

