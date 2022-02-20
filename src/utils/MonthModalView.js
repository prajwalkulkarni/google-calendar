import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import * as React from "react";

import DateRangePicker from "@mui/lab/DateRangePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "block"
};

export default function MonthModalView(props) {
  const [value, setValue] = React.useState([null, null]);

  const [title, setTitle] = useState("");
  const titleChange = (e) => setTitle(e.target.value);

  const selector = useSelector((arg) => arg.monthtask.isUpdate);
  // console.log(value)
  return (
    <Modal
      open={props.open}
      onClose={props.close}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <TextField
          id="standard-basic"
          label="Title"
          variant="standard"
          value={title}
          className="field-block"
          onChange={titleChange}
        />
        <br />
        <br />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateRangePicker
            startText="From"
            endText="To"
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
            }}
            renderInput={(startProps, endProps) => (
              <React.Fragment>
                <TextField {...startProps} />
                <Box sx={{ mx: 2 }}> to </Box>
                <TextField {...endProps} />
              </React.Fragment>
            )}
          />
        </LocalizationProvider>
        <br />
        <Button
          className="field-block"
          variant="contained"
          onClick={() => {
            props.handleSubmit(title, value[0], value[1]);
          }}
        >
          Save
        </Button>
        &nbsp; &nbsp;
        {selector.update && (
          <Button
            className="field-block"
            variant="contained"
            onClick={() => props.onDelete(selector.id)}
          >
            Delete
          </Button>
        )}
      </Box>
    </Modal>
  );
}
