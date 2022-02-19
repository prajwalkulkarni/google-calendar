import { useState, useEffect } from "react";

import { taskAction } from "../store/slices";
import { useDispatch, useSelector } from "react-redux";

import { timeRows } from "../utils/data";
import { computeFillerHeight } from "../utils/misc";

import { Filler } from "./Filler";
import ModalView from "../utils/ModalView";
import "./CalendarView.css";

export default function DayView() {
  //Dispatch instance
  const dispatch = useDispatch();

  //Selectors
  const selector = useSelector((arg) => arg.task.tasks);
  const updateSelector = useSelector((arg) => arg.task.isUpdate);
  const dateSelector = useSelector((arg) => arg.date);

  //Component states
  const [open, setOpen] = useState(false);

  //Filtered results
  const tasksOnDate = selector?.filter(
    (task) =>
      task.date === dateSelector.date && task.month === dateSelector.month
  );

  //Side effect handling

  useEffect(() => {
    dispatch(
      taskAction.setTasks({
        tasks: JSON.parse(localStorage.getItem("tasks")) ?? []
      })
    );
  }, [dispatch]);

  useEffect(() => {
    console.log("CRUD occured");
    localStorage.setItem("tasks", JSON.stringify(selector));
  }, [selector]);

  //Handlers
  const handleOpen = () => {
    dispatch(taskAction.setStatus({ state: false, id: null }));
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleUpdate = (id) => {
    dispatch(taskAction.setStatus({ state: true, id }));
    setOpen(true);
  };

  const deleteTask = (id) => {
    dispatch(taskAction.deleteTask({ id }));
    handleClose();
  };

  const taskUpdateHandler = (title, currTo, currFrom) => {
    dispatch(
      taskAction.updateTask({
        task: {
          id: updateSelector.id,
          title,
          fromPos: computeFillerHeight(currFrom, currTo)[0],
          toPos: computeFillerHeight(currFrom, currTo)[1],
          left: null,
          date: dateSelector.date,
          month: dateSelector.month,
          day: dateSelector.day,
          year: dateSelector.year,
          fromTime: currFrom,
          toTime: currTo
        }
      })
    );

    handleClose();
  };
  const handleSubmit = (title, currTo, currFrom) => {
    if (title.length > 3 && currTo.length >= 3 && currFrom.length >= 3) {
      if (updateSelector.update) {
        console.log("Update stage");
        taskUpdateHandler(title, currTo, currFrom);
        return;
      }
      dispatch(
        taskAction.addTask({
          task: {
            id: Math.random(),
            title,
            fromPos: computeFillerHeight(currFrom, currTo)[0],
            toPos: computeFillerHeight(currFrom, currTo)[1],
            date: dateSelector.date,
            month: dateSelector.month,
            fromTime: currFrom,
            toTime: currTo,
            year: dateSelector.year
          }
        })
      );

      handleClose();
    }
  };

  //Sub-component renderers
  const taskOverlays = tasksOnDate?.map((task) => {
    return (
      <Filler
        key={task.id}
        height={task.fromPos}
        top={task.toPos}
        onClick={(e) => {
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
          handleUpdate(task.id);
          // handleUpdate(task.id, task.fromTime, task.toTime, task.title);
        }}
      >
        <p style={{ color: "white", padding: "0.5rem" }}>
          <b>{task.title}</b>
        </p>
      </Filler>
    );
  });

  const timeSlots = timeRows.map((time) => {
    return (
      <div key={Math.random()} className="grid-item" onClick={handleOpen}>
        <p className="timelabel">{time}</p>
      </div>
    );
  });

  return (
    <div className="parent-grid">
      <ModalView
        open={open}
        close={handleClose}
        handleSubmit={handleSubmit}
        onDelete={deleteTask}
      />

      {taskOverlays}
      {timeSlots}
    </div>
  );
}
