class Vector {

    x = 0;
    y = 0;
    z = 0;

    constructor(x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    toString() {
        return '<x=' + this.fn(this.x) + ', y=' + this.fn(this.y) + ', z=' + this.fn(this.z) + '>';
    }

    absSum() {
        return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
    }

    fn(n) {
        return n.toString().padStart(3, ' ');
    }

}

class Moon {

    name;
    pos;
    vel;

    constructor(name, x, y, z) {
        this.name = name;
        this.pos = new Vector(x, y, z);
        this.vel = new Vector(0, 0, 0);
    }

    toString() {
        return this.name.padStart(8, ' ') + ' pos=' + this.pos.toString() + ', vel=' + this.vel.toString();
    }

    applyGravity(otherMoon) {
        this.applyGravityOnAxis('x', otherMoon);
        this.applyGravityOnAxis('y', otherMoon);
        this.applyGravityOnAxis('z', otherMoon);
    }

    applyGravityOnAxis(axis, otherMoon) {
        if (otherMoon.pos[axis] > this.pos[axis]) {
            this.vel[axis] += 1;
            otherMoon.vel[axis] -= 1;
        } else if (otherMoon.pos[axis] < this.pos[axis]) {
            this.vel[axis] -= 1;
            otherMoon.vel[axis] += 1;
        }
    }

    applyVelocity() {
        this.applyVelocityOnAxis('x');
        this.applyVelocityOnAxis('y');
        this.applyVelocityOnAxis('z');
    }

    applyVelocityOnAxis(axis) {
        this.pos[axis] += this.vel[axis];
    }

    calculateTotalEnergy() {
        return this.pos.absSum() * this.vel.absSum();
    }

}

const gcd = (n1, n2) => {
    if (n1 == 0 || n2 == 0) {
        return n1 + n2;
    }
    const an1 = Math.abs(n1);
    const an2 = Math.abs(n2);
    const min = Math.min(an1, an2);
    const max = Math.max(an1, an2);
    return gcd(max % min, min);
}

const lcm = (n1, n2) => {
    if (n1 == 0 || n2 == 0) {
        return 0;
    }
    return Math.abs(n1 * n2) / gcd(n1, n2);
}

const timeStep = (moons) => {
    for (let i = 0; i < moons.length - 1; i++) {
        for (let j = i + 1; j < moons.length; j++) {
            moons[i].applyGravity(moons[j]);    
        }
    }
    moons.forEach(moon => moon.applyVelocity());
}

const determineAxisPeriod = (moons, axis) => {
    let posI = moons.map(moon => moon.pos[axis]);
    let velI = moons.map(moon => moon.vel[axis]);

    let steps = 0;
    while (true) {
        for (let i = 0; i < moons.length - 1; i++) {
            for (let j = i + 1; j < moons.length; j++) {
                moons[i].applyGravityOnAxis(axis, moons[j]);
            }
        }

        moons.forEach(moon => moon.applyVelocityOnAxis(axis));

        steps++;

        let match = moons.reduce((r, moon, idx) => r = r && moon.pos[axis] == posI[idx] && moon.vel[axis] == velI[idx], true);
        if (match) {
            break;
        }
    }

    return steps;
}

const determineSystemPeriod = (moons) => {
    const axisPeriods = ['x', 'y', 'z'].map(axis => determineAxisPeriod(moons, axis));
    const systemPeriod = axisPeriods.reduce(lcm, 1);
    console.log('axis periods are', axisPeriods, 'system period is', systemPeriod);
    return systemPeriod;
}

const calculateSystemEnergy = (moons) => {
    return moons.reduce((e, m) => e += m.calculateTotalEnergy(), 0);
}

const run = (moons, steps) => {
    console.log('--- initial state, ' + calculateSystemEnergy(moons) + ' energy --- \n', formatMoons(moons));
    for (let i = 0; i < steps; i++) {
        timeStep(moons);
    }
    const finalSystemEnergy = calculateSystemEnergy(moons);
    console.log('--- ' + steps + ' steps, ' + finalSystemEnergy + ' energy --- \n', formatMoons(moons));
    return finalSystemEnergy;
}

const formatMoons = (moons) => moons.map(m => m.toString()).join('\n');

const test = () => {
    console.log(
        'test1?',
        run([
            new Moon('Io', -1, 0, 2),
            new Moon('Europa', 2, -10, -7),
            new Moon('Ganymede', 4, -8, 8),
            new Moon('Callisto', 3, 5, -1)
        ], 10) == 179
    );
    console.log(
        'test2?',
        run([
            new Moon('Io', -8, -10, 0),
            new Moon('Europa', 5, 5, 10),
            new Moon('Ganymede', 2, -7, 3),
            new Moon('Callisto', 9, -8, -3)
        ], 100) == 1940
    );
    console.log(
        'test3?',
        determineSystemPeriod([
            new Moon('Io', -1, 0, 2),
            new Moon('Europa', 2, -10, -7),
            new Moon('Ganymede', 4, -8, 8),
            new Moon('Callisto', 3, 5, -1)
        ]) == 2772
    );
    console.log(
        'test4?',
        determineSystemPeriod([
            new Moon('Io', -8, -10, 0),
            new Moon('Europa', 5, 5, 10),
            new Moon('Ganymede', 2, -7, 3),
            new Moon('Callisto', 9, -8, -3)
        ]) == 4686774924
    )
}

const dailyProblems = () => {
    console.log(1, run([
        new Moon('Io', -1, -4, 0),
        new Moon('Europa', 4, 7, -1),
        new Moon('Ganymede', -14, -10, 9),
        new Moon('Callisto', 1, 2, 17)
    ], 1000));
    console.log(2, determineSystemPeriod([
        new Moon('Io', -1, -4, 0),
        new Moon('Europa', 4, 7, -1),
        new Moon('Ganymede', -14, -10, 9),
        new Moon('Callisto', 1, 2, 17)
    ]));
}

test();
dailyProblems();