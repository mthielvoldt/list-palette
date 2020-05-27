
const mockQuery = [
    { id: 0, next: null, child: 1, text: "Home", checked: false },
    { id: 1, next: 3, child: 6, text: "Staples", checked: false },
    { id: 3, next: null, child: 4, text: "Chicken Parm", checked: false },
    { id: 5, next: 2, child: null, text: "Produce", checked: false },
    { id: 6, next: 5, child: 16, text: "Dairy", checked: false },
    { id: 2, next: null, child: 13, text: "Meats", checked: false },
    { id: 12, next: null, child: null, text: "Ground Beef", checked: false },
    { id: 7, next: 12, child: null, text: "Bacon", checked: true },
    { id: 13, next: 7, child: null, text: "Sandwich Meat", checked: false },
    { id: 4, next: 8, child: 11, text: "Meats", checked: false },
    { id: 8, next: 9, child: 14, text: "Dairy", checked: false },
    { id: 9, next: null, child: 10, text: "Baking", checked: false },
    { id: 10, next: null, child: null, text: "Bread crumbs", checked: false },
    { id: 11, next: null, child: null, text: "Chicken breast", checked: false },
    { id: 14, next: 15, child: null, text: "Eggs", checked: false },
    { id: 15, next: null, child: null, text: "Parmesan cheese", checked: false },
    { id: 16, next: 17, child: null, text: "Milk", checked: false },
    { id: 17, next: null, child: null, text: "Eggs", checked: true },
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

    console.log("Initial Data:", sparse);
    return sparse;
}

export default mockQuery;
export {
    toSparseDoubleLink
}