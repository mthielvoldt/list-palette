import React from "react";
import "./Location.css";

function LocationButton( {text, location, editState}) {


    return (
        <button
            onClick={() => {editState({type:"SET_LOCATION", data:location})}} >
            {text}
            </button>
    );

}

function Location({ items, location, editState }) {

    let a = [];
    let i = 50;

    while (location != null) {
        a[--i] = 
        <LocationButton
            key={i}
            text={items[location].text+'>'}
            location={location}
            editState={editState} />

        location = items[location].parent;
    }

    return (
        <div className="location">
            {a}
        </div>
    );
}

export default Location;