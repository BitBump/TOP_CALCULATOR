//-GLOBAL_VARS------------------------------
let operator = "";
let firstNumber = 0;
let secondNumber = 0;

//-FUNCTIONS--------------------------------
function addNumbers(a, b){return a + b;}
function divideNumbers(a, b){return b === 0 ? "Can't divide by '0'" : a / b}
function subtractNumbers(a, b){return a - b;}
function multiplyNumbers(a, b){return a * b;}

function operate(firstNumber, secondNumber, operator){

    switch(operator){

        case("+"): return addNumbers(firstNumber, secondNumber);
        case("/"): return divideNumbers(firstNumber, secondNumber);
        case("-"): return subtractNumbers(firstNumber, secondNumber);
        case("*"): return multiplyNumbers(firstNumber, secondNumber);

    }

}

//console.log(operate(15, 0, "/"));
