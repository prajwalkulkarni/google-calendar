import { configureStore } from "@reduxjs/toolkit";

import { dateSlice, modeSlice, eventSlice } from "./slices";
const store = configureStore({
  reducer: {
    date: dateSlice.reducer,
    mode: modeSlice.reducer,
    task: eventSlice.reducer
  }
});

export default store;
