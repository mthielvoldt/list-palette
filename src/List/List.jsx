import React from 'react';
import Item from '../Item/Item';

function List({ items, index, deleteCB, moveCB }) {

  // build a return array
  let a = [];
  let j = 0;

  while (index != null) {
    let item = items[index];
    a[j] = <Item
      key={index}
      index={j}
      items={items}
      item={item}
      deleteCB={deleteCB}
      moveCB={moveCB}
    />;
    j++;
    index = item.next;
  }

  return (<ul>{a}</ul>);
}

export default List;