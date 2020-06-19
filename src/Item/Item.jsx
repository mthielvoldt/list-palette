import React, { useState } from "react";
import List from "../List/List";
import DropDownButton from "./DropDownButton"
import './Item.css';
import ClickableIcon from './ClickableIcon';
import DroppableIcon from './DroppableIcon';

function Item({ item, items, position, editState}) {
  const [viewState, setViewState] = useState({ drop: "collapsed", edit: false});
  const [text, setText] = useState(item.text);

  function onItemClick(event) {
    event.stopPropagation();
    event.preventDefault();
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

  function handleMergeIconDrop(e) {
    let src = Number(e.dataTransfer.getData("startId"));
    editState({type: "MERGE_LISTS", data: {src: src, dest: item.id}});
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      editState({type: "EDIT_ITEM", data:{ id: item.id, text: text}});
      setViewState({...viewState, edit: false});
    }
  }
  function editMe(e) {
    e.stopPropagation();
    console.log("edit mode")
    setViewState( prevState => ({...prevState, edit: true}));
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
    setViewState( prevState => ({...prevState, drop: (prevState.drop === "expanded") ? "collapsed" : "expanded"}));
  }

  let dragging = false;
  function touchStart(e) {
    // ddt aborts if e.defaultPrevented or e.touches > 2 (double-tap)
    const target = e.target;
    const e_cpy = {...e};
    setTimeout( () => {
      dragging = true;
      startTouchDrag(e_cpy, target);
    }, 400);
  }

  function startTouchDrag(e, target) {
    dispatchEvent(e, 'dragstart', target);
  }
  function touchMove(e) {
    // ddt 
    
  }
  function touchEnd(e) {
  }

  function dispatchEvent(e, type, target) {
    if (e && target) {
        let evt = new Event(type, {bubbles: true, cancelable: true, composed: true});

        //var evt = document.createEvent('Event'), t = e.touches ? e.touches[0] : e;
        //evt.initEvent(type, true, true);
        //evt.button = 0;
        //evt.which = evt.buttons = 1;
        //this._copyProps(evt, e, DragDropTouch._kbdProps);
        //this._copyProps(evt, t, DragDropTouch._ptProps);
        //evt.dataTransfer = this._dataTransfer;
        target.dispatchEvent(evt);
        return evt.defaultPrevented;
    }
    return false;
};


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
      onTouchStart={touchStart}
      onTouchMove={touchMove}
      onTouchEnd={touchEnd}
      onTouchCancel={touchEnd}
      style={item.checked === 'checked' ? { textDecoration: "line-through" } : null}
    >

      <DropDownButton 
        viewState={(item.child) ? viewState.drop : "empty" }
        toggleCB={toggleDropDown} />
      {(viewState.edit) 
        ? <input 
            value={text} 
            onChange={(e) => {setText(e.target.value)}}
            onKeyDown={handleKeyDown}
            autoFocus
            /> 
        : item.text} 

      <ClickableIcon type="delete" onClick={e => deleteMe(e)}/>
      <ClickableIcon type="edit" onClick={e => editMe(e)}/>
      <ClickableIcon type="focus" onClick={e => enterMe(e)}/>
      <DroppableIcon type="merge" onDrop={handleMergeIconDrop}/>

      {(item.child) && (viewState.drop === "expanded") &&
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
