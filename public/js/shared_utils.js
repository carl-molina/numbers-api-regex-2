// Utility functions shared between the client and the server

(function (exports) {
  /**
   * @return {number} in [min, max) (inclusive-exclusive).
   */
  exports.randInt = function (min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  };

  exports.clamp = function (min, max, num) {
    return Math.max(min, Math.min(max, num));
  };

  exports.randomIndex = function (array) {
    return exports.randInt(0, array.length);
  };

  exports.randomChoice = function (array) {
    return array[exports.randomIndex(array)];
  };

  // NOTE: no docstring -> 'th', 'st', 'nd', 'rd', 'th'
  exports.getOrdinalSuffix = function (num) {
    switch (true) {
      case num === 11:
      case num === 12:
      case num === 13:
        return `${num}th`;
      case num % 10 === 1:
        return `${num}st`;
      case num % 10 === 2:
        return `${num}nd`;
      case num % 10 === 3:
        return `${num}rd`;
      default:
        return `${num}th`;
    }
  };

  const MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  exports.dateToString = function (date) {
    return `${MONTH_NAMES[date.getMonth()]} ${exports.getOrdinalSuffix(
      date.getDate()
    )}`;
  };

  /** Takes in date object and converts it to the day number
   *
   * ex: Date object(Jan 1) -> 1
   * ex: Dat object(Feb 1) -> 32
   */

  const MONTH_DAYS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  exports.dateToDayOfYear = function (date) {
    let day = 0;
    for (let i = 0; i < date.getMonth(); ++i) {
      day += MONTH_DAYS[i];
    }
    return day + date.getDate();
  };

  /** Converts month and day into a date in 2004 (leap year)
   * Uses dateToDayOfYear() helper function to get the day number in that year
   *
   * Input: month (number), day (number)
   * Output: day number
   */

  exports.monthDayToDayOfYear = function (month, day) {
    const date = new Date(2004, month - 1, day);
    return exports.dateToDayOfYear(date);
  };

  // NOTE: no docstring
  exports.getStandalonePrefix = function (number, type, data = {}) {
    const { year } = data;
    if (type === "math") {
      return `${number} is`;
    } else if (type === "trivia") {
      return `${number} is`;
    } else if (type === "date") {
      const date = new Date(2004, 0, number);
      if (year) {
        return year < 0
          ? `${exports.dateToString(date)} is the day in ${-year} BC that`
          : `${exports.dateToString(date)} is the day in ${year} that`;
      } else {
        return `${exports.dateToString(date)} is the day that`;
      }
    } else if (type === "year") {
      let currYear = new Date().getFullYear();

      if (number < 0) {
        // NOTE: prefix for what the user put in
        return `${-number} BC is the year that`;
      } else if (number > currYear) {
        return `${number} will be the year that`;
      } else {
        return `${number} is the year that`;
      }
    }
  };

  const NUM_FROM_URL_REGEX = /(-?[0-9]+)(?:\/(-?[0-9]+))?/;
  console.log("This is NUM_FROM_URL_REGEX: ", NUM_FROM_URL_REGEX);
  // NOTE: gets number from url using regex
  // If you find a certain number of / followed by a number, then it's
  // confirmed to be a date
  // http://localhost:8124/1/2 <-- /1/2
  exports.getNumFromUrl = function (url) {
    const matches = NUM_FROM_URL_REGEX.exec(url);
    console.log("matches: ", matches);
    if (!matches) return null;

    if (matches[2]) {
      // The number is a date, convert to day of year
      return utils.dateToDayOfYear(new Date(2004, matches[1] - 1, matches[2]));
    } else {
      return parseInt(matches[1], 10);
    }
  };

  exports.changeUrlToNum = function (url, num) {
    const matches = NUM_FROM_URL_REGEX.exec(url);
    let needle = NUM_FROM_URL_REGEX;
    if (!matches) {
      needle = "random";
    }

    if (url.match(/\/date/) || (matches && matches[2])) {
      // NOTE: if it literally matches "/date", this is true
      // If you put date at end of url, this fn runs and gets you a specific num
      // based on date value

      // other routes like /math, /trivia/, /year don't need this because
      // dates need additional data to set date-time

      // number is a day of year, so convert to date and into m/d notation
      let date = new Date(2004, 0);
      date.setDate(num);
      num = `${date.getMonth() + 1}/${date.getDate()}`;
    }
    return url.replace(needle, num);
  };
})(typeof exports === "undefined" ? (this["utils"] = {}) : exports);
