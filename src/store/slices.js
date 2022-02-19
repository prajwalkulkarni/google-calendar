import { createSlice } from "@reduxjs/toolkit";

export const dateSlice = createSlice({
  name: "date",
  initialState: {
    day: new Date().toLocaleString("default", { weekday: "long" }),
    date: new Date().getDate(),
    month: new Date().toLocaleString("default", { month: "long" }),
    year: new Date().getFullYear()
  },
  reducers: {
    setDate: (state, action) => {
      // console.log("Not trieggered")
      state.day = action.payload.day;
      state.date = action.payload.date;
      state.month = action.payload.month;
      state.year = action.payload.year;
    }
  }
});

export const modeSlice = createSlice({
  name: "mode",
  initialState: {
    mode: "day",
    calendarVisible: true
  },
  reducers: {
    setMode: (state, action) => {
      state.mode = action.payload.mode;
    },
    changeCalendarVisibility: (state, action) => {
      state.calendarVisible = action.payload.visible;
    }
  }
});

export const eventSlice = createSlice({
  name: "task",
  initialState: {
    tasks: [],
    isUpdate: {
      update: false,
      id: null
    }
  },
  reducers: {
    setTasks: (state, action) => {
      // console.log(action.payload);
      state.tasks = action.payload.tasks;
    },
    addTask: (state, action) => {
      state.tasks.push(action.payload.task);
    },
    updateTask: (state, action) => {
      const copy = state.tasks.slice();

      const item = copy.findIndex((task) => task.id === action.payload.task.id);

      if (item >= 0) {
        copy[item] = action.payload.task;

        state.tasks = [...copy];
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload.id);
    },
    setStatus: (state, action) => {
      // console.log(action.payload)
      state.isUpdate = {
        update: action.payload.state,
        id: action.payload.id
      };
    }
  }
});

export const dateAction = dateSlice.actions;
export const modeAction = modeSlice.actions;

export const taskAction = eventSlice.actions;
