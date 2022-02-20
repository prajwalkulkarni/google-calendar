import { configureStore } from "@reduxjs/toolkit";

import { dateSlice, modeSlice, eventSlice, monthTaskSlice } from "./slices";
const store = configureStore({
  reducer: {
    date: dateSlice.reducer,
    mode: modeSlice.reducer,
    task: eventSlice.reducer,
    monthtask: monthTaskSlice.reducer
  }
});

export default store;
