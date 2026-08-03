//-GLOBAL_VARS------------------------------
let operator = "";
let firstNumber = "";
let secondNumber = "";

//-FLAGS------------------------------------
let isOperatorSet = false;
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
    isOperatorSet = false;
    isResultCalculated = false;

    //Clear display
    display.textContent = "";

};

function updateCalculatorInternalState(operationResult){

        firstNumber = String(operationResult);
        secondNumber = "";
        operator = "";

}

//-DISPLAY_FUNCTIONS------------------------
function clearDisplay(){display.textContent = "";}

function updateDisplay(content){display.append(content);}

function getUserInput(inputNumber){

    if(!isOperatorSet){
        //Remember: cast to Number before use
        firstNumber += inputNumber;
        
    }
    if(isOperatorSet){
        //Remember: cast to Number before use
        secondNumber += inputNumber;
        
    }
    
}

function deleteLastDigit(number){

    //All digits removed? Assign '0', else remove last digit
    return number.length < 1 ? number = "0" : number = number.split("")
                                                             .slice(0, -1)
                                                             .join("");

}

//-LISTENERS--------------------------------
clearButton.addEventListener("click", (e) => {resetCalculator();});

undoButton.addEventListener("click", (e) => {

    if(!isOperatorSet && !isResultCalculated){

        firstNumber = deleteLastDigit(firstNumber);
        clearDisplay();
        updateDisplay(firstNumber);

    } 
    else if (isOperatorSet && secondNumber !== ""){

        secondNumber = deleteLastDigit(secondNumber);
        clearDisplay();
        updateDisplay(firstNumber + " " + operator + " " + secondNumber);

    }

});

numbersPad.addEventListener("click", (e) => {

    //A result has been calculated, button pressed without new operation selected
    if(isResultCalculated && !operator){resetCalculator();}
    if(display.textContent === "0"){clearDisplay();};

    updateDisplay(e.target.textContent);
    getUserInput(e.target.textContent);            

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
            isOperatorSet = true;
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