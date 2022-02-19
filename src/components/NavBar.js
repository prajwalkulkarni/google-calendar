import "./NavBar.css";
import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

import { useDispatch, useSelector } from "react-redux";

import { modeAction } from "../store/slices";
export default function NavBar(props) {
  const selector = useSelector((arg) => arg.mode);

  const dateSelector = useSelector((arg) => arg.date);
  // const [time, setTime] = React.useState(selector);
  const dispatch = useDispatch();

  const handleChange = (event) => {
    // setTime(event.target.value);
    dispatch(modeAction.setMode({ mode: event.target.value }));
  };

  const visibilityHandler = () => {
    dispatch(
      modeAction.changeCalendarVisibility({
        visible: !selector.calendarVisible
      })
    );
  };
  return (
    <div className="header">
      <div>
        <IconButton
          aria-label="delete"
          onClick={visibilityHandler}
          size="large"
        >
          <MenuIcon fontSize="inherit" />
        </IconButton>
        <h2 style={{ display: "inline" }}>Calendar</h2>
      </div>
      <div>
        <h3 className="timelabel__date">
          {dateSelector.date}, {dateSelector.month}
        </h3>
      </div>

      <div>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Time</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selector.mode}
              label="Timeline"
              onChange={handleChange}
            >
              <MenuItem value={"day"}>Day</MenuItem>
              <MenuItem value={"week"}>Week</MenuItem>
              <MenuItem value={"month"}>Month</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </div>
    </div>
  );
}
