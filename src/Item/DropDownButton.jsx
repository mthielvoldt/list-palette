import React from 'react';


function DropDownButton({ viewState, toggleCB }) {

    function handleClick(event) {
      event.stopPropagation();
      toggleCB();
    }

    let path;

    switch(viewState) {
      case 'collapsed':
        path = <path d="M12.14 8.753l-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />;
        break;
      case 'expanded':
        path = <path fillRule="evenodd" d="M3.204 5L8 10.481 12.796 5H3.204zm-.753.659l4.796 5.48a1 1 0 0 0 1.506 0l4.796-5.48c.566-.647.106-1.659-.753-1.659H3.204a1 1 0 0 0-.753 1.659z" />;
        break;
      case "empty":
      default:
        path = '';//<path fillRule="evenodd" d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>;
    }

    return (
      <svg onClick={handleClick} className="item-icon-container bi bi-caret-right-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        {path}
      </svg>
    );

  }

  export default DropDownButton;