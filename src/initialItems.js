const initialItems = [
  { "id": 0, "text": "Home", "child": 1, "next": null, "checked": "unchecked" },
  { "id": 1, "text": "Groceries", "child": 14, "next": null, "checked": "false" },
  { "id": 2, "text": "Pot roast meal", "child": 10, "next": null, "checked": "false" },
  { "id": 3, "text": "Produce", "child": 7, "next": null, "checked": "false" },
  { "id": 4, "text": "Carrots", "child": null, "next": null, "checked": "false" },
  { "id": 5, "text": "Onion", "child": null, "next": 4, "checked": "false" },
  { "id": 6, "text": "Celery", "child": null, "next": 5, "checked": "false" },
  { "id": 7, "text": "Potatoes", "child": null, "next": 6, "checked": "false" },
  { "id": 8, "text": "Meats", "child": 9, "next": 3, "checked": "false" },
  { "id": 9, "text": "Round roast", "child": null, "next": null, "checked": "false" },
  { "id": 10, "text": "Cans aisle", "child": 13, "next": 8, "checked": "false" },
  { "id": 11, "text": "Tomato sauce", "child": null, "next": null, "checked": "false" },
  { "id": 12, "text": "Beef broth", "child": null, "next": 11, "checked": "false" },
  { "id": 13, "text": "Worchestershire", "child": null, "next": 12, "checked": "false" },
  { "id": 14, "text": "Staples", "child": 21, "next": 2, "checked": "false" },
  { "id": 15, "text": "Dairy", "child": 18, "next": null, "checked": "false" },
  { "id": 16, "text": "Milk", "child": null, "next": null, "checked": "false" },
  { "id": 17, "text": "Butter", "child": null, "next": 16, "checked": "false" },
  { "id": 18, "text": "Eggs", "child": null, "next": 17, "checked": "false" },
  { "id": 19, "text": "Produce", "child": 23, "next": 15, "checked": "unchecked" },
  { "id": 20, "text": "Breakfast", "child": 24, "next": 19, "checked": "false" },
  { "id": 21, "text": "Drinks", "child": 25, "next": 20, "checked": "false" },
  { "id": 22, "text": "Bananas", "child": null, "next": null, "checked": "false" },
  { "id": 23, "text": "Salad", "child": null, "next": 22, "checked": "false" },
  { "id": 24, "text": "Cereal", "child": null, "next": null, "checked": "false" },
  { "id": 25, "text": "Seltzer", "child": null, "next": null, "checked": "false" },
];

export default initialItems;