
function dupHelper(id, location, items) {

    // Start with copying the root item - 
    // putting the copy at the end of the previous array
    let newParentItem = { ...items[id], id: items.length};
    if (items[id].child != null) {
        newParentItem.child = items.length+1; 
    }

    // shallow-copy items array, inserting the duplicated root. 
    items.push(newParentItem);

    // connectItem expects to be able to mutate the array iteself
    // but not the linked-to objects in the array.  It makes new copies of those if they will be changed. 
    connectItem(newParentItem.id, location, items, "child");

    /**Now, we recursively copy all the children of the parent item, 
     * starting with the parent item's first child. 
     * origId = items[id].child (the original to copy = first child of duplicated root)
     * newId = items.length (the end of the new array; the index for new elements)
     * parent = newItem.id (the new root).
     * previous = null - item will be located at the top of its list. 
     */
    if (items[id].child != null) {
        copyItem(items[id].child, items.length, newParentItem.id, null);
    }

    function copyItem(origId, newId, parent, previous) {
        let origItem = items[origId];
        let newItem = { ...origItem, id: newId, parent: parent, previous: previous, child: null, next: null }
        items.push(newItem);

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
}

function mergeHelper(src, dest, items) {
    let i = items[src].child;
    while (i != null) {
        let j = items[dest].child;
        while (j != null) {
            if (items[j].text === items[i].text) {
                mergeHelper(i, j, items);
                break;
            }
            j = items[j].next;
        }
        if (j == null) {   // no match
            dupHelper(i, dest, items);
        }
        i = items[i].next;
    }
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

export {
    dupHelper,
    mergeHelper,
    connectItem,
    disconnectItem,
}