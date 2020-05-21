
const mockQuery = [
    { id: 0,    next: null, child: 6,       text: "Start Item" },
    { id: 5,    next: 2,    child: null,    text: "Laundry" },
    { id: 6,    next: 5,    child: null,    text: "Commit changes" },
    { id: 2,    next: null, child: 13,      text: "Take over the world" }, 
    { id: 12,   next: null, child: null,    text: "Persuade Brain" },
    { id: 7,    next: 12,   child: null,      text: "Buy drill" },
    { id: 13,   next: 7,    child: null,       text: "Eat lunch" }
];

const ordered = [
    { next: null, child: 6, text: "start"},
    {},
    { next: null, child: 13, text: "Take over the world"},
    {},
    {},
    { next: 2,  child: null, text: "Laundry"}, 
    { next: 5,  child: null, text: "Commit changes"}, 
    { next: 12, child: null, text: "Buy drill"},
    {},
    {},
    {},
    {},
    { next: null, child: null, text: "Persuade Brain"}, 
    { next: 7,    child: null, text: "Eat lunch"}
]

export default mockQuery;