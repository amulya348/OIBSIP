let expressionDisplay = document.getElementById("expression");
let resultDisplay = document.getElementById("result");

let expression = "";
let lastAnswer = "";

function append(char) {
  expression += char;
  expressionDisplay.textContent = expression;
}

function clearDisplay() {
  expression = "";
  expressionDisplay.textContent = "";
  resultDisplay.textContent = "0";
}

function delChar() {
  expression = expression.slice(0, -1);
  expressionDisplay.textContent = expression;
}

function calculate() {
  try {
    const safeExpr = expression.replace(/%/g, "/100");
    const evalResult = eval(safeExpr);
    lastAnswer = evalResult;
    resultDisplay.textContent = evalResult;
  } catch (e) {
    resultDisplay.textContent = "Error";
  }
}

function useAnswer() {
  expression += lastAnswer;
  expressionDisplay.textContent = expression;
}
