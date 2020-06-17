import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import App from './App';
import mockData from './mockData'
import axios from 'axios';
jest.mock('axios');

afterEach(cleanup);



describe("The App ", () => {

  it("renders with anonymous user", async () => {
    axios.get.mockResolvedValue({ data: { user: null, items: mockData.itemsShort } });
    //axios.get.mockImplementation(() => Promise.resolve(resp))

    const app = render(<App />);
    const peopleItem = await app.findByText(/People/i);
    expect(peopleItem).toBeInTheDocument();
    expect(app.getByText(/Home>/i)).toBeInTheDocument();
    expect(app.getByText(/Sign in/i)).toBeInTheDocument();
    expect(app.asFragment()).toMatchSnapshot();
    expect(axios.get).toBeCalledWith('/items');
  });

  it("renders with signed-in user", async () => {
    axios.get.mockResolvedValue({ data: { user: 'John', items: mockData.itemsShort } });
    const app = render(<App />);
    //axios.get.mockImplementation(() => Promise.resolve(resp))


    const userLink = await app.findByText(/John/i);
    expect(userLink).toBeInTheDocument();
    expect(app.queryByText(/Sign in/i)).toBe(null);
    expect(app.asFragment()).toMatchSnapshot();
  });

  it("renders and sends PUT when user adds items", async () => {
    // mock the PUT request that should be sent when item is added.
    axios.put.mockResolvedValue({ data: {}, status: 200 });

    // Render and wait for re-load of data (this is asynch)
    const app = render(<App />);
    await app.findByText('Groceries');

    // Simulate user typing something into input
    const addItemInput = app.getByTestId('add-item-input');
    fireEvent.change(addItemInput, { target: { value: "Silly String" } });

    // We haven't submitted yet, so make sure we don't see the new string yet. 
    var newItem = app.queryByText('Silly String');
    expect(newItem).toBe(null);

    // Now we click the button. 
    fireEvent.click(app.getByText("Add"));

    // Does the new item render?
    newItem = app.queryByText('Silly String');
    expect(newItem).toBeVisible();

    // Does the API get hit with the correct payload? 
    expect(axios.put).lastCalledWith('/items',
      {
        "insert": [
          { "id": 4, "text": "Silly String", "checked": false, "child": null, "previous": null, "parent": 0, "next": 3 }],
        "update": [
          { "id": 0, "text": "Home", "checked": "false", "next": null, "child": 4, "parent": null, "previous": null }]
      });

    // If we just click the button again, another PUT request should not happen. 
    fireEvent.click(app.getByText("Add"));

    // If we change the text then press enter, we should see a new API hit. 
    fireEvent.change(addItemInput, { target: { value: "Crazy Cheeze" } });
    fireEvent.keyPress(addItemInput, { key: 'Enter', charCode: 13 });

    newItem = app.queryByText("Crazy Cheeze");
    expect(newItem).toBeVisible();

    expect(axios.put).lastCalledWith('/items',
      {
        "insert": [
          { "id": 5, "text": "Crazy Cheeze", "checked": false, "child": null, "previous": null, "parent": 0, "next": 4 }],
        "update": [
          { "id": 0, "text": "Home", "checked": "false", "next": null, "child": 5, "parent": null, "previous": null }]
      });

    expect(axios.put).toBeCalledTimes(2);
  });


  it("renders, sends PUT when user moves items", async () => {

  });

  it("renders, sends PUT when user deletes items", async () => {

  });

  it("renders, sends PUT when user merges items", async () => {

  });

  it("handles a sign-up", async () => {

  });

});



