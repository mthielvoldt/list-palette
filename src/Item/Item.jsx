import React, { useState } from "react";
import List from "../List/List";
import DropDownButton from "./DropDownButton"
import MergeDrop from "./MergeDrop"
import './Item.css';

function Item({ item, items, position, editState}) {
  const [state, setState] = useState({ drop: "collapsed" });

  function onItemClick(event) {
    event.stopPropagation();
    event.preventDefault();
    console.log("Toggle Item-checked. Id: ", item.id);
    editState({type: "TOGGLE_LIST_CHECKED", data: item.id });
  }

  function deleteMe(e) {
    e.preventDefault();
    e.stopPropagation();
    editState({type: "DELETE_LIST", data: item.id});
  }

  function enterMe(e) {
    e.stopPropagation();
    editState({type: "SET_LOCATION", data: item.id});
  }

  function duplicateMe(e) {
    e.preventDefault();
    e.stopPropagation();
    editState({type: "DUPLICATE_LIST", data: item.id});
  }

  function handleDragStart(e) {
    e.stopPropagation();
    e.dataTransfer.setData("startPosition", position);
    e.dataTransfer.setData("startId", item.id);
    e.dataTransfer.dropEffect = "move"; // See the section on the DataTransfer object.
    console.log("Drag Source id: %d  position: %d", item.id, position);
  }

  function handleDragEnd(e) {
    e.stopPropagation();
    removeOverUnder(e);
  }

  function handleDragOver(e) {
    // the item under the dragged item.
    if (e.preventDefault) e.preventDefault(); // Necessary. Allows us to drop.
    if (e.stopPropagation) e.stopPropagation();

    console.log("Start: ", e.dataTransfer.getData("startPosition"), "  Current: ", position);

    if (e.dataTransfer.getData("startPosition") < position) {
      e.target.classList.add("under");
    } else {
      e.target.classList.add("over");
    }
    return false;
  }

  function removeOverUnder(e) {
    e.target.classList.remove("over");
    e.target.classList.remove("under");
  }

  // Fired on target li .
  function handleDragDrop(e) {
    if (e.stopPropagation) {
      e.stopPropagation(); // Stops some browsers from redirecting.
    }
    let fromId = Number(e.dataTransfer.getData("startId"));
    let startPosition = Number(e.dataTransfer.getData("startPosition"));

    // Don't do anything if dropping the same column we're dragging.
    if (position > startPosition) {
      editState({type: "MOVE_LIST", data: 
        {src: fromId, dest: item.id, relation: "after"}});
    } else if (position < startPosition) {
      editState({type: "MOVE_LIST", data: 
        {src: fromId, dest: item.id, relation: "before"}});
    }
    removeOverUnder(e);
    return false;
  }

  function toggleDropDown() {
    setState( prevState => ({...prevState, drop: (prevState.drop === "expanded") ? "collapsed" : "expanded"}));
  }

  return (
    <div
      className="item"
      draggable="true"
      onDragOver={e => handleDragOver(e)}
      onDragLeave={e => removeOverUnder(e)}
      onDragEnd={e => handleDragEnd(e)}
      onDragStart={e => handleDragStart(e)}
      onDrop={e => handleDragDrop(e)}
      onClick={e => onItemClick(e)}
      style={item.checked ? { textDecoration: "line-through" } : null}
    >

      <DropDownButton 
        viewState={(item.child) ? state.drop : "empty" }
        toggleCB={toggleDropDown} />
      {item.text} i{item.id} n{item.next} p{item.previous} c{item.child} pa{item.parent} 
      <button onClick={e => deleteMe(e)}>Delete</button>
      <button onClick={e => enterMe(e)}>Enter</button>
      <button onClick={e => duplicateMe(e)}>Dup</button>
      <MergeDrop id={item.id} editState={editState} />
      {(item.child) && (state.drop === "expanded") &&
        <List
          items={items}
          index={item.child}
          position={position + 1}
          editState={editState}
        />
      }
    </div>
  );
}
export default Item;

//{struck?"strikethrough":null}
