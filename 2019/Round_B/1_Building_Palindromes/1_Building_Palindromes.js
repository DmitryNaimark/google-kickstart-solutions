// Solution idea:
//    Calculate frequencies of each characters in a string by using Prefix Sum.
//
//    We can create Prefix Sum(Running Total) as a map for each block. Map will store values like "character": "character count".
//    Then, finding difference in characters count between Maps for Ri and Li blocks will give us count for each character.
//
//    If length of the string is even, all characters counts should be even (to make it a Palindrome).
//    If length of the string is odd, exactly one character count should be even.
//
//    Note: It's possible to store answer for each pair of "Li", "Ri" by using Map, which stores 2 keys(Li, Ri,) and value is a boolean (whether it's palindrome).
//        But, it's not necessary to pass even a Hidden Test Set.

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let expect = 'T',
    T,
    Ti = 0,
    N,
    // Questions Count
    Q,
    Qi = 0,
    yesCount = 0,
    prefixChCountMap = [],
    // String containing all letters(blocks)
    str;

rl.on('line', function(line) {
    if (expect === 'T') {
        T = parseInt(line);
        
        expect = 'N Q';
    } else if (expect === 'N Q') {
        let NQStrings = line.split(' ');
        N = parseInt(NQStrings[0]);
        Q = parseInt(NQStrings[1]);
        
        expect = 'letters';
    } else if (expect === 'letters') {
        str = line;
        
        Qi = 0;
        yesCount = 0;
    
        // Calculate Prefix Sums(Running Totals): each "sum" is a map like "ch: characterCount"
        prefixChCountMap = Array(str.length + 1);
        prefixChCountMap[0] = new Map();
    
        for (let i = 0; i < str.length; i++) {
            let ch = str[i];
            
            // Copy map for previous letter.
            let chCountMap = new Map(prefixChCountMap[i]);
            prefixChCountMap[i + 1] = chCountMap;
        
            chCountMap.set(ch, (chCountMap.get(ch) || 0) + 1);
        }
        
        expect = 'Li Ri';
    } else if (expect === 'Li Ri') {
        let LiRiStrings = line.split(' ');
        let Li = parseInt(LiRiStrings[0]) - 1;
        let Ri = parseInt(LiRiStrings[1]) - 1;
        
        if (solve(Li, Ri)) {
            yesCount++;
        }
        
        Qi++;
        if (Qi >= Q) {
            console.log(`Case #${Ti + 1}: ${yesCount}`);
            Ti++;
            expect = 'N Q';
        }
    }
});

function  solve(Li, Ri) {
    let diffMap = getDiffMap(prefixChCountMap[Ri + 1], prefixChCountMap[Li]);
    
    let isStringLengthEven = (Ri - Li + 1) % 2 === 0;
    let oddChCount = 0;
    for (let [keyCh, valueCount] of diffMap.entries()) {
        if (valueCount % 2 !== 0) {
            oddChCount++;
        }
    }
    
    if (isStringLengthEven) {
        return oddChCount === 0;
    } else {
        return oddChCount === 1;
    }
}

function getDiffMap(rightMap, leftMap) {
    let resMap = new Map();
    
    for (let [keyCh, valueCount] of rightMap.entries()) {
        resMap.set(keyCh, valueCount - (leftMap.get(keyCh) || 0));
    }
    
    return resMap;
}