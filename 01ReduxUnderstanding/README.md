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
- Defines actions: `increment` and `decrement`.
- Each action is a button you press to change the number.

```javascript
import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
  },
});

export const { increment, decrement } = counterSlice.actions;
export default counterSlice.reducer;
```

**Why this way?** All counter logic is in one file — easy to find and update.

### `src/Redux/Store.js` — The central store

- Combines all reducers into one store.
- The store is where your data lives.

```javascript
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./CounterSlice";

export const Store = configureStore({
  reducer: { counter: counterReducer },
});
```

**Why separate files?** Keeps slice logic and store setup apart — cleaner code.

### `src/App.jsx` — The UI

- Shows the counter number.
- Has buttons to increment/decrement.
- Uses `useSelector` to read the value and `useDispatch` to send actions.

```jsx
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement } from "./Redux/CounterSlice";

const App = () => {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
    </div>
  );
};

export default App;
```

---

## The core concepts (simple explanations)

### `useSelector` — Read data from the store

```javascript
const count = useSelector((state) => state.counter.value);
```

"Give me the counter value from the store." When the store updates, this re-renders.

### `useDispatch` — Send an action

```javascript
const dispatch = useDispatch();
dispatch(increment());
```

"Tell Redux to run the increment action." This triggers the reducer to increase the counter.

### What happens when you click the button:

1. Button click → calls `dispatch(increment())`.
2. Redux runs the `increment` reducer.
3. Reducer increases `state.value` by 1.
4. Store updates.
5. All components using `useSelector` re-render with the new value.

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

- **Case-sensitive:** `counter` ≠ `Counter`. Use lowercase everywhere.
- **Selector key must match store key:** If store uses `{ counter: ... }`, selector must use `state.counter`.
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
