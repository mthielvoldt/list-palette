import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import testUtils from 'react-dom/test-utils';
import { toMatchDiffSnapshot } from 'snapshot-diff';
import App from './App';
import mockData from './mockData'
import axios from 'axios';
jest.mock('axios');

expect.extend({ toMatchDiffSnapshot });

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


  it("renders and sends PUT when user moves items", async () => {
    // mock the GET request that loads the seed data.
    axios.get.mockResolvedValue(mockData.nestedResponse);
    // mock the PUT request that should be sent when item is moved.
    axios.put.mockResolvedValue({ data: {}, status: 200 });

    // Mock the dataTransfer object (because it isn't implemented in js-DOM). 
    // Create a local object to hold key-value pairs, and functions for writing and retreiving. 
    let storedData = {};
    const mockSetData = jest.fn((key, value) => {
      Object.assign(storedData, { [key]: value })
    })
    const mockGetData = jest.fn(key => storedData[key]);

    // Render and wait for loading the seed items
    const app = render(<App />);
    let alpha = await app.findByText('alpha');
    let beta = app.getByText('beta');
    let appBefore = app.asFragment();

    // Simulate user moving an item on first level 
    testUtils.Simulate.dragStart(alpha, { dataTransfer: { setData: mockSetData } });
    testUtils.Simulate.dragOver(beta, { dataTransfer: { getData: mockGetData } });
    testUtils.Simulate.drop(beta, { dataTransfer: { getData: mockGetData } });

    expect(app.asFragment()).toMatchDiffSnapshot(appBefore);
    expect(axios.put).lastCalledWith('/items',
      {
        "insert": [],
        "update": [
          { "id": 0, "text": "Home", "child": 2, "next": null, "checked": "false", "parent": null, "previous": null },
          { "id": 3, "text": "alpha", "child": 4, "next": 1, "checked": "unchecked", "parent": 0, "previous": 2 },
          { "id": 2, "text": "beta", "child": 9, "next": 3, "checked": "false", "parent": 0, "previous": null }
        ]
      });

    // If we just drop the item back onto itself, the API should not be hit. 
  });

  it.skip("moves items with touch only after long-touch", async () => {
    // touch item and move immediately
    
    // it should not be "lifted" (on a phone it would scroll)

    // touch and hold item. 
    // it should lift item for drag/drop
  })

  it.skip("renders and sends PUT when user deletes items", async () => {
  });

  it.skip("renders and sends PUT when user merges items", async () => {
  });

  it.skip("handles a sign-up", async () => {
  });



});



