const IntcodeComputer = require("./IntcodeComputer.js");

const test = () => {
    const test_inputs = [
        '1102,34915192,34915192,7,4,7,99,0',
        '104,1125899906842624,99'
    ];
    const test_outputs = [
        '' + (34915192 * 34915192),
        '1125899906842624'
    ];

    const computer = new IntcodeComputer();

    for (let i = 0; i < test_inputs.length; i++) {
        computer.load(test_inputs[i]);
        console.log('test ' + (i + 1) + '?', computer.run() == test_outputs[i]);
    }

    const test3Input = '109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99';
    const outputCollector = [];
    computer.load(test3Input);
    computer.setOutputCallback(o => outputCollector.push(o));
    computer.run();
    console.log('test 3?', outputCollector.join(',') == test3Input);

}

const dailyProblems = () => {
    const computer = new IntcodeComputer();
    computer.loadFile('day9-input');
    computer.setOutputLevel(IntcodeComputer.OUTPUT_LEVEL_CONSOLE);
    computer.run([1]);
    //console.log('1', computer.run([1]));
}

test();
dailyProblems();