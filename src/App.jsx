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
