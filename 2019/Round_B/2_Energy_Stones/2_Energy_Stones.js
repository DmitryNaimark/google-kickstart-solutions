// Solution idea:
//    This problem can be solved in 2 steps + memoization:
//    1. Sort the stones
//        Imagine we have two stones(for example).
//        We can check energy loss(for remaining 2nd stone) if we eat 1st stone: S1 * L2.
//        And compare it with energy loss(for remaining 1st stone) if we eat 2nd stone: S2 * L1.
//        If energy loss is higher when we eat first stone, then we should eat it later(sort it to the right).
//        Iteratively sorting in this way will result in necessary ordering of the stones(when the eating order is definitely correct).
//
//    2. Check recursively if we can get more Energy by:
//        - Eating current stone and wasting time on it OR
//        - Skipping current stone without wasting time on it.
//
//    Memoization. Since we don't want to recalculate Max Energy for the same parameters: secondsPassed, stoneIndex(basically, how many stones left),
//        We can store calculated Max Energy values by 2 keys, for that we can use 2d array(as implemented) or nested Map.

let readline = require('readline');

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let expect = 'T',
    T,
    iT = 0,
    N,
    iStone,
    stones,
    dp;

rl.on('line', function(line) {
    if (expect === 'T') {
        T = parseInt(line);
        expect = "N";
    } else if (expect === "N") {
        N = parseInt(line);
        
        iStone = 0;
        stones = [];
        expect = "stones";
        const maxSi = 100;
        
        // 2d array is used to store already calculated Max Energy by 2 keys:
        // - seconds passed
        // - current stone index(which tells how many stones are left).
        // Note: we could have used Map with two keys(nested map) to store 2 keys: value,
        //     but using 2d array achieves the same result.
        dp = Array(N * maxSi).fill(null).map(function() {
            return Array(N).fill(null);
        });
    } else if (expect === "stones") {
        let stoneString = line.split(' ');
        let stone = new Stone(parseInt(stoneString[0]), parseInt(stoneString[1]), parseInt(stoneString[2]));
        stones.push(stone);
        iStone++;
        
        if (iStone >= N) {
            solve();
    
            iT++;
            if (iT >= T) {
                exitApplication();
            }
    
            expect = "N";
        }
    }
});


function solve() {
    // Sort: If energy loss for the 2nd stone(when we'll pick 1st stone) is higher than
    // energy loss for the 1st stone(when we'll pick 2nd stone), then move stone1 to the right.
    stones.sort(function(s1, s2) {
        return s2.L * s1.S - s1.L * s2.S;
    });
    
    let maxEnergy = calculateMaxEnergy(0, 0);
    
    console.log(`Case #${iT + 1}: ${maxEnergy}`);
}

// Recursively compares which is better - to eat energy stone and waste stone's time(S) on it OR
// to skip it without wasting time.
function calculateMaxEnergy(secondsPassed, iStone) {
    // Check if we have already calculated Max Energy for such arguments(secondsPassed, considering how many stones are left - iStone).
    if (dp[secondsPassed] != null && dp[secondsPassed][iStone] != null) {
        return dp[secondsPassed][iStone];
    }
    
    // No stones left in array to check.
    if (iStone >= stones.length) {
        return 0;
    }
    
    let currentStone = stones[iStone];
    
    let energyIfWeTakeStone = currentStone.getEnergyLeft(secondsPassed) +
        calculateMaxEnergy(secondsPassed + currentStone.S, iStone + 1);
    
    let energyIfWeDontTakeStone = calculateMaxEnergy(secondsPassed, iStone + 1);
    
    let maxEnergy = Math.max(energyIfWeTakeStone, energyIfWeDontTakeStone);
    
    // Store calculated value, so we don't have to calculate it again.
    // Note: we could have used Map with two keys(nested map) to store 2 keys: value,
    //     but using 2d array achieves the same result.
    dp[secondsPassed][iStone] = maxEnergy;
    
    return maxEnergy;
}

class Stone {
    constructor(S, E, L) {
        this.S = S;
        this.E = E;
        this.L = L;
    }
    
    getEnergyLeft(currentSecond) {
        let energyLostAlready = currentSecond * this.L;
        return Math.max(this.E - energyLostAlready, 0);
    }
}


function exitApplication() {
    rl.close();
    process.exit();
}