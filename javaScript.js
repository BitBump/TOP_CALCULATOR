//-GLOBAL_VARS------------------------------
let operator = "";
let firstNumber = "";
let secondNumber = "";
let isOperatorSet = false;

//-HTML_REFS--------------------------------
const display = document.getElementById("display");
const numbersPad = document.getElementById("numbersPad");
const clearButton = document.getElementById("clear");
const operatorsPad = document.getElementById("operatorsPad");

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

function resetCalculator(){

    //Reset registers
    operator = "";
    firstNumber = "";
    secondNumber = "";
    isOperatorSet = false;

    //Clear display
    display.textContent = "";

};

//-LISTENERS--------------------------------
clearButton.addEventListener("click", (e) => {resetCalculator();})

numbersPad.addEventListener("click", (e) => {

    display.append(e.target.textContent);
    if(!isOperatorSet){
        //Remember: cast to Number before use
        firstNumber += e.target.textContent;
        console.log("Number1 = " + firstNumber);
    }
    if(isOperatorSet){
        //Remember: cast to Number before use
        secondNumber += e.target.textContent;
        console.log("Number2 = " + secondNumber);
    }        

});

operatorsPad.addEventListener("click", (e) => {

    operator = e.target.textContent;
    display.append(" " + e.target.textContent + " ");
    isOperatorSet = true;

});