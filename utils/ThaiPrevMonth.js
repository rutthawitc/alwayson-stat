//import React, { useState } from 'react';

const Months = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
];

function PreviousMonth() {
  //const [previousMonth, setPreviousMonth] = useState('');

  const today = new Date();
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastMonthName = Months[lastMonth.getMonth()];

 // setPreviousMonth(lastMonthName);
  //console.log(previousMonth);

  //return previousMonth;
  return lastMonthName;
}

export default PreviousMonth;
