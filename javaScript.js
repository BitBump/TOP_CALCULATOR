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

function trimDecimalPlaces(number){

    return (Math.floor(number * 100)) / 100;

}

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
        return operationResult;
    }

    updateCalculatorInternalState(operationResult);

    isResultCalculated = true;

    return operationResult;

}

//-DISPLAY_FUNCTIONS------------------------
function clearDisplay(){display.textContent = "";}

function updateDisplay(content){display.append(content);}

function getUserInput(inputNumber) {

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

        updateDisplay(firstNumber || "0");

    } else {

        updateDisplay(`${firstNumber || "0"} ${operator} ${secondNumber ? " " + secondNumber : ""}`);

    }

}

//-LISTENERS_CLEAR/UNDO---------------------
clearButton.addEventListener("click", (e) => {resetCalculator();});

undoButton.addEventListener("click", () => {

    setCurrentNumber(deleteLastDigit(getCurrentNumber()));

    renderDisplay();

});

//-LISTENERS_NUMBERSPAD---------------------
numbersPad.addEventListener("pointerdown", (e) => {

    if (e.target.matches("button")) {

        pressedButton = e.target;

    }

});


numbersPad.addEventListener("pointerup", (e) => {

    if (e.target === pressedButton) {

        if (isResultCalculated && !operator) {

            resetCalculator();

        }

        getUserInput(e.target.textContent);
        renderDisplay();

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

            //secondNumber exists: calculate previous operation first
            if (secondNumber) {

                let result = calculateResult();

                clearDisplay();
                updateDisplay("= " + trimDecimalPlaces(result));

                operator = button;
                updateDisplay(" " + operator + " ");

            } 
            //secondNumber does not exist
            else {

                //Update operator with new selection, then re-render the display
                //The display doesn't store information, show it only
                operator = button;
                renderDisplay();

            }

        }

        //"=" IS selected
        else if (button === "=" && secondNumber) {

            let result = calculateResult();

            clearDisplay();
            updateDisplay("= " + trimDecimalPlaces(result));

        }

    }

    pressedButton = null;

});
