function generateRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickOperator() {
    return ["+", "-", "*"][Math.floor(Math.random() * 3)];
}

function calculate(value1, value2, operator) {
    if (operator == "+") {
        return value1 + value2;
    }
    else if (operator == "-") {
        return value1 - value2;
    }
    else if (operator == "*") {
        return value1 * value2;
    }
}