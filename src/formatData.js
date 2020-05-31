
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

export default toSparseDoubleLink;