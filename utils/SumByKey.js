import React from "react";

function SumByKey(arr, key, value) {
  //const sumByKey = (arr, key, value) => {
  const map = new Map();
  for (const obj of arr) {
    const currSum = map.get(obj[key]) || 0;
    map.set(obj[key], currSum + obj[value]);
  }
  const res = Array.from(map, ([k, v]) => ({ [key]: k, [value]: v }));
  return res;
}

export default SumByKey;
