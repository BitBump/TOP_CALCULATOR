//-GLOBAL_VARS------------------------------
let operator = "";
let firstNumber = "";
let secondNumber = "";

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

//-LISTENERS--------------------------------
clearButton.addEventListener("click", (e) => {resetCalculator();});

undoButton.addEventListener("click", () => {

    if (!isResultCalculated) {

        setCurrentNumber(deleteLastDigit(getCurrentNumber()));

    }

    renderDisplay();

});

numbersPad.addEventListener("click", (e) => {

    if (isResultCalculated && !operator) {resetCalculator();}

    getUserInput(e.target.textContent);    
    renderDisplay();

});

operatorsPad.addEventListener("click", (e) => {    

    //"=" is NOT selected
    if((e.target.textContent !== "=")){

        //secondNumber !== ""
        if(secondNumber){

            let operationResult = operate(Number(firstNumber), 
                                          Number(secondNumber), operator);
            clearDisplay();
            updateDisplay("= " + trimDecimalPlaces(operationResult));
            updateCalculatorInternalState(operationResult);
            isResultCalculated = true;

            operator = e.target.textContent;
            updateDisplay(" " + operator + " ");
            
        } 
        //secondNumber = ""
        else {
            operator = e.target.textContent;
            updateDisplay(" " + operator + " ");
        }

    }
    //"=" IS selected, secondNumber !== "" 
    else if((e.target.textContent === "=") && secondNumber){

        let operationResult = operate(Number(firstNumber), 
                                      Number(secondNumber), operator);
        clearDisplay();
        updateDisplay("= " + trimDecimalPlaces(operationResult));
        updateCalculatorInternalState(operationResult);  
        isResultCalculated = true;      

    }     

});