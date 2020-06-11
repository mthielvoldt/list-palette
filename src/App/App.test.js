import React from 'react';
import { render, cleanup } from '@testing-library/react';
import App from './App';
import axios from 'axios';
jest.mock('axios');

afterEach(cleanup);

const items = [
  { "id": 3, "text": "People", "child": null, "next": 2, "checked": "false" },
  { "id": 2, "text": "To-do", "child": null, "next": 1, "checked": "false" },
  { "id": 1, "text": "Groceries", "child": null, "next": null, "checked": "false" },
  { "id": 0, "text": "Home", "child": 3, "next": null, "checked": "false" }
];

it("renders correctly with anonymous user", async () => {
  axios.get.mockResolvedValue({ data: { user: null, items: items } });
  //axios.get.mockImplementation(() => Promise.resolve(resp))

  const app = render(<App />);
  const peopleItem = await app.findByText(/People/i);
  expect(peopleItem).toBeInTheDocument();
  expect(app.getByText(/Home>/i)).toBeInTheDocument();
  expect(app.getByText(/Sign in/i)).toBeInTheDocument();
  expect(app.asFragment()).toMatchSnapshot();
});

it("renders correctly with signed-in user", async () => {
  axios.get.mockResolvedValue({ data: { user: 'John', items: items } });
  //axios.get.mockImplementation(() => Promise.resolve(resp))

  const app = render(<App />);
  const userLink = await app.findByText(/John/i);
  expect(userLink).toBeInTheDocument();
  expect(app.queryByText(/Sign in/i)).toBe(null);
  expect(app.asFragment()).toMatchSnapshot();
});
