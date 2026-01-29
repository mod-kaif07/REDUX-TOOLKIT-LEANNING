# Redux Toolkit — Counter Example

This repository is a minimal React + Vite project that demonstrates using Redux Toolkit to build a simple counter.

**Quick links**

- Slice: [src/Redux/CounterSlice.js](src/Redux/CounterSlice.js)
- Store: [src/Redux/Store.js](src/Redux/Store.js)
- App component: [src/App.jsx](src/App.jsx)
- Entry: [src/main.jsx](src/main.jsx)

## Overview

This guide explains why the project is organized the way it is, how `createSlice` and `configureStore` work, how components use `useDispatch` and `useSelector`, and when to prefer Redux Toolkit over `useState`.

## File responsibilities

- `src/Redux/CounterSlice.js`: Defines the counter slice (state shape, reducers, auto-generated actions). The slice groups related logic and keeps reducers co-located with action creators.
- `src/Redux/Store.js`: Creates the Redux store using `configureStore` and registers slice reducers. Central store configuration (middleware, devtools) lives here.
- `src/App.jsx`: UI that reads state and dispatches actions using `useSelector` and `useDispatch`.
- `src/main.jsx`: App entry — wraps the React tree with `<Provider store={Store}>` so components can access the store.

## Why this structure?

- Separation of concerns: each feature (slice) owns its state and reducers.
- Scalability: add new slices for new features and register them in the store.
- Single source of truth: global state is in one predictable place.

## Key concepts (teacher-style)

- `createSlice`
  - Purpose: define `name`, `initialState`, and `reducers` in one place.
  - Outcome: it returns a slice object with `actions` (action creators) and `reducer` ready to use.
  - Example reducer (written as "mutating" code): Immer translates these changes into immutable updates.

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

- `configureStore`
  - Purpose: create the store with sensible defaults (DevTools, thunk middleware).
  - How reducers map: the keys you provide become top-level keys on `state`.

````javascript
 # Redux Toolkit — Counter Example (Teacher-style)

This repository is a small, focused example that shows how to use Redux Toolkit with React to build a predictable, testable counter. Read this file like lecture notes — it explains the "why" as well as the "how" so you can return later and understand every line.

**Quick links**
- Slice: [src/Redux/CounterSlice.js](src/Redux/CounterSlice.js)
- Store: [src/Redux/Store.js](src/Redux/Store.js)
- App component: [src/App.jsx](src/App.jsx)
- Entry: [src/main.jsx](src/main.jsx)

**Learning goals (what you'll understand after reading)**
- Why we split code into `slice` and `store` files.
- How `createSlice` auto-generates actions and reducer logic.
- What happens when `dispatch()` is called (action → reducer → new state).
- When to use Redux Toolkit vs `useState`.
- Common pitfalls (case-sensitivity, wrong keys, import/export mistakes).

**1) Mental model — how Redux works (short)**
- Store: a single object that holds global app state.
- Action: a plain object describing "what happened" (type + optional payload).
- Reducer: a pure function that receives current state + action and returns next state.
- Dispatch: send an action into the system; Redux runs reducers and replaces state.

In Redux Toolkit we write reducers in a concise way and let Immer ensure immutable updates.

**2) `createSlice` — group state + reducers + actions**

The slice bundles three things:
- `name`: used as the action type prefix (e.g. `"counter/increment"`).
- `initialState`: the starting data shape for this feature.
- `reducers`: functions that update state in response to actions — keys become action names.

Why this matters: keeping the feature's state, reducers, and actions together makes the code easier to read, test, and extend.

Example (exactly what is in `src/Redux/CounterSlice.js`):

```javascript
import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter", // action types will be like "counter/increment"
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1; },
    decrement: (state) => { state.value -= 1; }
  }
});

// Named exports for action creators — use these with dispatch
export const { increment, decrement } = counterSlice.actions;

// Default export is the reducer function to register in the store
export default counterSlice.reducer;
````

Teacher notes:

- The reducer functions above look like they mutate `state`. That's allowed because Immer (used by Toolkit) records the changes and returns an immutable result. You still must not perform side effects (e.g., network calls) inside reducers.
- `increment()` is an action creator that returns `{ type: 'counter/increment' }` under the hood.

**3) `configureStore` — assemble the app state**

`configureStore` accepts an object of reducers. Keys become top-level keys on the Redux state:

```javascript
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./CounterSlice";

export const Store = configureStore({
  reducer: { counter: counterReducer },
});
```

So, the state shape will be: `{ counter: { value: 0 } }`.

Teacher note: the key you choose here (e.g., `counter`) must match how you read state in `useSelector`.

**4) From UI to state — `useDispatch` and `useSelector`**

Components interact with Redux via two hooks:

- `useDispatch()` — returns the `dispatch` function to send actions.
- `useSelector(selector)` — reads values from the store; selectors receive the whole state.

Example extracted from `src/App.jsx`:

```jsx
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement } from "./Redux/CounterSlice";

const count = useSelector(state => state.counter.value);
const dispatch = useDispatch();

<button onClick={() => dispatch(increment())}>Increment</button>
<button onClick={() => dispatch(decrement())}>Decrement</button>
```

What happens when you press "Increment":

1. `increment()` returns an action `{ type: 'counter/increment' }`.
2. `dispatch(action)` sends it to the store.
3. The store runs all reducers; the `counter` reducer handles this action and updates `value`.
4. The store publishes the new state and React re-renders any components subscribing with `useSelector`.

**5) Why use Redux Toolkit instead of `useState`?**

- `useState` is perfect for local component state (form inputs, local UI toggles).
- Use Redux Toolkit when you need a shared, centralized, predictable state across multiple components or when you want to use middlewares and DevTools.
- Toolkit reduces boilerplate (no action type constants, no switch statements) and safely handles immutability with Immer.

**6) Naming, case, and import/export gotchas (common student mistakes)**

- JavaScript is case-sensitive: `counter` !== `Counter`. Keep naming consistent.
- The reducer key in `configureStore` decides the selector path: `reducer: { Counter: counterReducer }` → `state.Counter.value`. If you use `counter` instead, use `state.counter.value`.
- Default export vs named export:
  - Default export: `export default counterSlice.reducer;` → import without braces and with any name: `import myReducer from './Redux/CounterSlice'`.
  - Named export: `export const increment = ...` → import with exact name or alias: `import { increment } from './Redux/CounterSlice'` or `import { increment as inc } ...`.

**7) Best practices and tests**

- Export simple selectors from the slice file: `export const selectCount = state => state.counter.value;` — keeps selectors in one place and makes tests simpler.
- Keep reducers pure: no async calls, no logging side effects inside reducers.
- Test reducers by importing the reducer function and calling it with a state and an action, verifying the returned state.

Example unit test idea (pseudo):

```javascript
import reducer, { increment } from "./Redux/CounterSlice";

const initial = { value: 0 };
const next = reducer(initial, increment());
expect(next.value).toBe(1);
```

**8) How to run this project (quick)**
Install dependencies:

```bash
npm install
npm install @reduxjs/toolkit react-redux
```

Start dev server:

```bash
npm run dev
```

**9) Quick checklist (for students)**

1. Open `src/Redux/CounterSlice.js`: identify `name`, `initialState`, and `reducers`.
2. Open `src/Redux/Store.js`: note the reducer key and how state shape is derived.
3. Open `src/App.jsx`: find `useSelector` and `useDispatch` usage and follow the dispatch flow.
4. Change the slice name or store key and observe how selectors must be updated — this reinforces the relationship.

---

If you'd like, I can make two small, hands-on changes to reinforce learning:

- Rename the store key to `counter` (lowercase) and update `App.jsx` for consistency.
- Add `export const selectCount = state => state.counter.value;` to `src/Redux/CounterSlice.js` and use it in `App.jsx`.
  Tell me which one you prefer and I'll apply the change.
