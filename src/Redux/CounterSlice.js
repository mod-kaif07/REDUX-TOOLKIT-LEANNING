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
    incrementbyfive: (state, actions) => {
      state.value += actions.payload;
    },
  },
});
export const { increment, decrement, incrementbyfive } = CounterSlice.actions;

export default CounterSlice.reducer;
