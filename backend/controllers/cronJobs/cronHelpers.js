const getNextTimeslot = (dateObj) => {

  const date = new Date(dateObj);
  date.setHours(dateObj.getHours() + 2);
  return date;

}

const add2Minutes = (dateObj) => {
  const date = new Date(dateObj);
  date.setMinutes(dateObj.getMinutes() + 2);
  return date;
}

const toISO = (dateObj) => {

  const year = dateObj.getFullYear().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const date = dateObj.getDate().toString().padStart(2, '0');
  const hour = dateObj.getHours().toString().padStart(2, '0');
  const minute = dateObj.getMinutes().toString().padStart(2, '0');

  const myDate = `${year}-${month}-${date}`;
  const myTime = `${hour}:${minute}`;

  return { date: myDate, time: myTime };

};

const get1amTime = (dateObj) => {
  const date = new Date(dateObj);
  date.setHours(1);
  return date;
}

module.exports = {
  getNextTimeslot,
  add2Minutes,
  toISO,
  get1amTime
}