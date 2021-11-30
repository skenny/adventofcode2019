const IntcodeComputer = require("./IntcodeComputer.js");

const test = () => {
    const computer = new IntcodeComputer();

    computer.load('1002,4,3,4,33');
    computer.run();
    console.log('test expanded instructions?', computer.read(4) === 99);

    // Using position mode, consider whether the input is equal to 8; output 1 (if it is) or 0 (if it is not).
    computer.load('3,9,8,9,10,9,4,9,99,-1,8');
    console.log('test position mode input (1) equals 8?', computer.run([1]) == 0);
    console.log('test position mode input (8) equals 8?', computer.run([8]) == 1);

    // Using position mode, consider whether the input is less than 8; output 1 (if it is) or 0 (if it is not).
    computer.load('3,9,7,9,10,9,4,9,99,-1,8');
    console.log('test position mode input (-10) < 8?', computer.run([-10]) == 1);
    console.log('test position mode input (7) < 8?', computer.run([7]) == 1);
    console.log('test position mode input (8) < 8?', computer.run([8]) == 0);
    console.log('test position mode input (9) < 8?', computer.run([9]) == 0);

    // Using immediate mode, consider whether the input is equal to 8; output 1 (if it is) or 0 (if it is not).
    computer.load('3,3,1108,-1,8,3,4,3,99');
    console.log('test immediate mode input (1) equals 8?', computer.run([1]) == 0);
    console.log('test immediate mode input (8) equals 8?', computer.run([8]) == 1);

    // Using immediate mode, consider whether the input is less than 8; output 1 (if it is) or 0 (if it is not).
    computer.load('3,3,1107,-1,8,3,4,3,99');
    console.log('test immediate mode input (-10) < 8?', computer.run([-10]) == 1);
    console.log('test immediate mode input (7) < 8?', computer.run([7]) == 1);
    console.log('test immediate mode input (8) < 8?', computer.run([8]) == 0);
    console.log('test immediate mode input (9) < 8?', computer.run([9]) == 0);

    // Here are some jump tests that take an input, then output 0 if the input was zero or 1 if the input was non-zero:

    // (using position mode)
    computer.load('3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9');
    console.log('test position mode jump input (0) == 0?', computer.run([0]) == 0);
    computer.load('3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9');
    console.log('test position mode jump input (1) == 1?', computer.run([1]) == 1);

    // (using immediate mode)
    computer.load('3,3,1105,-1,9,1101,0,0,12,4,12,99,1');
    console.log('test immediate mode jump input (0) == 0?', computer.run([0]) == 0);
    computer.load('3,3,1105,-1,9,1101,0,0,12,4,12,99,1');
    console.log('test immediate mode jump input (1) == 1?', computer.run([1]) == 1);
    
    // output 999 if the input value is below 8, output 1000 if the input value is equal to 8, or output 1001 if the input value is greater than 8.
    computer.load('3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99');
    console.log('test larger example input (7) < 8?', computer.run([7]) === 999);
    console.log('test larger example input (7) == 8?', computer.run([8]) === 1000);
    console.log('test larger example input (7) > 8?', computer.run([9]) === 1001);
}

const dailyProblems = () => {
    const computer = new IntcodeComputer();

    // 5-1
    computer.loadFile('day5-input');
    console.log(1, computer.run([1]));

    // 5-2
    computer.loadFile('day5-input');
    console.log(2, computer.run([5]))
}

test();
dailyProblems();
