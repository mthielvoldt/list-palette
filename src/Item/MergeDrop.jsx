import React from 'react'



function MergeDrop({ id }) {

  function handleDrop(e) {
    e.stopPropagation();
    let src = Number(e.dataTransfer.getData("startId"));
    console.log("Merge src: %d  dest: %d", src, id );
  }

  return (
    <svg className="merge-icon" onDrop={e => handleDrop(e)}
      width="1.3em" height="1.3em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d="M14.5 13a1.5 1.5 0 0 1-1.5 1.5H3A1.5 1.5 0 0 1 1.5 13V8a.5.5 0 0 1 1 0v5a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5H9a.5.5 0 0 1 0-1h4A1.5 1.5 0 0 1 14.5 3v10z" />
      <path fillRule="evenodd" d="M4.5 10a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5V5a.5.5 0 0 0-1 0v4.5H5a.5.5 0 0 0-.5.5z" />
      <path fillRule="evenodd" d="M10.354 10.354a.5.5 0 0 0 0-.708l-8-8a.5.5 0 1 0-.708.708l8 8a.5.5 0 0 0 .708 0z" />
    </svg>
  );
}

export default MergeDrop;