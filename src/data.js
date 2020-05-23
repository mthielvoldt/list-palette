
const mockQuery = [
    { id: 0, next: null, child: 6, text: "Start Item" },
    { id: 5, next: 2, child: null, text: "Laundry" },
    { id: 6, next: 5, child: null, text: "Commit changes" },
    { id: 2, next: null, child: 13, text: "Take over the world" },
    { id: 12, next: null, child: null, text: "Persuade Brain" },
    { id: 7, next: 12, child: null, text: "Buy drill" },
    { id: 13, next: 7, child: null, text: "Eat lunch" }
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
        sparse[elem.id] = elem;
    });

    function reverseLink(i, parent, previous) {
        sparse[i].parent = parent;
        sparse[i].previous = previous;

        if (sparse[i].child != null) {
            reverseLink(sparse[i].child, i, null);
        }
        if (sparse[i].next != null) {
            reverseLink(sparse[i].next, parent, i)
        }
    }
    reverseLink(0, null, null);

    console.log(sparse);
    return sparse;
}

export default mockQuery;
export {
    toSparseDoubleLink
}