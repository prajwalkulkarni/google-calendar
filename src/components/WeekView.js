import { useEffect, useState } from "react";

import { Filler } from "./Filler";
import ModalView from "../utils/ModalView";

import { useSelector, useDispatch } from "react-redux";
import { taskAction } from "../store/slices";

import { timeRows, weekdays } from "../utils/data";
import {
  computeFillerHeightWeekView,
  dateRangeCalculator
} from "../utils/misc";
import "./CalendarView.css";

const gridRows = new Array(24).fill(new Array(7).fill(7));
export default function WeekView() {
  //Dispatch instance
  const dispatch = useDispatch();

  //Selectors
  const dateSelector = useSelector((arg) => arg.date);
  const selector = useSelector((arg) => arg.task.tasks);
  const updateSelector = useSelector((arg) => arg.task.isUpdate);

  //Component states
  const [open, setOpen] = useState(false);
  const [leftOffset, setLeftOffset] = useState(0);
  const [updateLeftOffset, setUpdateLeftOffset] = useState(0);
  const [currSelectMonthDate, setCurrSelectMonthDate] = useState({
    date: dateSelector.date,
    month: dateSelector.month
  });

  const [weekDate, setWeekDate] = useState([]);

  //Filtered results
  const tasksOnDate = selector?.filter((task) =>
    weekDate.some((obj) => obj.date === task.date && obj.month === task.month)
  );

  const dayIndex = weekdays.findIndex((day) => day === dateSelector.day);

  //Side effects handlers
  useEffect(() => {
    // console.log(dateSelector.month)
    const datesToDays = dateRangeCalculator(dateSelector, dayIndex);
    setWeekDate(datesToDays);
  }, [dateSelector, dayIndex]);

  useEffect(() => {
    dispatch(
      taskAction.setTasks({
        tasks: JSON.parse(localStorage.getItem("tasks")) ?? []
      })
    );
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(selector));
  }, [selector]);

  //Handlers
  const handleOpen = (idx, weekdate) => {
    // console.log(weekdate)

    dispatch(taskAction.setStatus({ state: false, id: null }));
    setCurrSelectMonthDate(weekdate);
    setLeftOffset(idx);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const deleteTask = (id) => {
    dispatch(taskAction.deleteTask({ id }));
    handleClose();
  };

  const handleUpdate = (id, weekdate, updateOffset) => {
    // console.log(idx, weekdate);
    dispatch(taskAction.setStatus({ state: true, id }));
    setCurrSelectMonthDate(weekdate);
    setUpdateLeftOffset(updateOffset);
    setOpen(true);
  };
  const taskUpdateHandler = (title, currTo, currFrom) => {
    const [fromPos, toPos, leftPos] = computeFillerHeightWeekView(
      currFrom,
      currTo,
      leftOffset
    );
    dispatch(
      taskAction.updateTask({
        task: {
          id: updateSelector.id,
          title,
          fromPos,
          toPos,
          left: updateLeftOffset,
          date: currSelectMonthDate.date,
          month: currSelectMonthDate.month,
          fromTime: currFrom,
          toTime: currTo,
          year: dateSelector.year
        }
      })
    );

    handleClose();
  };

  const handleSubmit = (title, currTo, currFrom) => {
    if (title.length > 3 && currTo.length >= 3 && currFrom.length >= 3) {
      // console.log("Ok");

      if (updateSelector.update) {
        console.log("Update stage");
        taskUpdateHandler(title, currTo, currFrom);
        return;
      }

      // console.log(computeFillerHeight(currFrom, currTo)[2]);
      const [fromPos, toPos, left] = computeFillerHeightWeekView(
        currFrom,
        currTo,
        leftOffset
      );
      dispatch(
        taskAction.addTask({
          task: {
            id: Math.random(),
            title,
            fromPos,
            toPos,
            left,
            date: currSelectMonthDate.date,
            month: currSelectMonthDate.month,
            fromTime: currFrom,
            toTime: currTo,
            year: dateSelector.year
          }
        })
      );
      handleClose();
    }
  };

  const renderDays = weekdays.map((col, index) => {
    return (
      <div className="grid-item" key={Math.random()}>
        <p className="timelabel__month">{col}</p>
        <h2 className="timelabel__date">{weekDate[index]?.date}</h2>
      </div>
    );
  });

  const taskOverlays = tasksOnDate?.map((task, idx) => {
    return (
      <Filler
        key={task.id}
        height={task.fromPos}
        top={task.toPos + 50}
        width="true"
        left={
          task.left ??
          weekDate.findIndex((obj) => obj.date === task.date) * 14.28
        }
        onClick={(e) => {
          e.stopPropagation();
          handleUpdate(
            task.id,
            { date: task.date, month: task.month },
            task.left ??
              weekDate.findIndex((obj) => obj.date === task.date) * 14.28
          );
        }}
      >
        <p style={{ color: "white", padding: "0.5rem" }}>
          <b>{task.title}</b>
        </p>
      </Filler>
    );
  });

  const timeSlots = gridRows.map((time, index) => {
    return time.map((block, idx) => {
      return (
        <div
          className="grid-item"
          key={Math.random()}
          onClick={() => handleOpen(idx, weekDate[idx])}
        >
          <p className="timelabel">{timeRows[index]}</p>
        </div>
      );
    });
  });

  return (
    <div className="grid-weekview">
      <ModalView
        open={open}
        close={handleClose}
        handleSubmit={handleSubmit}
        onDelete={deleteTask}
      />

      {renderDays}
      {taskOverlays}
      {timeSlots}
    </div>
  );
}
