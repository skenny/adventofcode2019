const IntcodeComputer = require("./IntcodeComputer.js");

const run1 = (program, phases) => {
    const computer = new IntcodeComputer();

    let input = 0;

    phases.forEach(p => {
        computer.load(program);
        input = computer.run([p, input]);
    });

    return input;
}

const run2 = (program, phases) => {
    const numAmplifiers = 5;
    const computers = [];

    for (let i = 0; i < numAmplifiers; i++) {
        const computer = new IntcodeComputer();
        computer.setName('Amplifier ' + i);
        computer.load(program);
        //computer.setOutputLevel(IntcodeComputer.OUTPdUT_LEVEL_DEBUG);
        computer.enablePauseForInput();
        computers[i] = computer;
    }

    let curAmplifierNo = 0;
    let output = 0;

    while (true) {
        const computer = computers[curAmplifierNo];
        const inputArgs = computer.paused ? [ output ] : [ phases[curAmplifierNo], output ];
        
        output = computer.run(inputArgs);

        if (computer.paused || curAmplifierNo < numAmplifiers - 1) {
            curAmplifierNo = (curAmplifierNo + 1) % numAmplifiers;
        } else {
            return output;
        }
    }
}

const findPermutations = (intArray) => {
    if (intArray.length === 1) {
        return intArray;
    }

    let permutations = [];
    for (let i = 0; i < intArray.length; i++) {
        let c = intArray[i];
        let restOfArray = intArray.filter(v => v != c);
        findPermutations(restOfArray).forEach(p => permutations.push([c].concat(p)));
    }

    return permutations;
}

test = () => {
    console.log('test 1?', run1('3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0', [4,3,2,1,0]) === 43210);
    console.log('test 2?', run1('3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0', [0,1,2,3,4]) === 54321);
    console.log('test 3?', run1('3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0', [1,0,4,3,2]) === 65210);

    console.log('test 4?', run2('3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5', [9,8,7,6,5]) === 139629729);
    console.log('test 5?', run2('3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10', [9,7,8,5,6]) === 18216);
}

dailyProblems = () => {
    const program = '3,8,1001,8,10,8,105,1,0,0,21,34,59,76,101,114,195,276,357,438,99999,3,9,1001,9,4,9,1002,9,4,9,4,9,99,3,9,102,4,9,9,101,2,9,9,102,4,9,9,1001,9,3,9,102,2,9,9,4,9,99,3,9,101,4,9,9,102,5,9,9,101,5,9,9,4,9,99,3,9,102,2,9,9,1001,9,4,9,102,4,9,9,1001,9,4,9,1002,9,3,9,4,9,99,3,9,101,2,9,9,1002,9,3,9,4,9,99,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,99,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,99,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,101,2,9,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,99';

    let maxSignal1 = Number.MIN_SAFE_INTEGER;
    findPermutations([0,1,2,3,4]).forEach(phaseOrder => {
        maxSignal1 = Math.max(maxSignal1, run1(program, phaseOrder));
    });
    console.log(1, maxSignal1);

    let maxSignal2 = Number.MIN_SAFE_INTEGER;
    findPermutations([5,6,7,8,9]).forEach(phaseOrder => {
        maxSignal2 = Math.max(maxSignal2, run2(program, phaseOrder));
    });
    console.log(2, maxSignal2);
}

test();
dailyProblems();