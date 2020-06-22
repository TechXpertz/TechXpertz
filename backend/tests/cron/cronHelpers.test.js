require('../../config');
const chai = require('chai');
const { getNextTimeslot, toISO } = require('../../controllers/cronJobs/cronHelpers');
const expect = chai.expect;

describe('date manipulation', () => {

  // set up test cases
  const testDates = [
    new Date('June 20, 2020 11:59'),
    new Date('February 29, 2020 23:00'),
    new Date('April 30, 2020 23:00')
  ];

  const expectedDates = [
    { date: '2020-06-20', time: '13:59' },
    { date: '2020-03-01', time: '01:00' },
    { date: '2020-05-01', time: '01:00' }
  ];

  it('adds two hours to the current time', () => {

    const result = testDates.map(date => toISO(getNextTimeslot(date)));
    console.log(result);
    expect(result).to.eql(expectedDates);

  });



})