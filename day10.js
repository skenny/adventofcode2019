const fs = require('fs');

class Point {

	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

    toString() {
        return '(' + this.x + ', ' + this.y + ')';
    }

    equals(otherPoint) {
        return this.x === otherPoint.x && this.y === otherPoint.y;
    }

	manhattanDistanceTo(otherPoint) {
		return Math.abs(this.x - otherPoint.x) + Math.abs(this.y - otherPoint.y);
	}

    angleTo(otherPoint) {
        return Math.atan2(this.y - otherPoint.y, otherPoint.x - this.x) * 180 / Math.PI;
    }

}

const findAsteroids = (grid) => {
    const rows = grid.split('\n');
    const asteroid = '#';
    const points = [];

    for (let y = 0; y < rows.length; y++) {
        let row = rows[y];
        for (let x = 0; x < row.length; x++) {
            if (row[x] == asteroid) {
                points.push(new Point(x, y));
            }
        }
    }

    return points;
}

const findAsteroidsAtAngle = (asteroidPoints, point, angle) => {
    return asteroidPoints.filter(p => point.angleTo(p) == angle);
}

const findVisibleAsteroids = (point, otherAsteroidPoints) => {
    let visibleAsteroids = [];
    otherAsteroidPoints.forEach(asteroidPoint => {
        let angle = point.angleTo(asteroidPoint);
        let inLineAsteroids = findAsteroidsAtAngle(otherAsteroidPoints, point, angle);
        let visibleAsteroid = findClosestAsteroid(point, inLineAsteroids);
        //console.log('asteroid point', point.toString(), 'to', asteroidPoint.toString(), 'sees asteroid at', inLineAsteroids.toString());
        if (!visibleAsteroids.some(i => i.asteroid == visibleAsteroid)) {
            visibleAsteroids.push({ asteroid: visibleAsteroid, angle: angle });
        }
    });
    return visibleAsteroids;
}

const findClosestAsteroid = (point, inLineAsteroids) => {
    let minDistance = Number.MAX_SAFE_INTEGER;
    let blockingAsteroid = null;

    //console.log('findBlockingAsteroid', point, inLineAsteroids);

    inLineAsteroids.forEach(asteroid => {
        let asteroidDistance = point.manhattanDistanceTo(asteroid);
        if (asteroidDistance < minDistance) {
            minDistance = asteroidDistance;
            blockingAsteroid = asteroid;
        }
    });

    //console.log('findBlockingAsteroid', point, blockingAsteroid, minDistance);

    return blockingAsteroid;
}

scanAsteroidField = (filename) => {
    const input = fs.readFileSync(filename).toString().trim();
    return findAsteroids(input);
}

determineBaseLocation = (asteroidField) => {
    let bestPoint = null;
    let mostAsteroids = Number.MIN_SAFE_INTEGER;

    asteroidField.forEach(point => {
        let otherAsteroidPoints = asteroidField.filter(i => i !== point);
        let numVisibleAsteroids = findVisibleAsteroids(point, otherAsteroidPoints).length;
        if (numVisibleAsteroids > mostAsteroids) {
            mostAsteroids = numVisibleAsteroids;
            bestPoint = point;
        }
    });

    return {
        point: bestPoint,
        asteroidCount: mostAsteroids
    };
}

vaporizeAsteroids = (asteroidField, n) => {

}

const test = () => {
    const formatResult = (r, expectedPoint) => 'best point is ' + expectedPoint.toString() + '? ' + r.point.equals(expectedPoint) + '; got ' + r.point.toString() + ' with ' + r.asteroidCount;
    console.log('test 1', formatResult(determineBaseLocation(scanAsteroidField('day10-input-test1')), new Point(3,4)));
    console.log('test 2', formatResult(determineBaseLocation(scanAsteroidField('day10-input-test2')), new Point(5,8)));
    console.log('test 3', formatResult(determineBaseLocation(scanAsteroidField('day10-input-test3')), new Point(1,2)));
    console.log('test 4', formatResult(determineBaseLocation(scanAsteroidField('day10-input-test4')), new Point(6,3)));
    console.log('test 5', formatResult(determineBaseLocation(scanAsteroidField('day10-input-test5')), new Point(11,13)));
}

const dailyProblems = () => {
    console.log(1, determineBaseLocation(scanAsteroidField('day10-input')));
    console.log(2, vaporizeAsteroids(scanAsteroidField('day10-input'), 200));
}

test();
dailyProblems();