
const mockData = {};

mockData.itemsShort = [
  { "id": 3, "text": "People", "child": null, "next": 2, "checked": "false" },
  { "id": 2, "text": "To-do", "child": null, "next": 1, "checked": "false" },
  { "id": 1, "text": "Groceries", "child": null, "next": null, "checked": "false" },
  { "id": 0, "text": "Home", "child": 3, "next": null, "checked": "false" }
];

mockData.nestedResponse = {
  "status": 200,
  "data": {
    "user": "Daryl",
    "items": [
      { "id": 0, "text": "Home", "child": 3, "next": null, "checked": "false" },
      { "id": 6, "text": "alpha.charlie", "child": null, "next": null, "checked": "false" },
      { "id": 5, "text": "alpha.beta", "child": null, "next": 6, "checked": "false" },
      { "id": 4, "text": "alpha.alpha", "child": null, "next": 5, "checked": "false" },
      { "id": 3, "text": "alpha", "child": 4, "next": 2, "checked": "unchecked" },
      { "id": 7, "text": "beta.charlie", "child": null, "next": null, "checked": "false" },
      { "id": 8, "text": "beta.beta", "child": null, "next": 7, "checked": "false" },
      { "id": 9, "text": "beta.alpha", "child": null, "next": 8, "checked": "false" },
      { "id": 2, "text": "beta", "child": 9, "next": 1, "checked": "false" },
      { "id": 10, "text": "charlie.foxtrot", "child": null, "next": null, "checked": "false" },
      { "id": 11, "text": "charlie.echo", "child": null, "next": 10, "checked": "false" },
      { "id": 12, "text": "charlie.delta", "child": null, "next": 11, "checked": "false" },
      { "id": 13, "text": "charlie.charlie", "child": null, "next": 12, "checked": "false" },
      { "id": 14, "text": "charlie.beta", "child": null, "next": 13, "checked": "false" },
      { "id": 15, "text": "charlie.alpha", "child": null, "next": 14, "checked": "false" },
      { "id": 1, "text": "charlie", "child": 15, "next": null, "checked": "unchecked" }
    ]
  },
};

export default mockData;