const result = document.getElementById("result");
const numbers = document.querySelectorAll(".numbers button");
const operators = document.querySelectorAll(".operators button");

function displayValue(input) {
  const isOperator = /[+\-x/.]/.test(input);
  const lastChar = result.value.slice(-1);

  //cegah awalan diisi dengan operator
  if (result.value === "" && isOperator && input !== "-") {
    return;
  }

  if (input === "-" && /[+x/]/.test(lastChar)) {
    result.value += input;
    return;
  }

  //cegah awal dan akhir dengan operator yang sama
  if (isOperator && /[+\-x/.]/.test(lastChar)) {
    return;
  }

  //cegah dua titik bersamaan
  if (input === ".") {
    const afterLastOperator = result.value.split(/[+\-x/]/).pop();
    if (afterLastOperator.includes(".")) {
      return;
    }
  }

  result.value += input;
}

function clearAll() {
  result.value = "";
}

function calculate() {
  let expr = result.value;
  if (!expr) return;

  // taking operator & numbers
  const token = expr.match(/\d+(\.\d+)?|[+\-x/]/g);
  if (!token) return;

  if (token[0] === "-") {
    token[1] = "-" + token[1];
    token.shift();
  }

  // menggabungkan '-' dengan angka setelah operator [+x/]
  for (let i = 0; i < token.length; i++) {
    if (
      token[i] === "-" &&
      i > 0 &&
      (token[i - 1] === "+" || token[i - 1] === "x" || token[i - 1] === "/") &&
      !/[+\-x/]/.test(token[i + 1])
    ) {
      token[i + 1] = "-" + token[i + 1];
      token.splice(i, 1);
    }
  }

  //step 1 calculate 'x' and '/' first
  for (let i = 0; i < token.length; i++) {
    if (token[i] === "x" || token[i] === "/") {
      const left = parseFloat(token[i - 1]);
      const right = parseFloat(token[i + 1]);
      const res = token[i] === "x" ? left * right : left / right;

      token.splice(i - 1, 3, res.toString());
      i -= 1;
    }
  }

  //step 2 calculate '+' & '-'
  let resultValue = parseFloat(token[0]);
  for (let i = 1; i < token.length; i += 2) {
    const op = token[i];
    const num = parseFloat(token[i + 1]);
    if (op === "+") resultValue += num;
    else if (op === "-") resultValue -= num;
  }

  // kasih error undefined jika hanya '-' di awal setelah calculate()
  if (result.value.charAt(0) === "-" && result.value.charAt(1) === "") {
    result.value = "undefined";
    setTimeout(() => {
      result.value = "";
    }, 1500);
  } else {
    result.value = resultValue;
  }

  console.log("tokens: ", token);
}

function backspace() {
  if (result?.value?.length > 0) {
    result.value = result.value.slice(0, -1);
  }
  // const current = result.value;
  // current.length > 0
  //   ? (result.value = current.substring(0, current.length - 1))
  //   : null;
}
