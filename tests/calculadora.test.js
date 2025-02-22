const calculadora = require("../models/calculadora");

it("deveria fazer somas simples", () => {
  expect(calculadora.somar(1, 1)).toBe(2);
  expect(calculadora.somar(1, 100)).toBe(101);
  expect(calculadora.somar(213, 219)).toBe(432);
});

it("deveria falhar caso somar com strings", () => {
  expect(() => calculadora.somar("string", 1)).toThrow(TypeError);
  expect(() => calculadora.somar(1, "string")).toThrow(TypeError);
  expect(() => calculadora.somar("string", "string")).toThrow(TypeError);
});

it("deveria substituir valor por 0 caso tentar somar sem um dos argumentos", () => {
  expect(calculadora.somar((num2 = 4))).toBe(4);
  expect(calculadora.somar((num1 = 6))).toBe(6);
  expect(calculadora.somar()).toBe(0);
});
