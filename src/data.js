
const mockQuery = [
    { id: 0,    next: null, child: 6,    text: "Start Item" },
    { id: 5,    next: 2,    child: null, text: "Laundry" },
    { id: 6,    next: 5,    child: null, text: "Commit changes" },
    { id: 2,    next: null, child: 13,   text: "Take over the world" },
    { id: 12,   next: null, child: null, text: "Persuade Brain" },
    { id: 7,    next: 12,   child: null, text: "Buy drill" },
    { id: 13,   next: 7,    child: null, text: "Eat lunch" }
];

/**Accepts a packed, singly-linked array of objects. 
 * Each object has properties:  id, next, child, text.
 * 
 * Returns a sparse, doubly-linked array of objects.
 * Each object has properties: 
 * next, previous, child, parent, text. 
 * 
 * The id property of each element of the packed array 
 * becomes the index of the element of the sparse array. 
 */ 
function toSparseDoubleLink(packed) {
    let sparse = [];
    packed.forEach((elem, index) => { 
        if(typeof(sparse[elem.id]) === 'undefined') {
            sparse[elem.id] = elem;
        } else {
            Object.assign(sparse[elem.id], elem);
        }

        if (elem.child != null) {
            if (typeof(sparse[elem.child]) === 'undefined') 
                sparse[elem.child] = {};
            Object.assign(sparse[elem.child], { parent: elem.id, previous: null });
        }
        
        if (elem.next != null) {
            if (typeof(sparse[elem.next]) === 'undefined') 
                sparse[elem.next] = {};
            Object.assign(sparse[elem.next], { parent: null, previous: elem.id });
        }
    });
   
    console.log("sparse array:", sparse);
    return sparse;
}

export default mockQuery;
export {
    toSparseDoubleLink
}