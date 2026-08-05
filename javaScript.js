//-GLOBAL_VARS------------------------------
let operator = "";
let firstNumber = "";
let secondNumber = "";
let pressedButton = null;

//-FLAGS------------------------------------
let isResultCalculated = false;

//-HTML_REFS--------------------------------
const display = document.getElementById("display");
const numbersPad = document.getElementById("numbersPad");
const undoButton = document.getElementById("undo");
const clearButton = document.getElementById("clear");
const operatorsPad = document.getElementById("operatorsPad");

//-CALC_FUNCTIONS---------------------------
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

//-STATE_FUNCTIONS--------------------------
function resetCalculator(){

    //Reset registers
    operator = "";
    firstNumber = "";
    secondNumber = "";
    isResultCalculated = false;
    pressedButton = null;

    //Clear display
    display.textContent = "";

};

function updateCalculatorInternalState(operationResult){

        firstNumber = String(operationResult);
        secondNumber = "";
        operator = "";

}

//-HELPER_FUNCTIONS-------------------------
function getCurrentNumber() {

    //Operator set? Yes: return secondNumber - No: return firstNumber
    return operator !== "" ? secondNumber : firstNumber;

}

function setCurrentNumber(value) {

    //Operator set? Yes: set secondNumber - No: set firstNumber
    return operator !== "" ? secondNumber = value : firstNumber = value;

}

function calculateResult() {

    let operationResult = operate(
        Number(firstNumber),
        Number(secondNumber),
        operator
    );

    if (typeof operationResult !== "number") {

        firstNumber = "";
        secondNumber = "";
        operator = "";
        isResultCalculated = false;

        return operationResult;

    }

    updateCalculatorInternalState(operationResult);

    isResultCalculated = true;

    return operationResult;

}

//-HANDLER_FUNCTIONS------------------------
function handleNumberInput(value){

    getUserInput(value);
    renderDisplay();

}

function handleOperatorInput(button){

    //secondNumber exists: calculate previous operation first
    if (secondNumber) {

        let result = calculateResult();

        clearDisplay();
        updateDisplay("= " + formatDisplayNumber(result));

        operator = button;
        updateDisplay(" " + operator + " ");

    } 
    //secondNumber does not exist
    else {

        //Update operator with new selection, then re-render the display
        //The display doesn't store information, shows it only
        operator = button;
        renderDisplay();

    }


}

function handleEquals(){

    if (secondNumber) {

        let result = calculateResult();

        clearDisplay();
        updateDisplay("= " + formatDisplayNumber(result));

    }

}

function handleUndo(){

    setCurrentNumber(deleteLastDigit(getCurrentNumber()));
    renderDisplay();

}

//-DISPLAY_FUNCTIONS------------------------
function clearDisplay(){display.textContent = "";}

function updateDisplay(content){display.append(content);}



function getUserInput(inputNumber) {

    if (isResultCalculated && operator === "") {
        resetCalculator();
    }

    let current = getCurrentNumber();

    if (inputNumber === ".") {

        if (current === "") {

            current = "0.";

        } else if (!current.includes(".")) {

            current += ".";

        }

    } else {

        current += inputNumber;

    }

    setCurrentNumber(current);
}


function deleteLastDigit(number) {

    if (number.length <= 1) {
        return "";
    }

    return number.slice(0, -1);

}

function renderDisplay() {

    clearDisplay();

    if (operator === "") {

        updateDisplay(firstNumber ? formatDisplayNumber(firstNumber) : "0");

    } else {

        updateDisplay(
            `${firstNumber ? formatDisplayNumber(firstNumber) : "0"} ${operator}${secondNumber ? " " + formatDisplayNumber(secondNumber) : ""}`
        );

    }

}

function formatDisplayNumber(number) {

    // If the string cannot be converted to a number, return it untouched
    // Prevents error message from being replaced with 'Nan'
    if (typeof number === "string" && isNaN(Number(number))) {

        return number;

    }

    if (typeof number === "string") {

        //Preserves decimal point that is otherwise stripped by Number conversion
        if (number.endsWith(".")) {

            return String(Number(number.slice(0, -1))) + ".";

        }

        //Removes leading zeros from integer part, preserves decimal part as-is
        if (number.includes(".")) {

            let [integer, decimal] = number.split(".");

            //Number conversion removes excess leading zeroes
            integer = String(Number(integer));

            return integer + "." + decimal;

        }

    }

    // Number is assumed complete, is thus converted then formatted
    number = Number(number);

    // Safety: if conversion fails, do not attempt arithmetic on NaN
    if (Number.isNaN(number)) {

        return number;

    }

    return Math.floor(number * 100) / 100;

}

//-LISTENERS_CLEAR/UNDO---------------------
clearButton.addEventListener("click", (e) => {resetCalculator();});

undoButton.addEventListener("click", () => {

    handleUndo();

});

//-LISTENERS_NUMBERSPAD---------------------
numbersPad.addEventListener("pointerdown", (e) => {

    if (e.target.matches("button")) {

        pressedButton = e.target;

    }

});


numbersPad.addEventListener("pointerup", (e) => {

    if (e.target === pressedButton) {

        handleNumberInput(e.target.textContent);

    }

    pressedButton = null;

});

//-LISTENERS_OPERATORSPAD-------------------

operatorsPad.addEventListener("pointerdown", (e) => {

    if (e.target.matches("button")) {

        pressedButton = e.target;

    }

});

operatorsPad.addEventListener("pointerup", (e) => {

    if (e.target === pressedButton) {

        const button = e.target.textContent;

        //"=" is NOT selected
        if (button !== "=") {

            handleOperatorInput(button);

        }

        //"=" IS selected
        else if (button === "=") {

            handleEquals();

        }

    }

    pressedButton = null;

});




//-KEYBOARD_SUPPORT-------------------------
document.addEventListener("keydown", (e) => {

    const value = e.key;

    // Numbers and decimal point
    if (/^[0-9]$/.test(value) || value === ".") {

        handleNumberInput(value);

    }

    // Operators
    else if (/^[+\-*/]$/.test(value)) {

        handleOperatorInput(value);

    }

    // Equals (Enter)
    else if (value === "Enter") {

        handleEquals();

    }

    // Backspace
    else if (value === "Backspace") {

        handleUndo();

    }

    // Escape = Clear
    else if (value === "Escape") {

        resetCalculator();

    }

});