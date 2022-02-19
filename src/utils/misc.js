import { months } from "./data";

export const computeFillerHeight = (currFrom, currTo) => {
  let height = 0;
  let top = 0;
  const absFrom = parseInt(currFrom);
  const absTo = parseInt(currTo);

  const fromMeridian = currFrom.includes("AM") ? "AM" : "PM";
  const toMeridian = currTo.includes("AM") ? "AM" : "PM";

  switch (toMeridian) {
    case "AM":
      height = (absTo - absFrom) * 50;
      top = absFrom * 50;
      break;
    case "PM":
      if (fromMeridian === "PM") {
        height = (absFrom === 12 ? absTo : absTo - absFrom) * 50;
        top = (absFrom === 12 ? absFrom : absFrom + 12) * 50;
      } else {
        height = ((absTo < 10 ? 12 + absTo : absTo) - absFrom) * 50;

        top = absFrom * 50;
      }
      break;
    default:
      height = absTo - absFrom;
      top = (absFrom - 1) * 50;
  }

  return [height, top];
};

export const computeFillerHeightWeekView = (currFrom, currTo, leftOffset) => {
  let height = 0;
  let top = 0;
  const left = leftOffset * 14.28;
  const absFrom = parseInt(currFrom);
  const absTo = parseInt(currTo);

  const fromMeridian = currFrom.includes("AM") ? "AM" : "PM";
  const toMeridian = currTo.includes("AM") ? "AM" : "PM";

  switch (toMeridian) {
    case "AM":
      height = (absTo - absFrom) * 50;
      top = absFrom * 50;

      break;
    case "PM":
      if (fromMeridian === "PM") {
        height = (absFrom === 12 ? absTo : absTo - absFrom) * 50;
        top = (absFrom === 12 ? absFrom : absFrom + 12) * 50;
      } else {
        height = ((absTo < 10 ? 12 + absTo : absTo) - absFrom) * 50;

        top = absFrom * 50;
      }
      break;
    default:
      height = absTo - absFrom;
      top = (absFrom - 1) * 50;
  }

  return [height, top, left];
};

export const dateRangeCalculator = (dateSelector, dayIndex) => {
  const datesToDays = [];
  const daysInTheMonth = new Date(
    dateSelector.year,
    months[dateSelector.month] + 1,
    0
  ).getDate();

  // console.log(daysInTheMonth);
  const start = dateSelector.date - dayIndex;
  for (let i = start; i < start + 7; ++i) {
    if (i <= 0) {
      datesToDays.push({
        date:
          new Date(dateSelector.year, months[dateSelector.month], 0).getDate() +
          i,
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
  return datesToDays;
};
