const IntcodeComputer = require("./IntcodeComputer.js");

class ArcadeCabinet {

    static EMPTY_TILE = 0;  // No game object appears in this tile.
    static WALL_TILE = 1;   // Walls are indestructible barriers.
    static BLOCK_TILE = 2;  // Blocks can be broken by the ball.
    static PADDLE_TILE = 3; // The paddle is indestructible.
    static BALL_TILE = 4;   // The ball moves diagonally and bounces off objects.

    programFile;
    computer;
    tiles;
    score;
    paddleX;
    ballX;

    constructor(programFile) {
        this.programFile = programFile;
        this.reset();
    }

    reset() {
        this.computer = new IntcodeComputer();
        this.computer.loadFile(this.programFile);
        this.computer.enablePauseForInput();
        this.score = 0;
        this.paddleX = 0;
        this.ballX = 0;
        this.tiles = new Map();
    }

    play() {
        this.reset();

        // insert two quarters
        this.computer.write(0, 2);

        while (true) {
            const blocksRemaining = this.step(this.readInput());
            if (blocksRemaining === 0 || !this.computer.paused) {
                break;
            }
        }

        return this.score;
    }

    readInput() {
        if (this.paddleX < this.ballX) {
            return [1];
        } 
        if (this.paddleX > this.ballX) {
            return [-1];
        }
        return [0];
    }

    step(input) { 
        let outputBuffer = [];

        this.computer.setOutputCallback(o => {
            outputBuffer.push(o);

            if (outputBuffer.length === 3) {
                const x = outputBuffer.shift();
                const y = outputBuffer.shift();
                const value = outputBuffer.shift();

                if (x === -1 && y === 0) {
                    this.score = value;
                } else {
                    this.tiles.set(x + ',' + y, value);
                }
            }
        });

        this.computer.run(input);
        return this.update();
    }

    update() {
        let w = Number.MIN_SAFE_INTEGER;
        let h = Number.MIN_SAFE_INTEGER;
        for (const p of this.tiles.keys()) {
            let point = p.split(',');
            w = Math.max(w, parseInt(point[0]));
            h = Math.max(h, parseInt(point[1]));
        }

        let blockTilesDrawn = 0;
        let raster = 'Score: ' + this.score + '\n';
        for (let y = 0; y <= h; y++) {
            for (let x = 0; x <= w; x++) {
                const tileType = this.tiles.get(x + ',' + y) || 0;
                switch (tileType) {
                    case ArcadeCabinet.EMPTY_TILE:
                        raster += ' ';
                        break;
                    case ArcadeCabinet.WALL_TILE:
                        raster += '=';
                        break;
                    case ArcadeCabinet.BLOCK_TILE:
                        blockTilesDrawn += 1;
                        raster += '#';
                        break;
                    case ArcadeCabinet.PADDLE_TILE:
                        this.paddleX = x;
                        raster += '-';
                        break;
                    case ArcadeCabinet.BALL_TILE:
                        this.ballX = x;
                        raster += 'o';
                        break;
                    default:
                        throw 'unexpected tile ' + tileType + ' at position ' + x + ', ' + y;
                }
            }
            raster += '\n';
        }

        console.clear();
        console.log(raster);
        
        return blockTilesDrawn;
    }

}

p1 = () => {
    const cabinet = new ArcadeCabinet('day13-input');
    console.log(1, cabinet.step());
}

p2 = () => {
    const cabinet = new ArcadeCabinet('day13-input');
    console.log(2, cabinet.play());
}

//p1();
p2();