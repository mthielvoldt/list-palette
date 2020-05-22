import React, { useState } from "react";
import List from "../List/List";
import './Item.css';

function Item({ item, items, position, deleteCB, moveCB }) {
  const [struck, setStruck] = useState(false);

  function onItemClick(event) {
    setStruck(!struck);
  }

  function deleteMe(e) {
    e.preventDefault();
    e.stopPropagation();
    deleteCB(item);
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
    if ( position > startPosition ) {
      moveCB(fromId, item.id, "after" );
    } else if ( position < startPosition ) {
      moveCB(fromId, item.id, "before" );
    }
    removeOverUnder(e);
    return false;
  }

  return (
    <li
      className="item"
      draggable="true"
      onDragOver={e => handleDragOver(e)}
      onDragLeave={e => removeOverUnder(e)}
      onDragEnd={e => handleDragEnd(e)}
      onDragStart={e => handleDragStart(e)}
      onDrop={e => handleDrop(e)}
      onClick={onItemClick}
      style={struck ? { textDecoration: "line-through" } : null}
    >
      {item.text}{position}
      <button onClick={e => deleteMe(e)}>Delete</button>
      {(item.child) && 
        <List 
          items={items} 
          index={item.child} 
          position={position + 1}
          deleteCB={deleteCB} 
          moveCB={moveCB} 
        />
      }
    </li>
  );
}
export default Item;

//{struck?"strikethrough":null}
