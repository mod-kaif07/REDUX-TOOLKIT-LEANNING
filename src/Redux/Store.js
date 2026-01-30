import { configureStore } from "@reduxjs/toolkit";
import CounterSlicereducer  from "./CounterSlice";

export const Store = configureStore({
  reducer: {
    Counter:CounterSlicereducer
  },
});
