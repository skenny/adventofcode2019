const IntcodeComputer = require("./IntcodeComputer.js");

const test = () => {
	const test_inputs = [
		'1,9,10,3,2,3,11,0,99,30,40,50',
		'1,0,0,0,99',
		'2,3,0,3,99',
		'2,4,4,5,99,0',
		'1,1,1,4,99,5,6,0,99'
	];

	const test_outputs = [
		'3500,9,10,70,2,3,11,0,99,30,40,50',
		'2,0,0,0,99',
		'2,3,0,6,99',
		'2,4,4,5,99,9801',
		'30,1,1,4,2,5,6,0,99'
	];

	if (test_inputs.length != test_outputs.length) {
		console.log('test input and output arrays have different lengths');
		return;
	}

	const computer = new IntcodeComputer();
	computer.setOutputLevel(2);

	for (let t = 0; t < test_inputs.length; t++) {
		console.log('test', t);
		computer.load(test_inputs[t]);
		computer.run();
		console.log(computer.dumpMemory() == test_outputs[t] ? 'pass' : 'fail');
		console.log();
	}
}

// test
test();

const input = '1,0,0,3,1,1,2,3,1,3,4,3,1,5,0,3,2,6,1,19,1,19,10,23,2,13,23,27,1,5,27,31,2,6,31,35,1,6,35,39,2,39,9,43,1,5,43,47,1,13,47,51,1,10,51,55,2,55,10,59,2,10,59,63,1,9,63,67,2,67,13,71,1,71,6,75,2,6,75,79,1,5,79,83,2,83,9,87,1,6,87,91,2,91,6,95,1,95,6,99,2,99,13,103,1,6,103,107,1,2,107,111,1,111,9,0,99,2,14,0,0';
const computer = new IntcodeComputer();

// 2-1
computer.load(input);
computer.write(1, 12);
computer.write(2, 2);
computer.run();
console.log(1, computer.read(0));

// 2-2
for (let noun = 0; noun < 100; noun++) {
	for (let verb = 0; verb < 100; verb++) {
		computer.load(input);
		computer.write(1, noun);
		computer.write(2, verb);
		computer.run();
		if (computer.read(0) === 19690720) {
			console.log(2, noun, verb, 100 * noun + verb);
		}
	}
}
