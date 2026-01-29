import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { decrement, increment } from "./Redux/CounterSlice";

const App = () => {
  const dispatch = useDispatch();

  const count = useSelector((state) => state.Counter.value);

  return (
    <div>
      <h1>Counter Value : {count} </h1>

      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
    </div>
  );
};

export default App;
