import React, { useState } from "react";
import List from "../List/List";
import './Item.css';

function Item({ item, items, index, parent, prev, deleteCB, moveCB }) {
  const [struck, setStruck] = useState(false);

  function onItemClick(event) {
    setStruck(!struck);
  }

  function deleteMe(e) {
    e.preventDefault();
    e.stopPropagation();
    deleteCB(item.id, parent, prev);
  }

  function handleDragStart(e) {
    e.stopPropagation();
    e.dataTransfer.setData("startIndex", index.toString());
    e.dataTransfer.setData("startId", item.id);
    e.dataTransfer.dropEffect = "move"; // See the section on the DataTransfer object.
    console.log("drag item: %d", item.id);
    //deleteCB(id);
  }

  function handleDragEnd(e) {
    e.stopPropagation();

    console.log(e.dataTransfer.dropEffect);
    removeOverUnder(e);
    deleteCB(item.id);

    //if (e.dataTransfer.dropEffect === move )
  }

  function handleDragOver(e) {
    // the item under the dragged item.
    if (e.preventDefault) e.preventDefault(); // Necessary. Allows us to drop.

    if (e.dataTransfer.getData("startIndex") < index) {
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
    let fromIndex = Number(e.dataTransfer.getData("startIndex"));

    // Don't do anything if dropping the same column we're dragging.
    if (fromIndex !== index) {
      moveCB(fromIndex, index);
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
      {item.text}
      <button onClick={e => deleteMe(e)}>Delete</button>
      {(item.child) && <List items={items} index={item.child} deleteCB={deleteCB} moveCB={moveCB} />}
    </li>
  );
}
export default Item;

//{struck?"strikethrough":null}
