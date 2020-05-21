import React from 'react';
import Item from '../Item/Item';

function List({ items, index, parent, deleteCB, moveCB }) {

  // build a return array
  let a = [];
  let j = 0;
  let prev = null;

  while (index != null) {
    let item = items[index];
    a[j] = <Item
      key={index}
      index={j}
      parent={parent}
      prev={prev}
      items={items}
      item={item}
      deleteCB={deleteCB}
      moveCB={moveCB}
    />;
    prev = index;
    j++;
    index = item.next;
  }

  return (<ul>{a}</ul>);
}

export default List;