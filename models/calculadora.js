function somar(num1 = 0, num2 = 0) {
  if (typeof num1 !== "number" || typeof num2 !== "number") {
    throw new TypeError("Value should be a number");
  }

  return num1 + num2;
}

exports.somar = somar;
