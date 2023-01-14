import React from "react";

function CalculateSum(array, property) {
  const total = array.reduce((accumulator, object) => {
    return accumulator + object[property];
  }, 0);

  return total;
}

export default CalculateSum;
