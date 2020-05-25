import React, { useState } from "react";
import List from "../List/List";
import DropDownButton from "./DropDownButton"
import './Item.css';

function Item({ item, items, position, deleteCB, moveCB, toggleCB, locateCB }) {
  const [state, setState] = useState({ drop: "collapsed" });

  function onItemClick(event) {
    event.stopPropagation();
    event.preventDefault();
    console.log("Toggle Item-checked. Id: ", item.id);
    toggleCB(item.id);
  }

  function deleteMe(e) {
    e.preventDefault();
    e.stopPropagation();
    deleteCB(item);
  }

  function enterMe(e) {
    e.stopPropagation();
    locateCB(item.id);

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
  function handleDrop(e) {
    if (e.stopPropagation) {
      e.stopPropagation(); // Stops some browsers from redirecting.
    }
    let fromId = Number(e.dataTransfer.getData("startId"));
    let startPosition = Number(e.dataTransfer.getData("startPosition"));

    // Don't do anything if dropping the same column we're dragging.
    if (position > startPosition) {
      moveCB(fromId, item.id, "after");
    } else if (position < startPosition) {
      moveCB(fromId, item.id, "before");
    }
    removeOverUnder(e);
    return false;
  }

  function toggleDropDown() {
    console.log("toggleDrp");
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
      onDrop={e => handleDrop(e)}
      onClick={e => onItemClick(e)}
      style={item.checked ? { textDecoration: "line-through" } : null}
    >

      <DropDownButton 
        viewState={(item.child) ? state.drop : "empty" }
        toggleCB={toggleDropDown} />
      {item.text}
      <button onClick={e => deleteMe(e)}>Delete</button>
      <button onClick={e => enterMe(e)}>Enter</button>
      {(item.child) && (state.drop === "expanded") &&
        <List
          items={items}
          index={item.child}
          position={position + 1}
          deleteCB={deleteCB}
          moveCB={moveCB}
          locateCB={locateCB}
          toggleCB={toggleCB}
        />
      }
    </div>
  );
}
export default Item;

//{struck?"strikethrough":null}
