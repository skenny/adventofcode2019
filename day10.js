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

	manhattanDistance(otherPoint) {
		return Math.abs(this.x - otherPoint.x) + Math.abs(this.y - otherPoint.y);
	}

    angleTo(otherPoint) {
        const angle = atan2(this.y - otherPoint.y, otherPoint.x - this.x) * 180 / Math.PI;
        console.log('angle from ' + this.toString() + ' to ' + otherPoint.toString() + ' is ' + angle);
        return angle;
    }

}

class LineSegment {

    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
        this.distance = this.calculateDistance();
        this.slope = this.calculateSlope();
        this.yOffset = this.calculateYOffset();
    }

	isHorizontal() { return this.p1.y === this.p2.y; }
	isVertical() { return this.p1.x === this.p2.x; }

    calculateDistance() {
        //return Math.sqrt(Math.pow(this.p1.x - this.p2.x, 2) + Math.pow(this.p1.y - this.p2.y, 2));
        return Math.abs(this.p1.x - this.p2.x) + Math.abs(this.p1.y - this.p2.y);
    }

    calculateSlope() {
        return (this.p2.y - this.p1.y) / (this.p2.x - this.p1.x);
    }

    calculateYOffset() {
        return this.p1.y - (this.calculateSlope() * this.p1.x);
    }

    intersectsPoint(point) {
        if (point.equals(this.p1) || point.equals(this.p2)) {
            return true;
        }

        let minX = Math.min(this.p1.x, this.p2.x);
        let maxX = Math.max(this.p1.x, this.p2.x);
        let minY = Math.min(this.p1.y, this.p2.y);
        let maxY = Math.max(this.p1.y, this.p2.y);
        let intersects = minX <= point.x && point.x <= maxX && minY <= point.y && point.y <= maxY;

        if (intersects && !this.isHorizontal() && !this.isVertical()) {
            const y = this.slope * point.x + this.yOffset;
            intersects = y == point.y;    
        }

        //console.log(this.p1.toString() + ' to ' + this.p2.toString() + ' vs ' + point.toString() + (intersects ? '; intersects' : ''));
        return intersects;
    }

}

const findAsteroidPoints = (grid) => {
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

const countAsteroidsFromPoint = (point, otherAsteroidPoints) => {
    let visibleAsteroids = [];
    otherAsteroidPoints.forEach(asteroidPoint => {
        let line = new LineSegment(point, asteroidPoint);
        let inLineAsteroids = otherAsteroidPoints.filter(p => line.intersectsPoint(p));
        let visibleAsteroid = findClosestAsteroidPoint(point, inLineAsteroids);
        //console.log('asteroid point', point.toString(), 'to', asteroidPoint.toString(), 'sees asteroid at', inLineAsteroids.toString());
        if (!visibleAsteroids.some(vp => vp == visibleAsteroid)) {
            visibleAsteroids.push(visibleAsteroid);
        }
    });

    let count = visibleAsteroids.length;
    console.log(point, 'has ' + count + ' visible asteroids'); //:' + visibleAsteroids);
    return count;
}

const findClosestAsteroidPoint = (point, inLineAsteroids) => {
    let minDistance = Number.MAX_SAFE_INTEGER;
    let blockingAsteroid = null;

    //console.log('findBlockingAsteroid', point, inLineAsteroids);

    inLineAsteroids.forEach(asteroid => {
        let asteroidDistance = new LineSegment(asteroid, point).distance;
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

    const asteroidField = findAsteroidPoints(input);
    let bestPoint = null;
    let mostAsteroids = Number.MIN_SAFE_INTEGER;

    asteroidField.forEach(point => {
        let otherAsteroidPoints = asteroidField.filter(i => i !== point);
        let numVisibleAsteroids = countAsteroidsFromPoint(point, otherAsteroidPoints);
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

const test = () => {
    const formatResult = (r, expectedPoint) => 'best point is ' + expectedPoint.toString() + '? ' + r.point.equals(expectedPoint) + '; got ' + r.point.toString() + ' with ' + r.asteroidCount;

    console.log('test 1', formatResult(scanAsteroidField('day10-input-test1'), new Point(3,4)));
    console.log('test 2', formatResult(scanAsteroidField('day10-input-test2'), new Point(5,8)));
    console.log('test 3', formatResult(scanAsteroidField('day10-input-test3'), new Point(1,2)));
    console.log('test 4', formatResult(scanAsteroidField('day10-input-test4'), new Point(6,3)));
    console.log('test 5', formatResult(scanAsteroidField('day10-input-test5'), new Point(11,13)));
}

test();