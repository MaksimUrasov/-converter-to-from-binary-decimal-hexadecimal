let restultDiv = document.querySelector("#result")
let processDiv = document.querySelector("#process")
// let convTableOctToBin = ["000","001","010","011","100","101","110","111"]
let convTableOctToBin = {
    "0" : "000",
    "1" : "001",
    "2" : "010",
    "3" : "011",
    "4" : "100",
    "5" : "101",
    "6" : "110",
    "7" : "111",
}


let convTableHexToBin = {
    "0" : "0000",
    "1" : "0001",
    "2" : "0010",
    "3" : "0011",
    "4" : "0100",
    "5" : "0101",
    "6" : "0110",
    "7" : "0111",
    "8" : "1000",
    "9" : "1001",
    "A" : "1010",
    "B" : "1011",
    "C" : "1100",
    "D" : "1101",
    "E" : "1110",
    "F" : "1111"
}



function clearPreviousResults(){
    processDiv.innerHTML = ""
}

function showResult(result){
    restultDiv.innerHTML = result;
}

function processString(inputToShow){
    let additionalLine = document.createElement("p")
    additionalLine.innerHTML = inputToShow;
    processDiv.appendChild(additionalLine);
}

function same(input){
    output = input;
    showResult(output)
    processString(`${input} = ${output}`)
}



// helper functions 
function findKeyToEveryChunk(inputArray, checkingObject){

    processString(`Then ${inputArray} convert to numbers using table:`)
    let result = []
    let number = ""
    inputArray.forEach(element => {
        number = Object.keys(checkingObject).find(key => checkingObject[key] === element)
        result.push(number)
        processString(`${element} converts to ${number}`)
    });

    const finalResult = result.join('');
    return finalResult;
}

function findValueForEveryKey(inputArray, checkingObject){

    processString(`Then convert each number to decimal using table:`)
    let result = []
    let number = ""
    inputArray.forEach(element => {
        let valueToAdd;

        if (element === ",") {
            valueToAdd = ","
            processString(`${element} is left as ${valueToAdd}`)
        } else {
            valueToAdd = checkingObject[element]
            processString(`${element} converts to ${valueToAdd}`)
        }
        result.push(valueToAdd)
        
    });

    const finalResult = result.join('');
    // console.log(inputArray, checkingObject);
    return finalResult;
}


function splitToChunksFromEnd(input, chunkSize){
    let arrayOfChunks = []
    let s = input.length - chunkSize
    let e = input.length 
    while (s >= 0) {
        arrayOfChunks.unshift(input.slice(s, e));
        s -= chunkSize;
        e -= chunkSize;
    }
    return arrayOfChunks;
}

function splitToChunksFromBeginning(input, chunkSize){
    let arrayOfChunks = []
    let s = 0
    let e = chunkSize
    while (s < input.length) {
        arrayOfChunks.push(input.slice(s, e));
        s += chunkSize;
        e += chunkSize;
    }
    return arrayOfChunks;
}


function convertToDecimal(input, convertBase){

    let [fractional, decimal] = input.split(",")
    // first convert the fractional part
        processString(`---Fractional part---`)
        let fractionalArray = Array.from(String(fractional), Number)
        processString(`Divide ${fractional} into array: ${fractionalArray} `)
        let fractionalResult = fractionalArray.reduce((previousValue, currentValue) => {
            let iterationResult = previousValue*convertBase+ currentValue
            processString(`Start from ${previousValue}, multiply it from ${convertBase} and add current number ${currentValue}, result is ${iterationResult};`)
            // console.log(previousValue,convertBase, currentValue, iterationResult);
            return iterationResult
        },0 )
        processString(`Fractional part result is ${fractionalResult}.`)
    
    // then count the decimal part
    if (!decimal) { showResult(fractionalResult); return;}
        processString(`---Decimal part---`)
        let decimalArray = Array.from(String(decimal), Number)
        processString(`Divide ${decimal} into array: ${decimalArray} `)
        let decimalResult = decimalArray.reverse().reduce((previousValue, currentValue) => {
            let iterationResult = (previousValue+ currentValue)/convertBase
            processString(`Start from ${previousValue}, divide it from ${convertBase} and add current number ${currentValue}, result is ${iterationResult};`)
            // console.log(previousValue,convertBase, currentValue, iterationResult);
            return iterationResult
        },0 )
        processString(`decimal part result is ${decimalResult}.`)

    // and finally connect fractional part to decimal part:
        const finalResult = fractionalResult+decimalResult
        showResult(finalResult.toString().replace('.', ','))
        processString(`---Final Result---`)
        processString(`${fractionalResult} joined to ${decimalResult} = ${finalResult.toString().replace('.', ',')}`)

        // .splice(0,2)
    
}






// converting functions below

function binToOct(input){

    let [fractional, decimal] = input.split(",")
    // first convert the fractional part
        // divide input into slices of 3, starting from the end
        const arrayOfChunks = splitToChunksFromEnd(fractional, 3)
        processString(`---Fractional part---`)
        processString(`${fractional} converted to array of trios (possibly without first trio) =  ${arrayOfChunks}`)  
        
        // add remainder to chunk array:
        if (fractional.length % 3 === 1) {
            let extendedNumber =  arrayOfChunks.unshift(`00${fractional.slice(0,1)}`)
            processString(`First number ${fractional.slice(0,1)} extended to trio by adding zeroes =  00${input.slice(0,1)}`)
        } else if (fractional.length % 3 === 2) {
            let extendedNumber =  arrayOfChunks.unshift(`0${fractional.slice(0,2)}`)
            processString(`First numbers ${fractional.slice(0,2)} extended to trio by adding zero =  0${input.slice(0,2)}`)
        }
    
        //find octal number for every trio
        const fractionalResult = findKeyToEveryChunk(arrayOfChunks, convTableOctToBin)
        processString(`${arrayOfChunks} trios converted by table to numbers =  ${fractionalResult}`)
    
    // then count the decimal part
        if (!decimal) { showResult(fractionalResult); return;}
        // divide input into slices of 3, starting from the end
        const arrayOfChunks2 = splitToChunksFromBeginning(decimal, 3)
        processString(`---Decimal part---`)
        processString(`${decimal} converted to array of trios =  ${arrayOfChunks2}`)  

         // add remainder to chunk array:
        if (decimal.length % 3 === 1) {
            let currentLastNumber = arrayOfChunks2[arrayOfChunks2.length-1]
            let extendedLastNumber = currentLastNumber+0+0
            arrayOfChunks2[arrayOfChunks2.length-1] = extendedLastNumber
            processString(`Last number ${currentLastNumber} extended to trio by adding zeroes = ${extendedLastNumber}`)
        } else if (decimal.length % 3 === 2) {
            let currentLastNumber = arrayOfChunks2[arrayOfChunks2.length-1]
            let extendedLastNumber = currentLastNumber+0
            arrayOfChunks2[arrayOfChunks2.length-1] = extendedLastNumber
            processString(`Last number ${currentLastNumber} extended to trio by adding zero = ${extendedLastNumber}`)
        }

        //find octal number for every trio
        const decimalResult = findKeyToEveryChunk(arrayOfChunks2, convTableOctToBin)
        showResult(decimalResult)
        processString(`So, ${arrayOfChunks2} trios converted to numbers =  ${decimalResult}`)
    
    // and finally connect fractional part to decimal part:
        const finalResult = `${fractionalResult},${decimalResult}`
        showResult(finalResult)
        processString(`---Final Result---`)
        processString(`${fractionalResult} joined to ${decimalResult} = ${finalResult}`)

}

function binToDec(input){
    processString(`--- this one not tested yet---`)
    convertToDecimal(input,2)
};

function binToHex(input){
    
    let [fractional, decimal] = input.split(",")
    // first convert the fractional part
        // divide input into slices of 3, starting from the end
        const arrayOfChunks = splitToChunksFromEnd(fractional, 4)
        processString(`---Fractional part---`)
        processString(`${fractional} converted to array of quartets (possibly without first quartet) =  ${arrayOfChunks}`)  
        
        // add remainder to chunk array:
        if (fractional.length % 4 === 1) {
            let extendedNumber =  arrayOfChunks.unshift(`000${fractional.slice(0,1)}`)
            processString(`First number ${fractional.slice(0,1)} extended to trio by adding zeroes = 000${input.slice(0,1)}`)
        } else if (fractional.length % 4 === 2) {
            let extendedNumber =  arrayOfChunks.unshift(`00${fractional.slice(0,2)}`)
            processString(`First numbers ${fractional.slice(0,2)} extended to trio by adding zeroes =  00${input.slice(0,2)}`)
        } else if (fractional.length % 4 === 3) {
            let extendedNumber =  arrayOfChunks.unshift(`0${fractional.slice(0,3)}`)
            processString(`First numbers ${fractional.slice(0,3)} extended to trio by adding zero =  0${input.slice(0,3)}`)
        }
    
        //find Hex number for every quartet
        const fractionalResult = findKeyToEveryChunk(arrayOfChunks, convTableHexToBin)
        // showResult(fractionalResult)
        processString(`${arrayOfChunks} quartets converted by table to numbers =  ${fractionalResult}`)
    
    // then count the decimal part
        if (!decimal) { showResult(fractionalResult); return;}
        // divide input into slices of 4, starting from the end
        const arrayOfChunks2 = splitToChunksFromBeginning(decimal, 4)
        processString(`---Decimal part---`)
        processString(`${decimal} converted to array of quartets =  ${arrayOfChunks2}`)  

         // add remainder to chunk array:
        if (decimal.length % 4 === 1) {
            let currentLastNumber = arrayOfChunks2[arrayOfChunks2.length-1]
            let extendedLastNumber = currentLastNumber+0+0+0
            arrayOfChunks2[arrayOfChunks2.length-1] = extendedLastNumber
            processString(`Last number ${currentLastNumber} extended to quartet by adding zeroes = ${extendedLastNumber}`)
        } else if (decimal.length % 4 === 2) {
            let currentLastNumber = arrayOfChunks2[arrayOfChunks2.length-1]
            let extendedLastNumber = currentLastNumber+0+0
            arrayOfChunks2[arrayOfChunks2.length-1] = extendedLastNumber
            processString(`Last number ${currentLastNumber} extended to quartet by adding zeroes = ${extendedLastNumber}`)
        } else if (decimal.length % 4 === 3) {
            let currentLastNumber = arrayOfChunks2[arrayOfChunks2.length-1]
            let extendedLastNumber = currentLastNumber+0
            arrayOfChunks2[arrayOfChunks2.length-1] = extendedLastNumber
            processString(`Last number ${currentLastNumber} extended to quartet by adding zero = ${extendedLastNumber}`)
        }

        //find octal number for every quartet
        const decimalResult = findKeyToEveryChunk(arrayOfChunks2, convTableHexToBin)
        showResult(decimalResult)
        processString(`So, ${arrayOfChunks2} quartets converted to numbers =  ${decimalResult}`)
    
    // and finally connect fractional part to decimal part:
        const finalResult = `${fractionalResult},${decimalResult}`
        showResult(finalResult)
        processString(`---Final Result---`)
        processString(`${fractionalResult} joined to ${decimalResult} = ${finalResult}`)

};


function octToBin(input){
    const result = findValueForEveryKey(input.split(""), convTableOctToBin)
    processString(`Result is ${result}`)
    // delete leading and trailing zeroes:
    const resultWithDot = result.replace(',', '.');
    const restultWithoutZeroes = Number.parseFloat(resultWithDot)
    const finalResult = restultWithoutZeroes.toString().replace('.', ',')
    showResult(finalResult)
    processString(`Final Result is ${finalResult}`)
    return finalResult;
};
function octToDec(input){
    convertToDecimal(input, 8)

};
function octToHex(input){
    processString(`------FIRST, CONVERT OCTAL TO BINARY------`)
    const bin = octToBin(input)

    processString(`------THEN, CONVERT BINARY TO HEXADECIMAL------`)
    const finalResult = binToHex(bin);
};



function decToBin(input){
    processString(`---Sorry, this one is not implemented yet---`)
};
function decToOct(input){
    processString(`---Sorry, this one is not implemented yet---`)
};
function decToHex(input){
    processString(`---Sorry, this one is not implemented yet---`)
};


function hexToBin(input){ 
    const result = findValueForEveryKey(input.split(""), convTableHexToBin)
    processString(`Result is ${result}`)
    // delete leading and trailing zeroes:
    const resultWithDot = result.replace(',', '.');
    const restultWithoutZeroes = Number.parseFloat(resultWithDot)
    const finalResult = restultWithoutZeroes.toString().replace('.', ',')
    showResult(finalResult)
    processString(`Final Result is ${finalResult}`)
    return finalResult;
};
function hexToOct(input){
    processString(`------FIRST, CONVERT HEXADECIMAL TO BINARY------`)
    const bin = hexToBin(input)

    processString(`------THEN, CONVERT BINARY TO OCTAL------`)
    const finalResult = binToOct(bin);

};
function hexToDec(input){
    // var output = parseInt(input, 16);
    // showResult(output)
    // processString(`${input} converted using table =  ${output}`)
    // processString(`---Sorry, this one is not implemented yet---`)
    processString(`--- this one not tested yet---`)
    convertToDecimal(input,2)
};






// starting function

function runCoverter(){
    

    clearPreviousResults();
    //get the values from form:
    let input = document.querySelector("#input").value;
    let from = document.querySelector("#convFrom").value;
    let to = document.querySelector("#convTo").value;

    if(!input){showResult("Please input the value to convert!");return}
    
    if(from === "2" && to === "2"){same(input);return}
    if(from === "10" && to === "10"){same(input);return}
    if(from === "8" && to === "8"){same(input);return}
    if(from === "16" && to === "16"){same(input);return}

    if(from === "2" && to === "8"){binToOct(input);return}
    if(from === "2" && to === "10"){binToDec(input);return}
    if(from === "2" && to === "16"){binToHex(input);return}

    if(from === "8" && to === "2"){octToBin(input);return}
    if(from === "8" && to === "10"){octToDec(input);return}
    if(from === "8" && to === "16"){octToHex(input);return}

    if(from === "10" && to === "2"){decToBin(input);return}
    if(from === "10" && to === "8"){decToOct(input);return}
    if(from === "10" && to === "16"){decToHex(input);return}

    if(from === "16" && to === "2"){hexToBin(input);return}
    if(from === "16" && to === "8"){hexToOct(input);return}
    if(from === "16" && to === "10"){hexToDec(input);return}

    // console.log(input, from, to);
}


document.querySelector("#convert").addEventListener("click", (event)=>{
    event.preventDefault();
    runCoverter()
})