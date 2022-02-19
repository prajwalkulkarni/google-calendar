import { useState } from "react";
import "./CalendarView.css";

import { modeAction, dateAction } from "../store/slices";
import { weekdays, months } from "../utils/data";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

const monthRows = new Array(5).fill(new Array(7).fill(7));

export default function WeekView() {
  const dateSelector = useSelector((arg) => arg.date);

  const [weekDate, setWeekDate] = useState([]);

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

  // console.log(weekDate);

  return (
    <div className="grid-monthview">
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
              className="grid-item"
              key={Math.random()}
              onClick={() =>
                navigateHandler(
                  weekDate[index][idx]?.date,
                  weekdays[idx],
                  weekDate[index][idx]?.month
                )
              }
            >
              {weekDate.length > 0 ? (
                <p className="timelabel__date">{weekDate[index][idx]?.month}</p>
              ) : null}
              {weekDate.length > 0 ? (
                <p className="timelabel__date">{weekDate[index][idx]?.date}</p>
              ) : null}
            </div>
          );
        });
      })}
    </div>
  );
}
