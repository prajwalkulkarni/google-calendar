import React from "react";
import CalendarView from "./Calendar";
import DayView from "./DayView";
import MonthView from "./MonthView";
import WeekView from "./WeekView";
import "./ViewWrapper.css";
import { useSelector } from "react-redux";

export default function ViewWrapper() {
  const render = useSelector((arg) => arg.mode);

  const renderComponent = () => {
    let rtr;
    switch (render.mode) {
      case "day":
        rtr = <DayView />;
        break;
      case "week":
        rtr = <WeekView />;
        break;
      case "month":
        rtr = <MonthView />;
        break;
      default:
        rtr = <DayView />;
        break;
    }
    return rtr;
  };

  // console.log(renderComponent)
  return (
    <div className="view_wrapper">
      {/* {render.calendarVisible && (
        <div className="wt1">
          <CalendarView />
        </div>
      )} */}
      <div className={`drawer ${render.calendarVisible && "visible"}`}>
        <CalendarView />
      </div>
      {renderComponent()}
    </div>
  );
}
