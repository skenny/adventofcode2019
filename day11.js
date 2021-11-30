const fs = require('fs');
const IntcodeComputer = require("./IntcodeComputer.js");

class Hull {

    static directions = [ '^', '>', 'v', '<' ];

    rows = [];
    x = 0;
    y = 0;
    direction = 0;

    constructor(startingPanel) {
        this.rows.push([startingPanel]);
    }

    turn(turnDirection) {
        if (turnDirection == 0) {
            this.direction = this.direction == 0 ? 3 : this.direction - 1;
        } else {
            this.direction = this.direction == 3 ? 0 : this.direction + 1;
        }
        this.stepForward();
    }

    stepForward() {
        switch (this.direction) {
            case 0: {
                this.moveTo(this.x, this.y - 1);
                break;
            }
            case 1: {
                this.moveTo(this.x + 1, this.y);
                break;
            }
            case 2: {
                this.moveTo(this.x, this.y + 1);
                break;
            }
            case 3: {
                this.moveTo(this.x - 1, this.y);
                break;
            }
            default:
                throw 'unexpected direction: ' + this.direction;
        }
    }

    moveTo(x, y) {
        this.x = x;
        this.y = y;

        if (x < 0) {
            this.x = 0;
            this.rows.forEach(r => r.unshift('.'));
        }
        if (x > this.rows[0].length - 1) {
            this.rows.forEach(r => r.push('.'));
        }
        if (y < 0) {
            this.y = 0;
            this.rows.unshift(new Array(this.rows[0].length).fill('.'));
        }
        if (y > this.rows.length - 1) {
            this.rows.push(new Array(this.rows[0].length).fill('.'));
        }
    }

    scanPanel() {
        const panelVal = this.rows[this.y][this.x];
        const panelColor = panelVal == '.' ? 0 : parseInt(panelVal);
        return panelColor;
    }

    paintPanel(color) {
        this.rows[this.y][this.x] = '' + color;
    }

    print() {
        let image = '';
        this.rows.forEach(row => {
            row.forEach(c => {
                if (c == 1) { 
                    image = image + '▓';
                } else {
                    image = image + '░';
                }
            })
            image += '\n';
        })
        console.log(image);
    }

    countPaintedPanels() {
        let count = 0;
        this.rows.forEach(row => count += row.filter(v => v != '.').length);
        return count;
    }
}

const test = () => {
    const hull = new Hull();

    console.log('panel (0,0) color is 0?', hull.scanPanel() == 0, hull.scanPanel());
    hull.paintPanel(1);
    console.log('panel (0,0) color is 1?', hull.scanPanel() == 1, hull.scanPanel());
    console.log('one painted panel?', hull.countPaintedPanels() == 1);

    hull.turn(0);
    hull.turn(0);
    hull.turn(0);
    hull.paintPanel(1);
    hull.turn(0);

    hull.turn(1);
    hull.turn(1);
    hull.turn(1);
    hull.turn(1);

    console.log('two painted panels?', hull.countPaintedPanels() == 2);
}

dailyProblems = () => {
    const paintHull = (startingPanel) => {
        const hull = new Hull(startingPanel);

        let output = [];
        const computer = new IntcodeComputer();
        computer.enablePauseForInput();    
        computer.setOutputCallback(o => output.push(o));
        computer.loadFile('day11-input');
        computer.run();
    
        while (true) {
            if (computer.paused) {
                if (output.length === 2) {
                    hull.paintPanel(output[0]);
                    hull.turn(output[1]);
                    output = [];
                }
    
                computer.run([hull.scanPanel()]);
            } else {
                break;
            }
        }
    
        return hull;
    }

    const run1 = () => {
        const hull = paintHull('.');
        return hull.countPaintedPanels();
    }

    const run2 = () => {
        const hull = paintHull('1');
        hull.print();
        return hull.countPaintedPanels();
    }

    console.log(1, run1());
    console.log(2, run2());
}

//test();
dailyProblems();