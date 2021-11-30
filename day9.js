const IntcodeComputer = require("./IntcodeComputer.js");

const test = () => {
    const computer = new IntcodeComputer();

    // 109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99 takes no input and produces a copy of itself as output
    const test1Input = '109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99';
    const outputCollector = [];
    computer.load(test1Input);
    computer.setOutputCallback(o => outputCollector.push(o));
    computer.run();
    console.log('test 1?', outputCollector.join(',') == test1Input);

    // 1102,34915192,34915192,7,4,7,99,0 should output a 16-digit number
    computer.load('1102,34915192,34915192,7,4,7,99,0');
    console.log('test 2?', computer.run() == 34915192 * 34915192);

    // 104,1125899906842624,99 should output the large number in the middle
    computer.load('104,1125899906842624,99');
    console.log('test 3?', computer.run() == 1125899906842624);

    // 203,3,104,0,99 with input 123 should output 123
    computer.load('203,3,104,0,99');
    console.log('test 4?', computer.run([123]) == 123);
  
    // 109,5,203,0,104,0,99 with input 111 should output 111
    computer.load('109,5,203,0,104,0,99');
    console.log('test 5?', computer.run([111]) == 111);
}

const dailyProblems = () => {
    const computer = new IntcodeComputer();
    computer.setOutputLevel(IntcodeComputer.OUTPUT_LEVEL_CONSOLE);

    computer.loadFile('day9-input');
    console.log('1', computer.run([1]));

    computer.loadFile('day9-input');
    const start = new Date().getTime();
    console.log('2', computer.run([2]));
    const end = new Date().getTime();
    console.log('2 runs in ' + (end - start) + 'ms');
}

test();
dailyProblems();