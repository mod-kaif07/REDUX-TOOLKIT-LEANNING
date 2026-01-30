# Redux Toolkit Counter — Simple Guide

This project shows how to manage shared data in React using Redux Toolkit. Think of it like a bank: the store holds money (state), actions are requests to withdraw/deposit, and reducers process those requests.

---

## Files explained (simple)

### `src/main.jsx` — The starter file

- Tells React to start the app.
- Wraps the app with `<Provider>` so all components can access the store.
- Think of Provider as giving every component access to the bank.

```jsx
import { Provider } from "react-redux";
import { Store } from "./Redux/Store.js";

createRoot(document.getElementById("root")).render(
  <Provider store={Store}>
    <App />
  </Provider>,
);
```

### `src/Redux/CounterSlice.js` — The counter logic

- Holds the counter state: `{ value: 0 }`.
- Defines actions: `increment`, `decrement`, and `incrementbyfive`.
- Each action is a button you press to change the number.
- `incrementbyfive` takes an input value (payload) to increase the counter by that amount.

```javascript
import { createSlice } from "@reduxjs/toolkit";

export const CounterSlice = createSlice({
  name: "Counter",
  initialState: {
    value: 0,
  },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementbyfive: (state, action) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementbyfive } = CounterSlice.actions;
export default CounterSlice.reducer;
```

**Why this way?** All counter logic is in one file — easy to find and update.

**How actions with payloads work:**

- Actions can carry data (payload) from the UI to the reducer.
- In the reducer, access the payload via `action.payload`.
- This allows dynamic updates, like incrementing by a user-specified amount.

### `src/Redux/Store.js` — The central store

- Combines all reducers into one store.
- The store is where your data lives.

```javascript
import { configureStore } from "@reduxjs/toolkit";
import CounterSlicereducer from "./CounterSlice";

export const Store = configureStore({
  reducer: {
    Counter: CounterSlicereducer,
  },
});
```

**Why separate files?** Keeps slice logic and store setup apart — cleaner code.

**Learning goals (what you'll understand after reading)**

- Why we split code into `slice` and `store` files.
- How `createSlice` auto-generates actions and reducer logic.
- What happens when `dispatch()` is called (action → reducer → new state).
- When to use Redux Toolkit vs `useState`.
- Common pitfalls (case-sensitivity, wrong keys, import/export mistakes).
- How to create reducers that accept inputs (payloads).

**1) Mental model — how Redux works (short)**

- Store: a single object that holds global app state.
- Action: a plain object describing "what happened" (type + optional payload).
- Reducer: a pure function that receives current state + action and returns next state.
- Dispatch: send an action into the system; Redux runs reducers and replaces state.

In Redux Toolkit we write reducers in a concise way and let Immer ensure immutable updates.

**2) `createSlice` — group state + reducers + actions**

The slice bundles three things:

- `name`: used as the action type prefix (e.g. `"Counter/increment"`).
- `initialState`: the starting data shape for this feature.
- `reducers`: functions that update state in response to actions — keys become action names.

Why this matters: keeping the feature's state, reducers, and actions together makes the code easier to read, test, and extend.

Example (exactly what is in `src/Redux/CounterSlice.js`):

```javascript
import { createSlice } from "@reduxjs/toolkit";

export const CounterSlice = createSlice({
  name: "Counter", // action types will be like "Counter/increment"
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementbyfive: (state, action) => {
      state.value += action.payload;
    },
  },
});

// Named exports for action creators — use these with dispatch
export const { increment, decrement, incrementbyfive } = CounterSlice.actions;

// Default export is the reducer function to register in the store
export default CounterSlice.reducer;
```

Teacher notes:

- The reducer functions above look like they mutate `state`. That's allowed because Immer (used by Toolkit) records the changes and returns an immutable result. You still must not perform side effects (e.g., network calls) inside reducers.
- `increment()` is an action creator that returns `{ type: 'Counter/increment' }` under the hood.
- For actions with payloads, like `incrementbyfive(5)`, it returns `{ type: 'Counter/incrementbyfive', payload: 5 }`.

**3) `configureStore` — assemble the app state**

`configureStore` accepts an object of reducers. Keys become top-level keys on the Redux state:

```javascript
import { configureStore } from "@reduxjs/toolkit";
import CounterSlicereducer from "./CounterSlice";

export const Store = configureStore({
  reducer: { Counter: CounterSlicereducer },
});
```

### `src/App.jsx` — The UI

- Shows the counter number.
- Has buttons to increment/decrement by 1.
- Has an input to specify a custom increment amount.
- Uses `useSelector` to read the value and `useDispatch` to send actions.
- Uses local state (`useState`) for the input value.

```jsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { decrement, increment, incrementbyfive } from "./Redux/CounterSlice";

const App = () => {
  const dispatch = useDispatch();
  const [num, setnum] = useState(1);

  const count = useSelector((state) => state.Counter.value);

  return (
    <div>
      <h1>Counter Value : {count} </h1>

      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
      <input
        type="number"
        placeholder="Increase by:"
        value={num}
        onChange={(e) => {
          setnum(e.target.value);
        }}
      />
      <button onClick={() => dispatch(incrementbyfive(Number(num)))}>
        increment by {num}
      </button>
    </div>
  );
};

export default App;
```

---

## The core concepts (simple explanations)

### `useSelector` — Read data from the store

```javascript
const count = useSelector((state) => state.Counter.value);
```

"Give me the Counter value from the store." When the store updates, this re-renders.

### `useDispatch` — Send an action

```javascript
const dispatch = useDispatch();
dispatch(increment());
```

"Tell Redux to run the increment action." This triggers the reducer to increase the counter.

### `useState` — Local component state

```javascript
const [num, setnum] = useState(1);
```

Used for the input value, since it's only needed in this component. Redux is for shared state.

### What happens when you click the button:

1. Button click → calls `dispatch(increment())`.
2. Redux runs the `increment` reducer.
3. Reducer increases `state.value` by 1.
4. Store updates.
5. All components using `useSelector` re-render with the new value.

### What happens with custom increment:

1. User types a number in input → updates local `num` state.
2. User clicks "increment by X" → calls `dispatch(incrementbyfive(Number(num)))`.
3. Redux runs the `incrementbyfive` reducer with `action.payload = num`.
4. Reducer increases `state.value` by `action.payload`.
5. Store updates, UI re-renders.

---

## How to create new reducers (producers) that take input

To add a reducer that accepts a value from the UI:

1. In your slice, add a new reducer function that takes `state` and `action`:

   ```javascript
   reducers: {
     // ... existing
     newAction: (state, action) => {
       state.value += action.payload; // or whatever logic
     },
   },
   ```

2. Export the action creator:

   ```javascript
   export const { newAction } = slice.actions;
   ```

3. In the component, dispatch with the value:
   ```javascript
   dispatch(newAction(someValue));
   ```

This way, the UI can send dynamic data to the reducer via the action's payload.

---

## Why use Redux Toolkit instead of `useState`?

| Scenario                           | Use `useState`   | Use Redux             |
| ---------------------------------- | ---------------- | --------------------- |
| Local form state                   | ✅               | ❌                    |
| Shared data across many components | ❌               | ✅                    |
| Need DevTools/debugging            | ❌               | ✅                    |
| Just a simple counter here         | Could use either | We use Redux to learn |

**Simple rule:** If many components need the same data, use Redux. If only one component uses it, use `useState`.

---

## Important notes (must remember)

- **Case-sensitive:** `Counter` ≠ `counter`. Match the names exactly.
- **Selector key must match store key:** If store uses `{ Counter: ... }`, selector must use `state.Counter`.
- **Reducers must be pure:** No API calls inside reducers.
- **Payloads:** Use `action.payload` to access data sent from dispatch.
- **Default vs named exports:**
  - `export default X` → import any name: `import foo from ...`
  - `export const X` → import exact name: `import { X } from ...`

---

## Quick checklist (to verify understanding)

- [ ] Open `CounterSlice.js` and find where `value` starts at 0.
- [ ] Open `Store.js` and find the key name (`Counter`).
- [ ] Open `App.jsx` and match the store key in the selector.
- [ ] Click the buttons and watch the counter change.
- [ ] Try the custom increment with different values.

---

## Run the project

```bash
npm install
npm install @reduxjs/toolkit react-redux
npm run dev
```

That's it! Now you have a working Redux Toolkit counter with custom increments.

- **Reducers must be pure:** No API calls inside reducers.
- **Default vs named exports:**
  - `export default X` → import any name: `import foo from ...`
  - `export const X` → import exact name: `import { X } from ...`

---

## Quick checklist (to verify understanding)

- [ ] Open `CounterSlice.js` and find where `value` starts at 0.
- [ ] Open `Store.js` and find the key name (`counter`).
- [ ] Open `App.jsx` and match the store key in the selector.
- [ ] Click the buttons and watch the counter change.

---

## Run the project

```bash
npm install
npm install @reduxjs/toolkit react-redux
npm run dev
```

That's it! Now you have a working Redux Toolkit counter.
