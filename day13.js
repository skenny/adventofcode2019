const IntcodeComputer = require("./IntcodeComputer.js");

class ArcadeCabinet {

    static EMPTY_TILE = 0;  // No game object appears in this tile.
    static WALL_TILE = 1;   // Walls are indestructible barriers.
    static BLOCK_TILE = 2;  // Blocks can be broken by the ball.
    static PADDLE_TILE = 3; // The paddle is indestructible.
    static BALL_TILE = 4;   // The ball moves diagonally and bounces off objects.

    tiles = new Map();

    fillTile(x, y, tileType) {
        this.tiles.set(x + ',' + y, tileType);
    }

    drawScreen() {
        let w = Number.MIN_SAFE_INTEGER;
        let h = Number.MIN_SAFE_INTEGER;
        for (const p of this.tiles.keys()) {
            let point = p.split(',');
            w = Math.max(w, parseInt(point[0]));
            h = Math.max(h, parseInt(point[1]));
        }

        let blockTiles = 0;
        let raster = '';
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
                        blockTiles += 1;
                        raster += '#';
                        break;
                    case ArcadeCabinet.PADDLE_TILE:
                        raster += '-';
                        break;
                    case ArcadeCabinet.BALL_TILE:
                        raster += 'o';
                        break;
                    default:
                        throw 'unexpected tile type: ' + tileType + ' at position ' + x + ',' + y;
                }
            }
            raster += '\n';
        }

        console.log(raster);
        return blockTiles;
    }

}

dailyProblems = () => {
    const cabinet = new ArcadeCabinet();
    const computer = new IntcodeComputer();

    let output = [];
    computer.loadFile('day13-input');
    //computer.setOutputLevel(IntcodeComputer.OUTPUT_LEVEL_CONSOLE);
    computer.setOutputCallback(o => output.push(o));
    computer.run();

    for (let t = 0; t < output.length; t += 3) {
        cabinet.fillTile(output[t], output[t + 1], output[t + 2]);
    }
    let blockTiles = cabinet.drawScreen();
    console.log(1, blockTiles);
}

dailyProblems();