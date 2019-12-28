class Vector {

    x = 0;
    y = 0;
    z = 0;

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
    pos = new Vector();
    vel = new Vector();

    constructor(name, x, y, z) {
        this.name = name;
        this.pos.x = x;
        this.pos.y = y;
        this.pos.z = z;
    }

    toString() {
        return this.name.padStart(8, ' ') + ' pos=' + this.pos.toString() + ', vel=' + this.vel.toString();
    }

    applyGravity(otherMoon) {
        //console.log('applying gravity between', this.name, 'and', otherMoon.name);

        if (otherMoon.pos.x > this.pos.x) {
            this.vel.x += 1;
            otherMoon.vel.x -= 1;
        } else if (otherMoon.pos.x < this.pos.x) {
            this.vel.x -= 1;
            otherMoon.vel.x += 1;
        }
    
        if (otherMoon.pos.y > this.pos.y) {
            this.vel.y += 1;
            otherMoon.vel.y -= 1;
        } else if (otherMoon.pos.y < this.pos.y) {
            this.vel.y -= 1;
            otherMoon.vel.y += 1;
        }
    
        if (otherMoon.pos.z > this.pos.z) {
            this.vel.z += 1;
            otherMoon.vel.z -= 1;
        } else if (otherMoon.pos.z < this.pos.z) {
            this.vel.z -= 1;
            otherMoon.vel.z += 1;
        }
    }

    applyVelocity() {
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        this.pos.z += this.vel.z;
    }

    calculateTotalEnergy() {
        return this.pos.absSum() * this.vel.absSum();
    }
}

const timeStep = (moons) => {
    for (let i = 0; i < moons.length - 1; i++) {
        for (let j = i + 1; j < moons.length; j++) {
            moons[i].applyGravity(moons[j]);    
        }
    }
    moons.forEach(moon => moon.applyVelocity());
}

const calculateSystemEnergy = (moons) => {
    return moons.reduce((e, m) => e += m.calculateTotalEnergy(), 0);
}

const run = (moons, steps) => {
    console.log('--- initial state, ' + calculateSystemEnergy(moons) + ' energy --- \n', formatMoons(moons));
    for (let i = 0; i < steps; i++) {
        timeStep(moons);
        //console.log(f'step', i, calculateSystemEnergy(moons) + '\n', formatMoons(moons));
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
}

const dailyProblems = () => {
    const moons = [
        new Moon('Io', -1, -4, 0),
        new Moon('Europa', 4, 7, -1),
        new Moon('Ganymede', -14, -10, 9),
        new Moon('Callisto', 1, 2, 17)
    ];
    console.log(1, run(moons, 1000));
}

test();
dailyProblems();