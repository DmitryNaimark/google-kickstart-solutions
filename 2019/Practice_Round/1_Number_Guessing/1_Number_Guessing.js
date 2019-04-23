// Solution idea:
//    Guess number "in the middle": between provided min and max values.
//    Then
//        - If we get response that number is TOO_BIG, new max possible value becomes "guessNumber - 1"
//        - If we get response that number is TOO_SMALL, new min possible value becomes "guessNumber + 1"
//    And we keep guessing until we get CORRECT.
//    In the worst case scenario min and max will eventually become the same number(which is the number we try to guess),
//    and we'll guess it correctly, since 4 is "in the middle" of 4 and 4, for example.

let readline = require('readline');

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let expect = 'T',
    T,
    iT = 0,
    // Inclusive min, max values.
    min,
    max,
    N,
    guessNumber;

rl.on('line', function(line) {
    if (expect === 'T') {
        T = parseInt(line);
        expect = "min max";
    } else if (expect === "min max") {
        let minMax = line.split(' ');
        
        // Since min is exclusive, add 1 to make it inclusive.
        min = parseInt(minMax[0]) + 1;
        max = parseInt(minMax[1]);
        
        expect = "N";
    } else if (expect === "N") {
        N = parseInt(line);
    
        takeAGuessInTheMiddle();
        expect = 'response';
    } else if (expect === 'response') {
        if (line === "TOO_SMALL") {
            min = guessNumber + 1;
    
            takeAGuessInTheMiddle();
        } else if (line === "TOO_BIG") {
            max = guessNumber - 1;
    
            takeAGuessInTheMiddle();
        } else if (line === "CORRECT") {
            iT++;
            if (iT >= T) {
                exitApplication();
            }
    
            expect = "min max";
        } else if (line === "WRONG_ANSWER") {
            exitApplication();
        }
    }
});

function takeAGuessInTheMiddle() {
    guessNumber = Math.floor((min + max) / 2);
    console.log(guessNumber);
}

function exitApplication() {
    rl.close();
    process.exit();
}