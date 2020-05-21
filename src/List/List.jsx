import React from 'react';
import Item from '../Item/Item';

function List({ items, deleteCB, moveCB }) {
  return (
    <ul>
      {items.map((item, index) => (
        <Item
          key={item.id}
          id={item.id}
          index={index}
          text={item.text}
          children={item.children}
          deleteCB={deleteCB}
          moveCB={moveCB}
        />
      ))}
    </ul>
  );
}

export default List;