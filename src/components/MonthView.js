import { useState } from "react";
import "./CalendarView.css";
import FillerWrapper from "./FillerWrapper";

import { modeAction, dateAction, monthTaskAction } from "../store/slices";
import { weekdays, months } from "../utils/data";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import MonthModalView from "../utils/MonthModalView";
const monthRows = new Array(5).fill(new Array(7).fill(7));

export default function WeekView() {
  const dateSelector = useSelector((arg) => arg.date);
  const monthTaskSelector = useSelector((arg) => arg.monthtask);

  const [weekDate, setWeekDate] = useState([]);
  const [open, setOpen] = useState(false);
  // console.log(weekDate,selector)
  const dispatch = useDispatch();
  const dayIndex = weekdays.findIndex((day) => day === dateSelector.day);

  useEffect(() => {
    // console.log(dateSelector.month)
    const datesToDays = [];
    const daysInTheMonth = new Date(
      dateSelector.year,
      months[dateSelector.month] + 1,
      0
    ).getDate();

    // console.log(daysInTheMonth);
    const start = dateSelector.date - dayIndex;
    for (let i = start; i < start + 35; ++i) {
      if (i <= 0) {
        datesToDays.push({
          date:
            new Date(
              dateSelector.year,
              months[dateSelector.month],
              0
            ).getDate() + i,
          month: new Date(
            dateSelector.year,
            months[dateSelector.month],
            0
          ).toLocaleString("default", { month: "long" })
        });
      } else {
        if (i > daysInTheMonth) {
          datesToDays.push({
            date: i - daysInTheMonth,
            month: Object.keys(months).find(
              (k) => months[k] === months[dateSelector.month] + 1
            )
          });
        } else {
          datesToDays.push({ date: i, month: dateSelector.month });
        }
      }
    }
    const splittedArray = [];
    while (datesToDays.length > 0) {
      splittedArray.push(datesToDays.splice(0, 7));
    }
    setWeekDate(splittedArray);
  }, [
    dateSelector.month,
    dateSelector.year,
    dateSelector.date,
    dateSelector.day,
    dayIndex
  ]);

  const handleOpen = () => {
    console.log("Regular open");
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
    console.log(id);
    dispatch(monthTaskAction.setStatus({ state: true, id }));
    setOpen(true);
  };

  const deleteTask = () => {
    console.log(monthTaskSelector.isUpdate.id);
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
    if (currDate === toDate && currMonth === toMonth) {
      if (monthTaskSelector.monthtasks[i + 1]) {
        i += 1;
      }
      return (
        // <FillerWrapper
        //   title={title}
        //   onClick={(e) => {
        //     e.stopPropagation();
        //     e.nativeEvent.stopImmediatePropagation();
        //     handleUpdate(id);
        //   }}
        //   onDelete={deleteTask}
        // >
        //   {title}
        // </FillerWrapper>
        <div
          style={{
            position: "absolute",
            top: "50%",
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
            top: "50%",
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

  // console.log(weekDate);
  let i = 0;
  return (
    <div className="grid-monthview">
      <MonthModalView
        open={open}
        close={handleClose}
        handleSubmit={handleSubmit}
        onDelete={deleteTask}
      />

      {weekdays.map((weekday) => {
        return (
          <div className="grid-item" key={Math.random()}>
            <p className="timelabel__date">{weekday}</p>
          </div>
        );
      })}
      {monthRows.map((week, index) => {
        return week.map((day, idx) => {
          return (
            <div
              className="grid-item-week"
              key={Math.random()}
              onClick={handleOpen}
            >
              {weekDate.length > 0 ? (
                <>
                  <p className="timelabel__date">
                    {weekDate[index][idx]?.month}
                  </p>
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
                    {weekDate[index][idx]?.date}
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
      })}
    </div>
  );
}
