let printDate = new Date();
const monthNames = [
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

const month = new Date();

const dateprint = function () {
  console.log(
    [
      printDate.getDate(),
      monthNames[month.getMonth()],
      printDate.getFullYear(),
    ].join("/")
  );

  console.log("current Month : " + monthNames[month.getMonth()]);
  console.log(
    " plutonium, Week-3 Day-4, the topic for today is Nodejs module system "
  );
};

module.exports.dateprint = dateprint;
