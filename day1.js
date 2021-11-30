const fs = require('fs');

const sum = (vals) => vals.reduce((t, i) => t + i, 0);
const input = () => fs.readFileSync('day1-input').toString().trim().split('\n').map(line => parseInt(line));

const massToFuel = (mass) => Math.floor(mass / 3) - 2;

const recursiveMassToFuel = (mass) => {
	var fuel = massToFuel(mass);
	return fuel < 0 ? 0 : fuel + recursiveMassToFuel(fuel);
};

console.log(1, sum(input().map(mass => massToFuel(mass))));
console.log(2, sum(input().map(mass => recursiveMassToFuel(mass))));
