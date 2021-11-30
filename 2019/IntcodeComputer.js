const fs = require('fs');

module.exports = class IntcodeComputer {

	static OPCODE_ADD = 1;
	static OPCODE_MULTIPLY = 2;
	static OPCODE_INPUT = 3;
	static OPCODE_OUTPUT = 4;
	static OPCODE_JUMP_IF_TRUE = 5;
	static OPCODE_JUMP_IF_FALSE = 6;
	static OPCODE_LESS_THAN = 7;
	static OPCODE_EQUALS = 8;
	static OPCODE_RELATIVE_BASE_OFFSET = 9;
	static OPCODE_HALT = 99;

	static PARAMETER_MODE_POSITION = 0;
	static PARAMETER_MODE_IMMEDIATE = 1;
	static PARAMETER_MODE_RELATIVE = 2;

	static OUTPUT_LEVEL_SILENT = 0;
	static OUTPUT_LEVEL_CONSOLE = 1;
	static OUTPUT_LEVEL_DEBUG = 2;
	static OUTPUT_LEVEL_TRACE = 3;

	outputLevel = IntcodeComputer.OUTPUT_LEVEL_SILENT;
	memory = [];
	instrPtr = 0;
	relativeBase = 0;
	input;
	output;
	outputCallback;
	name = 'Unnamed';
	pauseForInput = false;
	paused = false;

	setName(name) { this.name = name; }
	setOutputLevel(outputLevel) { this.outputLevel = outputLevel; }
	setOutputCallback(outputCallback) { this.outputCallback = outputCallback; }
	enablePauseForInput() { this.pauseForInput = true; }
	disablePauseForInput() { this.pauseForInput = false; }

	console(out) { this.doOutput(IntcodeComputer.OUTPUT_LEVEL_CONSOLE, out); }
	debug(out) { this.doOutput(IntcodeComputer.OUTPUT_LEVEL_DEBUG, out); }
	trace(out) { this.doOutput(IntcodeComputer.OUTPUT_LEVEL_TRACE, out); }
	doOutput(level, out) {
		if (this.outputLevel >= level) {
			console.log('[' + this.name + '] ' + (Array.isArray(out) ? out.join(' ') : out));
		}
	}

	dumpMemory() {
		return this.memory;
	}

	loadFile(file) {
		this.debug('loading file ' + file);
		this.load(fs.readFileSync(file).toString());
	}

	load(memoryString) {
		this.memory = memoryString.trim().split(',').map(i => parseInt(i));
		this.relativeBase = 0;
		this.instrPtr = 0;
	}

	run(inputArgs) {
		if (!this.memory) {
			throw new 'no program loaded!';
		}
		if (inputArgs && !Array.isArray(inputArgs)) {
			throw 'input must be an array!';
		}

		if (!this.paused) {
			this.instrPtr = 0;
		}

		this.input = inputArgs;
		this.paused = false;

		this.debug('running...');
		this.debug('initial memory state: ' + this.memory);
		this.debug('initial input: ' + this.input);

		let halt = false;

		while (!halt) {
			let instruction = this.read(this.instrPtr).toString().padStart(5, '0');

			let opcode = parseInt(instruction.substring(3));
			let parameterModes = [ parseInt(instruction[2]), parseInt(instruction[1]), parseInt(instruction[0]) ];

			this.trace('instruction is ' + instruction + ': ' + this.describeOpcode(opcode) + ' (' + parameterModes + ')');

			switch (opcode) {
				case IntcodeComputer.OPCODE_HALT:
					this.debug('halt');
					halt = true;
					break;
				case IntcodeComputer.OPCODE_ADD:
					this.instrPtr += this.instrAdd(this.instrPtr, parameterModes);
					break;
				case IntcodeComputer.OPCODE_MULTIPLY:
					this.instrPtr += this.instrMultiply(this.instrPtr, parameterModes);
					break;
				case IntcodeComputer.OPCODE_INPUT:
					if ((!this.input || this.input.length === 0) && this.pauseForInput) {
						this.debug('pause for input');
						this.paused = true;
						halt = true;
					} else {
						this.instrPtr += this.instrInput(this.instrPtr, parameterModes);
					}
					break;
				case IntcodeComputer.OPCODE_OUTPUT:
					this.instrPtr += this.instrOutput(this.instrPtr, parameterModes);
					break;
				case IntcodeComputer.OPCODE_JUMP_IF_TRUE:
					this.instrPtr = this.instrJumpIfTrue(this.instrPtr, parameterModes);
					break;
				case IntcodeComputer.OPCODE_JUMP_IF_FALSE:
					this.instrPtr = this.instrJumpIfFalse(this.instrPtr, parameterModes);
					break;
				case IntcodeComputer.OPCODE_LESS_THAN:
					this.instrPtr += this.instrLessThan(this.instrPtr, parameterModes);
					break;
				case IntcodeComputer.OPCODE_EQUALS:
					this.instrPtr += this.instrEquals(this.instrPtr, parameterModes);
					break;
				case IntcodeComputer.OPCODE_RELATIVE_BASE_OFFSET:
					this.instrPtr += this.instrRelativeModeOffset(this.instrPtr, parameterModes);
					break;
				default:
					throw 'unexpected opcode (' + opcode + ') at address ' + this.instrPtr;
			}
		}

		this.debug('final memory state: ' + this.memory);

		return this.output;
	}

	read(address) {
		if (address < 0) {
			throw 'invalid memory address [' + address + ']';
		}

		if (address > this.memory.length) {
			this.debug('extended memory access at [' + address + ']');
			return 0;
		}

		this.trace('read [' + address + '] is ' + this.memory[address]);
		return this.memory[address];
	}

	write(address, value) {
		this.trace('write [' + address + '] is ' + value);
		this.memory[address] = value;
		this.trace('memory is now ' + this.memory);
	}

	getParamVal(param, mode) {
		let paramVal;

		switch (mode) {
			case IntcodeComputer.PARAMETER_MODE_POSITION:
				paramVal = this.read(param);
				break;
			case IntcodeComputer.PARAMETER_MODE_IMMEDIATE:
				paramVal = param;
				break;
			case IntcodeComputer.PARAMETER_MODE_RELATIVE:
				paramVal = this.read(param + this.relativeBase);
				break;
			default:
				throw 'getParamVal() unexpected parameter mode (' + mode + ')';
		}

		this.trace('parameter ' + param + ' in ' + this.describeParameterMode(mode) + ' mode is value ' + paramVal);

		return paramVal;
	}

	getParamAddr(param, mode) {
		let paramAddr;

		switch (mode) {
			case IntcodeComputer.PARAMETER_MODE_POSITION:
				paramAddr = param;
				break;
			case IntcodeComputer.PARAMETER_MODE_RELATIVE:
				paramAddr = param + this.relativeBase;
				break;
			default:
				throw 'getParamAddr() unexpected write parameter mode (' + mode + ')';
		}

		this.trace('parameter ' + param + ' in ' + this.describeParameterMode(mode) + ' mode is address ' + paramAddr);

		return paramAddr;
	}

	instrAdd(instrPtr, parameterModes) {
		/* Opcode 1 adds together numbers read from two positions and stores the result in a third position. */

		let p1 = this.read(instrPtr + 1);
		let p2 = this.read(instrPtr + 2);
		let p3 = this.read(instrPtr + 3);

		let p1a = this.getParamVal(p1, parameterModes[0]);
		let p2a = this.getParamVal(p2, parameterModes[1]);
		let p3a = this.getParamAddr(p3, parameterModes[2]);

		const result = p1a + p2a;

		this.trace('instruction: add, [' + p3a + '] = ' + p1a + ' + ' + p2a);
		this.write(p3a, result);

		return 4;
	}

	instrMultiply(instrPtr, parameterModes) {
		/* Opcode 2 works exactly like opcode 1, except it multiplies the two inputs instead of adding them. */

		let p1 = this.read(instrPtr + 1);
		let p2 = this.read(instrPtr + 2);
		let p3 = this.read(instrPtr + 3);

		let p1a = this.getParamVal(p1, parameterModes[0]);
		let p2a = this.getParamVal(p2, parameterModes[1]);
		let p3a = this.getParamAddr(p3, parameterModes[2]);

		this.trace('instruction: multiply, [' + p3a + '] = ' + p1a + ' * ' + p2a);
		this.write(p3a, p1a * p2a);

		return 4;
	}

	instrInput(instrPtr, parameterModes) {
		/* Opcode 3 takes a single integer as input and saves it to the position given by its only parameter.
		For example, the instruction 3,50 would take an input value and store it at address 50. */

		if (this.input == undefined || this.input.length === 0) {
			throw 'no input available';
		}

		let inputValue = this.input.shift();
		let p1 = this.read(instrPtr + 1);

		let p1a = this.getParamAddr(p1, parameterModes[0]);

		this.trace('instruction: input, save ' + inputValue + ' to [' + p1a + ']');
		this.write(p1a, inputValue);

		return 2;
	}

	instrOutput(instrPtr, parameterModes) {
		/* Opcode 4 outputs the value of its only parameter.
		For example, the instruction 4,50 would output the value at address 50. */

		let p1 = this.read(instrPtr + 1);
		let p1a = this.getParamVal(p1, parameterModes[0]);

		this.trace('instruction: output, ' + p1a);
		this.console(p1a);
		this.output = p1a;
		if (this.outputCallback) {
			this.trace('invoking output callback...');
			this.outputCallback(this.output);
		}

		return 2;
	}

	instrJumpIfTrue(instrPtr, parameterModes) {
		/* Opcode 5 is jump-if-true: if the first parameter is non-zero, it sets the instruction pointer
		to the value from the second parameter. Otherwise, it does nothing. */

		// NOTE: "does nothing" is implemented as jump to the next instruction

		let p1 = this.read(instrPtr + 1);
		let p2 = this.read(instrPtr + 2);

		let p1a = this.getParamVal(p1, parameterModes[0]);
		let p2a = this.getParamVal(p2, parameterModes[1]);

		this.trace('instruction: jump to [' + p2a + '] if ' + p1a + ' != 0');
		if (p1a != 0) {
			this.trace('jumping to [' + p2a + ']');
			return p2a;
		}

		return instrPtr + 3;
	}

	instrJumpIfFalse(instrPtr, parameterModes) {
		/* Opcode 6 is jump-if-false: if the first parameter is zero, it sets the instruction pointer
		to the value from the second parameter. Otherwise, it does nothing. */

		// NOTE: "does nothing" is implemented as jump to the next instruction

		let p1 = this.read(instrPtr + 1);
		let p2 = this.read(instrPtr + 2);

		let p1a = this.getParamVal(p1, parameterModes[0]);
		let p2a = this.getParamVal(p2, parameterModes[1]);

		this.trace('instruction: jump to [' + p2a + '] if ' + p1a + ' == 0');
		if (p1a === 0) {
			this.trace('jumping to [' + p2a + ']');
			return p2a;
		}

		return instrPtr + 3;
	}

	instrLessThan(instrPtr, parameterModes) {
		/* Opcode 7 is less than: if the first parameter is less than the second parameter,
		it stores 1 in the position given by the third parameter. Otherwise, it stores 0. */

		let p1 = this.read(instrPtr + 1);
		let p2 = this.read(instrPtr + 2);
		let p3 = this.read(instrPtr + 3);

		let p1a = this.getParamVal(p1, parameterModes[0]);
		let p2a = this.getParamVal(p2, parameterModes[1]);
		let p3a = this.getParamAddr(p3, parameterModes[2]);

		const result = p1a < p2a ? 1 : 0;
		this.trace('instruction: less than, [' + p3a + '] = ' + result + ' (' + p1a + ' < ' + p2a + ')');

		this.write(p3a, result);

		return 4;
	}

	instrEquals(instrPtr, parameterModes) {
		/* Opcode 8 is equals: if the first parameter is equal to the second parameter,
		it stores 1 in the position given by the third parameter. Otherwise, it stores 0. */

		let p1 = this.read(instrPtr + 1);
		let p2 = this.read(instrPtr + 2);
		let p3 = this.read(instrPtr + 3);

		let p1a = this.getParamVal(p1, parameterModes[0]);
		let p2a = this.getParamVal(p2, parameterModes[1]);
		let p3a = this.getParamAddr(p3, parameterModes[2]);

		const result = p1a == p2a ? 1 : 0;
		this.trace('instruction: equals, [' + p3a + '] = ' + p1a + ' == ' + p2a + '? ' + result);
		this.write(p3a, result);

		return 4;
	}

	instrRelativeModeOffset(instrPtr, parameterModes) {
		/* Opcode 9 adjusts the relative base by the value of its only parameter.
		The relative base increases (or decreases, if the value is negative) by the value of the parameter. */

		let p1 = this.read(instrPtr + 1, 1);
		let p1a = this.getParamVal(p1, parameterModes[0]);

		this.trace('instruction: relative mode offset, adjust by ' + p1a);
		this.relativeBase += p1a;
		this.trace('relative base is now ' + this.relativeBase);

		return 2;
	}

	describeOpcode(opcode) {
		switch (opcode) {
			case IntcodeComputer.OPCODE_ADD:
				return 'add';
			case IntcodeComputer.OPCODE_MULTIPLY:
				return 'multiply';
			case IntcodeComputer.OPCODE_INPUT:
				return 'input';
			case IntcodeComputer.OPCODE_OUTPUT:
				return 'output';
			case IntcodeComputer.OPCODE_JUMP_IF_TRUE:
				return 'jump-if-true';
			case IntcodeComputer.OPCODE_JUMP_IF_FALSE:
				return 'jump-if-false';
			case IntcodeComputer.OPCODE_LESS_THAN:
				return 'less-than';
			case IntcodeComputer.OPCODE_EQUALS:
				return 'equals';
			case IntcodeComputer.OPCODE_RELATIVE_BASE_OFFSET:
				return 'relative-base-offset';
			case IntcodeComputer.OPCODE_HALT:
				return 'halt';
			default:
				return 'unknown opcode';
		}
	}

	describeParameterMode(paramMode) {
		switch (paramMode) {
			case IntcodeComputer.PARAMETER_MODE_IMMEDIATE:
				return 'immediate';
			case IntcodeComputer.PARAMETER_MODE_POSITION:
				return 'position';
			case IntcodeComputer.PARAMETER_MODE_RELATIVE:
				return 'relative';
			default:
				return 'unknown parameter mode';
		}
	}
}
