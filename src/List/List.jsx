import React from 'react';
import Item from '../Item/Item';

function List({ items, index, position, deleteCB, moveCB, locateCB }) {

  // build a return array
  let a = [];
  let j = 0;

  while (index != null) {
    let item = items[index];
    a[j++] = <Item
      key={index}
      position={position++}
      items={items}
      item={item}
      deleteCB={deleteCB}
      moveCB={moveCB}
      locateCB={locateCB}
    />;
    index = item.next;
  }

  return (<div className="list">{a}</div>);
}

export default List;