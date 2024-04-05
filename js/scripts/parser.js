/**
 * Fill in image name and level function name with your values
 * Image name points to an image in the same directory to user for parsing
 * Level function name referes to what you want the resulting funciton to be called to generate the level
 * Color Key Provided In The Zip
 *
 * Notes!
 * The image is indexed not like a normal 2D Array! But like our game canvas with (0,0) at top left and y+ being down!
 * Pixel at index (2, 5) will be the pixel in column 2, row 5!
 *
 * @author Vlad Tregubov (modified by Nathan Hinthorne)
 */
var Jimp = require('jimp');
const fs = require('fs');
const { Console } = require('console');
const { set } = require('image-pixels/lib/cache');
const GROUND_COLOR = 1530336767;
const PLAYER_COLOR = 1224396543;
const METTAUR_COLOR = 4280558847;
const DRILL_COLOR = 3984265471;
const SPIKE_COLOR = 2408550399;
const SPIKE_RIGHT_COLOR = 2947526655;
const SPIKE_DOWN_COLOR = 3485910783;
const SPIKE_LEFT_COLOR = 1701144063;
const LARGE_HEALTH_COLOR = 4291952895;
const SMALL_HEALTH_COLOR = 2306086143;
const RUSH_COLOR = 4290098687;
const DOG_BOSS_COLOR = 362772223;
const SPIKE_FLOAT_COLOR = 283990527;
const POP_UP_COLOR = 4043358719;
const LASER_COLOR = 2416906239;
const LASER_SIDE_COLOR = 2720080383;
const TURRET_RIGHT_COLOR = 732750335;
const TURRET_DOWN_COLOR = 478721279;
const TURRET_LEFT_COLOR = 409570047;
const TURRET_UP_COLOR = 256796671;
const CLOCK_COLOR = 2451565311;
const SIGMA_COLOR = 255;
const CHECKPOINT_COLOR = 4291457279;
/**Fill These In With Your Values **/
const IMAGE_NAME = 'final_level.png';
const LEVEL_FUNCTION_NAME = 'loadTestLevel';

//////////////////////////////// WHERE THE MAGIC HAPPENS //////////////////////////////////
//converted level
let levelcommands = [];
//Keep track of how many distinct colors we have (How many types of objects)
let colors = new Set();
//Load in your image
Jimp.read(IMAGE_NAME, (err, level) => {
    if (err) throw err;
    console.log('Loaded image...');
    //Get the dimensions of the image
    let height = level.bitmap.height;
    let width = level.bitmap.width;
    //itterate through every pixel in the image
    for (let xCoord = 0; xCoord < width; xCoord++) {
        for (let yCoord = 0; yCoord < height; yCoord++) {
            /**Sigma grind specific  */
            colors.add(level.getPixelColor(xCoord, yCoord));
            //When we come accross a pixel with a color value from our defined colors
            //we call a function that creates the line of code to add it to the game
            switch (level.getPixelColor(xCoord, yCoord)) {
                case GROUND_COLOR:
                    generateGroundTile(level, xCoord, yCoord);
                    break;
                case PLAYER_COLOR:
                    generatePlayer(level, xCoord, yCoord);
                    break;
                case METTAUR_COLOR:
                    generateMettaur(level, xCoord, yCoord);
                    break;
                case DRILL_COLOR:
                    generateDrill(level, xCoord, yCoord);
                    break;
                case SPIKE_COLOR:
                    generateSpikeTile(level, xCoord, yCoord);
                    break;
                case SPIKE_RIGHT_COLOR:
                    generateSpikeTileRight(level, xCoord, yCoord);
                    break;
                case SPIKE_DOWN_COLOR:
                    generateSpikeTileDown(level, xCoord, yCoord);
                    break;
                case SPIKE_LEFT_COLOR:
                    generateSpikeTileLeft(level, xCoord, yCoord);
                    break;
                case LARGE_HEALTH_COLOR:
                    generateLargeHealthPack(level, xCoord, yCoord);
                    break;
                case SMALL_HEALTH_COLOR:
                    generateSmallHealthPack(level, xCoord, yCoord);
                    break;
                case RUSH_COLOR:
                    generateRush(level, xCoord, yCoord);
                    break;
                case DOG_BOSS_COLOR:
                    generateDogBoss(level, xCoord, yCoord);
                    break;
                case SPIKE_FLOAT_COLOR:
                    genrateSpikeFloat(level, xCoord, yCoord);
                    break;
                case POP_UP_COLOR:
                    generatePopUp(level, xCoord, yCoord);
                    break;
                case LASER_COLOR:
                    generateLaser(level, xCoord, yCoord);
                    break;
                case LASER_SIDE_COLOR:
                    generateLaserSide(level, xCoord, yCoord);
                    break;
                case TURRET_RIGHT_COLOR:
                    generateTurretRight(level, xCoord, yCoord);
                    break;
                case TURRET_DOWN_COLOR:
                    generateTurretDown(level, xCoord, yCoord);
                    break;
                case TURRET_LEFT_COLOR:
                    generateTurretLeft(level, xCoord, yCoord);
                    break;
                case TURRET_UP_COLOR:
                    generateTurretUp(level, xCoord, yCoord);
                    break;
                case CLOCK_COLOR:
                    generateClock(level, xCoord, yCoord);
                    break;
                case SIGMA_COLOR:
                    generateSigma(level, xCoord, yCoord);
                    break;
                case CHECKPOINT_COLOR:
                    generateCheckpoint(level, xCoord, yCoord);
                    break;
                default:
                    break;
            }
        }
    }
    //This will show us which pixels we picked up and changed
    level.write('updated_test_image.png');
    //see how many entities we added!
    console.log('Done! Used', levelcommands.length, 'entities!');
    //Show the colors of entities used in the image
    console.log(colors);

    /**Sigma Grind Specific Code */
    //add ground check
    levelcommands.push(
        ' gameEngine.entities.forEach(function (entity) { if (entity instanceof Ground) entity.checkForGrass(); });'
    );
    //add the background
    levelcommands.push('gameEngine.addEntity(new Water(gameEngine));');

    //add gravity to start
    levelcommands.unshift('let gravity = 0.2;');
    //add level name to start
    levelcommands.unshift(`function ${LEVEL_FUNCTION_NAME}(gameEngine){`);
    //add closing bracket
    levelcommands.push('}');
    /**End Sigma Grind Specific Code */

    //Combine all the commands into one line to export
    let commands = '';
    for (let i = 0; i < levelcommands.length; i++) {
        commands = commands + levelcommands[i];
    }
    //Write it to a text file so we can move it to our game!
    fs.writeFile('./level.txt', commands, (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });
});

/** Code for generating the entity add code */
const generatePlayer = (level, col, row) => {
    console.log('Generating Player.... at ', col, ' ', row);
    //fill pixel with white
    level.setPixelColor(0x000000, col, row);
    //add the player command to the command array
    levelcommands.unshift(
        `gameEngine.addEntity(new Player(gameEngine, ${col}, ${
            row - level.bitmap.height
        }));`
    );
};
const generateMettaur = (level, col, row) => {
    console.log('Generating Mettaur.... at ', col, ' ', row);
    //fill pixel with white
    level.setPixelColor(0x000000, col, row);
    //add the player command to the command array
    levelcommands.push(
        `gameEngine.addEntity(new Mettaur(gameEngine, ${col}, ${
            row - level.bitmap.height
        },gravity));`
    );
};
const genrateSpikeFloat = (level, col, row) => {
    console.log('Generating SpikeBall.... at ', col, ' ', row);
    //fill pixel with white
    level.setPixelColor(0x000000, col, row);
    //add the player command to the command array
    levelcommands.push(
        `gameEngine.addEntity(new SpikeBall(gameEngine, ${col}, ${
            row - level.bitmap.height
        },gravity));`
    );
};

const generateSigma = (level, col, row) => {
    console.log('Generating Sigma.... at ', col, ' ', row);
    //fill pixel with white
    level.setPixelColor(0x000000, col, row);
    //add the player command to the command array
    levelcommands.push(
        `gameEngine.addEntity(new Sigma(gameEngine, ${col}, ${
            row - level.bitmap.height
        }));`
    );
};
const generateLaser = (level, col, row) => {
    console.log('Generating BeamBarrier.... at ', col, ' ', row);
    //fill pixel with white
    level.setPixelColor(0x000000, col, row);
    //add the player command to the command array
    levelcommands.push(
        `gameEngine.addEntity(new BeamBarrier(gameEngine, ${col}, ${
            row - level.bitmap.height
        },0,
      1));`
    );
};
const generateLaserSide = (level, col, row) => {
    console.log('Generating BeamBarrier.... at ', col, ' ', row);
    //fill pixel with white
    level.setPixelColor(0x000000, col, row);
    //add the player command to the command array
    levelcommands.push(
        `gameEngine.addEntity(new BeamBarrier(gameEngine, ${col}, ${
            row - level.bitmap.height
        },1,
      1));`
    );
};

const generatePopUp = (level, col, row) => {
    console.log('Generating Pop Up.... at ', col, ' ', row);
    //fill pixel with white
    level.setPixelColor(0x000000, col, row);
    //add the player command to the command array
    levelcommands.push(
        `gameEngine.addEntity(new PopUpEnemy(gameEngine, ${col}, ${
            row - level.bitmap.height
        },true,
      0));`
    );
};
const generateLargeHealthPack = (level, col, row) => {
    console.log('Generating Large Health Pack.... at ', col, ' ', row);
    //fill pixel with white
    level.setPixelColor(0x000000, col, row);
    //add the player command to the command array
    levelcommands.push(
        `gameEngine.addEntity(new FullHealthPack(gameEngine, ${col}, ${
            row - level.bitmap.height
        }));`
    );
};
const generateTurretRight = (level, col, row) => {
    console.log('Generating Turret.... at ', col, ' ', row);
    //fill pixel with white
    level.setPixelColor(0x000000, col, row);
    //add the player command to the command array
    levelcommands.push(
        `gameEngine.addEntity(new Turret(gameEngine, ${col}, ${
            row - level.bitmap.height
        },
      1));`
    );
};
const generateTurretUp = (level, col, row) => {
    console.log('Generating Turret.... at ', col, ' ', row);
    //fill pixel with white
    level.setPixelColor(0x000000, col, row);
    //add the player command to the command array
    levelcommands.push(
        `gameEngine.addEntity(new Turret(gameEngine, ${col}, ${
            row - level.bitmap.height
        },
      0));`
    );
};
const generateTurretDown = (level, col, row) => {
    console.log('Generating Turret.... at ', col, ' ', row);
    //fill pixel with white
    level.setPixelColor(0x000000, col, row);
    //add the player command to the command array
    levelcommands.push(
        `gameEngine.addEntity(new Turret(gameEngine, ${col}, ${
            row - level.bitmap.height
        },
    2));`
    );
};
const generateTurretLeft = (level, col, row) => {
    console.log('Generating Turret.... at ', col, ' ', row);
    //fill pixel with white
    level.setPixelColor(0x000000, col, row);
    //add the player command to the command array
    levelcommands.push(
        `gameEngine.addEntity(new Turret(gameEngine, ${col}, ${
            row - level.bitmap.height
        },
      3));`
    );
};
const generateClock = (level, col, row) => {
    console.log('Generating Clock.... at ', col, ' ', row);
    //fill pixel with white
    level.setPixelColor(0x000000, col, row);
    //add the player command to the command array
    levelcommands.push(
        `gameEngine.addEntity(new Clock(gameEngine, ${col}, ${
            row - level.bitmap.height
        },
      5000));`
    );
};
const generateDogBoss = (level, col, row) => {
    console.log('Generating DogBoss.... at ', col, ' ', row);
    //fill pixel with white
    level.setPixelColor(0x000000, col, row);
    //add the player command to the command array
    levelcommands.push(
        `gameEngine.addEntity(new DogBoss(gameEngine, ${col}, ${
            row - level.bitmap.height
        },gravity));`
    );
};
const generateRush = (level, col, row) => {
    console.log('Generating Rush.... at ', col, ' ', row);
    //fill pixel with white
    level.setPixelColor(0x000000, col, row);
    //add the player command to the command array
    levelcommands.push(
        `gameEngine.addEntity(new Rush(gameEngine, ${col}, ${
            row - level.bitmap.height
        },5,'Bark! Bark! Whimper! Bark! Bark!'));`
    );
};
const generateSmallHealthPack = (level, col, row) => {
    console.log('Generating Small Health Pack.... at ', col, ' ', row);
    //fill pixel with white
    level.setPixelColor(0x000000, col, row);
    //add the player command to the command array
    levelcommands.push(
        `gameEngine.addEntity(new SmallHealthPack(gameEngine, ${col}, ${
            row - level.bitmap.height
        }));`
    );
};
const generateDrill = (level, col, row) => {
    console.log('Generating Drill.... at ', col, ' ', row);
    //fill pixel with white
    level.setPixelColor(0x000000, col, row);
    //add the player command to the command array
    levelcommands.push(
        `gameEngine.addEntity(new Drill(gameEngine, ${col}, ${
            row - level.bitmap.height
        },8));`
    );
};

const generateCheckpoint = (level, col, row) => {
    console.log('Generating Checkpoint.... at ', col, ' ', row);
    //fill pixel with white
    level.setPixelColor(0x000000, col, row);
    levelcommands.push(
        `gameEngine.addEntity(new Checkpoint(gameEngine, ${col}, ${
            row - level.bitmap.height
        }));`
    );
};

const generateGroundTile = (level, startCol, startRow) => {
    //we know thatthis is a rectangle so it will be equaly wide everywhere
    //find width of this ground tile
    console.log('Generating Ground...');
    let endCol = level.bitmap.width;
    //this is treated as x coord ycoord from top left
    for (let xCoord = startCol; xCoord < level.bitmap.width; xCoord++) {
        //When we run into something that is a different color it is the end of our ground tile!
        if (level.getPixelColor(xCoord, startRow) != GROUND_COLOR) {
            // console.log("Found diff color")
            endCol = xCoord;
            break;
        }
    }
    //width of our tile block
    let minWidth = endCol - startCol;

    //now we need to find the shortest part of this block to find where to section it off
    let endRow = level.bitmap.height;
    for (let xCoord = startCol; xCoord < endCol; xCoord++) {
        //traverse down until we find something that is a different color
        for (let yCoord = startRow; yCoord < level.bitmap.height; yCoord++) {
            //the second we find the min here we can break and check next col over
            if (level.getPixelColor(xCoord, yCoord) != GROUND_COLOR) {
                //we found the width of this block
                endRow = Math.min(endRow, yCoord);
                // console.log("New end row: ", endRow);
                break;
            }
        }
    }
    let minHeight = endRow - startRow;

    //having found this min height we need to fill in those pixels with white so we dont catch them again
    for (let i = startRow; i < endRow; i++) {
        for (let j = startCol; j < endCol; j++) {
            level.setPixelColor(0x000000, j, i);
        }
    }
    //add the ground tile command to the command array
    levelcommands.push(
        `gameEngine.addEntity(new Ground(gameEngine, 2, ${startCol}, ${
            startRow - level.bitmap.height
        }, ${minWidth}, ${minHeight}, 1, 0, 0));`
    );
};

const generateSpikeTile = (level, startCol, startRow) => {
    //we know thatthis is a rectanglinte so it will be equaly wide everywhere
    //find width of this ground tile
    console.log('Generating Spike Facing Up...');
    // console.log("Starting at: ", startCol, " " + startRow);
    let endCol = level.bitmap.width;
    //this is treated as x coord ycoord from top left
    for (let xCoord = startCol; xCoord < level.bitmap.width; xCoord++) {
        if (level.getPixelColor(xCoord, startRow) != SPIKE_COLOR) {
            //we found the width of this block
            // console.log("Found diff color")
            endCol = xCoord;
            break;
        }
    }
    //this is how wide our tile will be
    // console.log("end at col " + endCol)

    let minWidth = endCol - startCol;

    //now we need to find the shortest part of this block to find where to section it off
    let endRow = level.bitmap.height;
    for (let xCoord = startCol; xCoord < endCol; xCoord++) {
        //traverse down until we find something that is a different color
        for (let yCoord = startRow; yCoord < level.bitmap.height; yCoord++) {
            //the second we find the min here we can break and check next col over
            if (level.getPixelColor(xCoord, yCoord) != SPIKE_COLOR) {
                //we found the width of this block
                endRow = Math.min(endRow, yCoord);
                // console.log("New end row: ", endRow);
                break;
            }
        }
    }
    let minHeight = endRow - startRow;

    //having found this min height we need to fill in those pixels with junk so we dont catch them again
    // console.log(minWidth, minHeight);
    for (let i = startRow; i < endRow; i++) {
        for (let j = startCol; j < endCol; j++) {
            level.setPixelColor(0x000000, j, i);
        }
    }
    //add the ground tile command to the command array
    levelcommands.push(
        `gameEngine.addEntity(new Spike (gameEngine,${startCol}, ${
            startRow - level.bitmap.height
        }, ${minWidth}, ${minHeight}, 0));`
    );
};
//facing right
const generateSpikeTileRight = (level, startCol, startRow) => {
    //we know thatthis is a rectanglinte so it will be equaly wide everywhere
    //find width of this ground tile
    console.log('Generating Spike Facing Right...');
    // console.log("Starting at: ", startCol, " " + startRow);
    let endCol = level.bitmap.width;
    //this is treated as x coord ycoord from top left
    for (let xCoord = startCol; xCoord < level.bitmap.width; xCoord++) {
        if (level.getPixelColor(xCoord, startRow) != SPIKE_RIGHT_COLOR) {
            //we found the width of this block
            // console.log("Found diff color")
            endCol = xCoord;
            break;
        }
    }
    //this is how wide our tile will be
    // console.log("end at col " + endCol)

    let minWidth = endCol - startCol;

    //now we need to find the shortest part of this block to find where to section it off
    let endRow = level.bitmap.height;
    for (let xCoord = startCol; xCoord < endCol; xCoord++) {
        //traverse down until we find something that is a different color
        for (let yCoord = startRow; yCoord < level.bitmap.height; yCoord++) {
            //the second we find the min here we can break and check next col over
            if (level.getPixelColor(xCoord, yCoord) != SPIKE_RIGHT_COLOR) {
                //we found the width of this block
                endRow = Math.min(endRow, yCoord);
                // console.log("New end row: ", endRow);
                break;
            }
        }
    }
    let minHeight = endRow - startRow;

    //having found this min height we need to fill in those pixels with junk so we dont catch them again
    // console.log(minWidth, minHeight);
    for (let i = startRow; i < endRow; i++) {
        for (let j = startCol; j < endCol; j++) {
            level.setPixelColor(0x000000, j, i);
        }
    }
    //add the ground tile command to the command array
    levelcommands.push(
        `gameEngine.addEntity(new Spike (gameEngine,${startCol}, ${
            startRow - level.bitmap.height
        }, ${minWidth}, ${minHeight}, 1));`
    );
};
//facing Down
const generateSpikeTileDown = (level, startCol, startRow) => {
    //we know thatthis is a rectanglinte aaso it will be equaly wide everywhere
    //find width of this ground tile
    console.log('Generating Spike Facing Down...');
    // console.log("Starting at: ", startCol, " " + startRow);
    let endCol = level.bitmap.width;
    //this is treated as x coord ycoord from top left
    for (let xCoord = startCol; xCoord < level.bitmap.width; xCoord++) {
        if (level.getPixelColor(xCoord, startRow) != SPIKE_DOWN_COLOR) {
            //we found the width of this block
            // console.log("Found diff color")
            endCol = xCoord;
            break;
        }
    }
    //this is how wide our tile will be
    // console.log("end at col " + endCol)

    let minWidth = endCol - startCol;

    //now we need to find the shortest part of this block to find where to section it off
    let endRow = level.bitmap.height;
    for (let xCoord = startCol; xCoord < endCol; xCoord++) {
        //traverse down until we find something that is a different color
        for (let yCoord = startRow; yCoord < level.bitmap.height; yCoord++) {
            //the second we find the min here we can break and check next col over
            if (level.getPixelColor(xCoord, yCoord) != SPIKE_DOWN_COLOR) {
                //we found the width of this block
                endRow = Math.min(endRow, yCoord);
                // console.log("New end row: ", endRow);
                break;
            }
        }
    }
    let minHeight = endRow - startRow;

    //having found this min height we need to fill in those pixels with junk so we dont catch them again
    // console.log(minWidth, minHeight);
    for (let i = startRow; i < endRow; i++) {
        for (let j = startCol; j < endCol; j++) {
            level.setPixelColor(0x000000, j, i);
        }
    }
    //add the ground tile command to the command array
    levelcommands.push(
        `gameEngine.addEntity(new Spike (gameEngine,${startCol}, ${
            startRow - level.bitmap.height
        }, ${minWidth}, ${minHeight}, 2));`
    );
};

//facing lef t
const generateSpikeTileLeft = (level, startCol, startRow) => {
    //we know thatthis is a rectanglinte so it will be equaly wide everywhere
    //find width of this ground tile
    console.log('Generating Spike Facing Left...');
    // console.log("Starting at: ", startCol, " " + startRow);
    let endCol = level.bitmap.width;
    //this is treated as x coord ycoord from top left
    for (let xCoord = startCol; xCoord < level.bitmap.width; xCoord++) {
        if (level.getPixelColor(xCoord, startRow) != SPIKE_LEFT_COLOR) {
            //we found the width of this block
            // console.log("Found diff color")
            endCol = xCoord;
            break;
        }
    }
    //this is how wide our tile will be
    // console.log("end at col " + endCol)

    let minWidth = endCol - startCol;

    //now we need to find the shortest part of this block to find where to section it off
    let endRow = level.bitmap.height;
    for (let xCoord = startCol; xCoord < endCol; xCoord++) {
        //traverse down until we find something that is a different color
        for (let yCoord = startRow; yCoord < level.bitmap.height; yCoord++) {
            //the second we find the min here we can break and check next col over
            if (level.getPixelColor(xCoord, yCoord) != SPIKE_LEFT_COLOR) {
                //we found the width of this block
                endRow = Math.min(endRow, yCoord);
                // console.log("New end row: ", endRow);
                break;
            }
        }
    }
    let minHeight = endRow - startRow;

    //having found this min height we need to fill in those pixels with junk so we dont catch them again
    // console.log(minWidth, minHeight);
    for (let i = startRow; i < endRow; i++) {
        for (let j = startCol; j < endCol; j++) {
            level.setPixelColor(0x000000, j, i);
        }
    }
    //add the ground tile command to the command array
    levelcommands.push(
        `gameEngine.addEntity(new Spike (gameEngine,${startCol}, ${
            startRow - level.bitmap.height
        }, ${minWidth}, ${minHeight}, 3));`
    );
};
