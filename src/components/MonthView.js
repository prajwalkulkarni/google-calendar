import { useState } from "react";
import "./CalendarView.css";
import { monthGridDrawer } from "../utils/misc";

import IconButton from "@mui/material/IconButton";

import { modeAction, dateAction, monthTaskAction } from "../store/slices";
import { weekdays, months } from "../utils/data";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import MonthModalView from "../utils/MonthModalView";
const monthRows = new Array(5).fill(new Array(7).fill(7));

export default function WeekView() {
  //Dispatch instance
  const dispatch = useDispatch();

  //State selectors
  const dateSelector = useSelector((arg) => arg.date);
  const monthTaskSelector = useSelector((arg) => arg.monthtask);

  //Component state
  const [weekDate, setWeekDate] = useState([]);
  const [open, setOpen] = useState(false);
  // console.log(weekDate,selector)

  //Filtered results
  const dayIndex = weekdays.findIndex((day) => day === dateSelector.day);

  //Side effect handlers
  useEffect(() => {
    // console.log(dateSelector.month)
    const splittedArray = monthGridDrawer(dateSelector, dayIndex);
    setWeekDate(splittedArray);
  }, [dateSelector, dayIndex]);

  useEffect(() => {
    // console.log(JSON.parse(localStorage.getItem("monthtasks")))
    dispatch(
      monthTaskAction.setTasks({
        tasks: JSON.parse(localStorage.getItem("monthtasks")) ?? []
      })
    );
  }, [dispatch]);

  useEffect(() => {
    // console.log(monthTaskSelector.monthtasks);
    localStorage.setItem(
      "monthtasks",
      JSON.stringify(monthTaskSelector.monthtasks)
    );
  }, [monthTaskSelector.monthtasks]);

  //Function handlers
  const handleOpen = () => {
    // console.log("Regular open");
    dispatch(monthTaskAction.setStatus({ state: false, id: null }));
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const taskUpdateHandler = (title, fromDate, fromMonth, toDate, toMonth) => {
    dispatch(
      monthTaskAction.updateTask({
        task: {
          id: monthTaskSelector.isUpdate.id,
          title,
          fromDate,
          fromMonth,
          toDate,
          toMonth
        }
      })
    );

    handleClose();
  };
  const handleSubmit = (title, from, to) => {
    const fromDate = from.getDate();
    const fromMonth = from.getMonth();
    const toDate = to.getDate();
    const toMonth = to.getMonth();
    if (monthTaskSelector.isUpdate.update) {
      console.log("Update stage");
      taskUpdateHandler(title, fromDate, fromMonth, toDate, toMonth);
      return;
    }

    if (title.length > 1 && fromDate && toDate) {
      dispatch(
        monthTaskAction.addTask({
          task: {
            title,
            fromDate,
            fromMonth,
            toDate,
            toMonth,
            id: Math.random()
          }
        })
      );

      handleClose();
    }
  };

  const handleUpdate = (id) => {
    // console.log(id);
    dispatch(monthTaskAction.setStatus({ state: true, id }));
    setOpen(true);
  };

  const deleteTask = () => {
    // console.log(monthTaskSelector.isUpdate.id);
    dispatch(
      monthTaskAction.deleteTask({
        id: monthTaskSelector.isUpdate.id
      })
    );

    handleClose();
  };
  const navigateHandler = (date, day, month) => {
    dispatch(
      dateAction.setDate({
        day: day,
        date: date,
        month: month,
        year: new Date().getFullYear()
      })
    );

    dispatch(modeAction.setMode({ mode: "day" }));
  };

  const taskFiller = (
    title,
    currDate,
    currMonth,
    fromDate,
    fromMonth,
    toDate,
    toMonth,
    id
  ) => {
    currMonth = Object.values(months).findIndex(
      (month) => months[currMonth] === month
    );
    if (currDate === fromDate && currMonth === fromMonth) {
      return (
        <div
          style={{
            position: "absolute",
            top: "70%",
            width: "97%",
            left: "5%",
            borderRadius: "5px 0px 0px 5px",
            zIndex: 15,
            backgroundColor: "red"
          }}
          onClick={(e) => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            handleUpdate(id);
          }}
        >
          {title}
        </div>
      );
    } else if (currDate === toDate && currMonth === toMonth) {
      if (monthTaskSelector.monthtasks[i + 1]) {
        i += 1;
      }
      return (
        <div
          style={{
            position: "absolute",
            top: "70%",
            width: "95%",
            borderRadius: "0px 5px 5px 0px",
            zIndex: 15,
            backgroundColor: "red"
          }}
          onClick={(e) => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            handleUpdate(id);
          }}
        >
          {title}
        </div>
      );
    } else if (
      (fromMonth === toMonth &&
        currDate >= fromDate &&
        currDate <= toDate &&
        currMonth === toMonth) ||
      (toMonth > fromMonth &&
        currDate >= fromDate &&
        currMonth === fromMonth) ||
      (toMonth > fromMonth && currDate <= toDate && currMonth === toMonth)
    ) {
      return (
        <div
          style={{
            position: "absolute",
            top: "70%",
            width: "102%",
            zIndex: 15,
            backgroundColor: "red"
          }}
          onClick={(e) => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            handleUpdate(id);
          }}
        >
          {title}
        </div>
      );
    }
  };

  let i = 0;

  const weekDaysLabel = weekdays.map((weekday) => {
    return (
      <div className="grid-item" key={Math.random()}>
        <p className="timelabel__date">{weekday}</p>
      </div>
    );
  });

  const mapTasksToDays = monthRows.map((week, index) => {
    return week.map((day, idx) => {
      return (
        <div
          className="grid-item-week"
          key={Math.random()}
          onClick={handleOpen}
        >
          {weekDate.length > 0 ? (
            <>
              <p className="timelabel__date">{weekDate[index][idx]?.month}</p>
              <p
                className="timelabel__date"
                onClick={() =>
                  navigateHandler(
                    weekDate[index][idx]?.date,
                    weekdays[idx],
                    weekDate[index][idx]?.month
                  )
                }
              >
                <IconButton
                 size="small">
                 {weekDate[index][idx]?.date}
               
                </IconButton>
               
              </p>
              {monthTaskSelector.monthtasks.length > 0
                ? taskFiller(
                    monthTaskSelector.monthtasks[i].title,
                    weekDate[index][idx]?.date,
                    weekDate[index][idx]?.month,
                    monthTaskSelector.monthtasks[i].fromDate,
                    monthTaskSelector.monthtasks[i].fromMonth,
                    monthTaskSelector.monthtasks[i].toDate,
                    monthTaskSelector.monthtasks[i].toMonth,
                    monthTaskSelector.monthtasks[i].id
                  )
                : null}
            </>
          ) : null}
        </div>
      );
    });
  });

  return (
    <div className="grid-monthview">
      <MonthModalView
        open={open}
        close={handleClose}
        handleSubmit={handleSubmit}
        onDelete={deleteTask}
      />

      {weekDaysLabel}
      {mapTasksToDays}
    </div>
  );
}
