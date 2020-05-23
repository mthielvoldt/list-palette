import React from "react";
import "./Location.css";

function LocationButton( {text, location, locateCB}) {


    return (
        <button
            onClick={() => {locateCB(location)}} >
            {text}
            </button>
    );

}

function Location({ items, location, locateCB }) {

    let a = [];
    let i = 50;

    while (location != null) {
        a[--i] = 
        <LocationButton
            key={i}
            text={items[location].text+'>'}
            location={location}
            locateCB={locateCB} />

        location = items[location].parent;
    }

    return (
        <div className="location">
            {a}
        </div>
    );
}

export default Location;