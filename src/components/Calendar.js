import * as React from "react";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import StaticDatePicker from "@mui/lab/StaticDatePicker";
import { useDispatch, useSelector } from "react-redux";
import { dateAction } from "../store/slices";
import "./CalendarView.css";
export default function Calendar() {
  const [value, setValue] = React.useState(new Date());

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(
      dateAction.setDate({
        day: value.toLocaleString("default", { weekday: "long" }),
        date: value.getDate(),
        month: value.toLocaleString("default", { month: "long" }),
        year: value.getFullYear()
      })
    );
  }, [value, dispatch]);

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <StaticDatePicker
          displayStaticWrapperAs="desktop"
          openTo="day"
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          className="datepicker"
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </div>
  );
}
