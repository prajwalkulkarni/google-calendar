import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Stack from "@mui/material/Stack";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { timeRows } from "./data";
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

export default function ModalView(props) {
  const [currFrom, setCurrFrom] = useState("");

  const [currTo, setCurrTo] = useState("");
  const [toRange, setToRange] = useState([""]);
  const [title, setTitle] = useState("");
  const titleChange = (e) => setTitle(e.target.value);

  function fromChange(val) {
    const idx = timeRows.findIndex((item) => item === val);
    setToRange(timeRows.slice(idx + 1));
    setCurrFrom(val);
  }

  const selector = useSelector((arg) => arg.task.isUpdate);

  // console.log(selector)
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
        <FormControl
          className="field-block"
          variant="standard"
          sx={{ m: 1, minWidth: 120 }}
        >
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={currFrom}
            onChange={(e) => fromChange(e.target.value)}
          >
            {timeRows.map((time) => {
              return (
                <MenuItem key={Math.random()} value={time}>
                  {time}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <br />
        <FormControl
          className="field-block"
          variant="standard"
          sx={{ m: 1, minWidth: 120 }}
        >
          <Select
            id="demo-simple-select"
            value={currTo}
            onChange={(e) => setCurrTo(e.target.value)}
            label="To"
          >
            {toRange.map((time) => {
              return (
                <MenuItem key={Math.random()} value={time}>
                  {time}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <br />
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button
            className="field-block"
            variant="contained"
            onClick={() => {
              props.handleSubmit(title, currTo, currFrom);
              setCurrFrom("");
              setCurrTo("");
              setToRange([""]);
              setTitle("");
            }}
          >
            Save
          </Button>

          {selector.update && (
            <IconButton
              aria-label="delete"
              onClick={() => props.onDelete(selector.id)}
              size="large"
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Stack>
      </Box>
    </Modal>
  );
}
