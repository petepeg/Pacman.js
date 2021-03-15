
let gameBoardOne = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,9,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,9,1],
    [1,8,1,1,1,1,8,1,1,1,1,1,1,8,1,1,1,1,8,1],
    [1,8,8,8,8,1,8,1,8,8,8,8,1,8,1,8,8,8,8,1],
    [1,8,1,1,8,1,8,1,8,1,1,8,1,8,1,8,1,1,8,1],
    [1,8,1,1,8,8,8,8,8,8,8,8,8,8,8,8,1,1,8,1],
    [1,8,1,1,8,1,1,1,1,1,1,1,1,1,1,8,1,1,8,1],
    [1,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,1],
    [1,1,1,8,8,1,8,1,1,0,0,1,1,8,1,8,8,1,1,1],
    [0,0,0,8,1,1,8,1,0,0,0,0,1,8,1,1,8,0,0,0],
    [0,0,0,8,1,1,8,1,0,0,0,0,1,8,1,1,8,0,0,0],
    [1,1,1,8,8,1,8,1,1,1,1,1,1,8,1,8,8,1,1,1],
    [1,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,1],
    [1,8,1,1,8,1,1,1,1,1,1,1,1,1,1,8,1,1,8,1],
    [1,8,1,1,8,8,8,8,8,8,8,8,8,8,8,8,1,1,8,1],
    [1,8,1,1,8,1,8,1,8,1,1,8,1,8,1,8,1,1,8,1],
    [1,8,8,8,8,1,8,1,8,8,8,8,1,8,1,8,8,8,8,1],
    [1,8,1,1,1,1,8,1,1,1,1,1,1,8,1,1,1,1,8,1],
    [1,9,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,9,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
]
let gameBoard = JSON.parse(JSON.stringify(gameBoardOne)); // Deep clone
let gameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 600;
        this.canvas.height = 600;
        this.canvas.id = "canvas";
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        // game speed
        this.interval = setInterval(updateGameArea, 250);
        this.canvas.addEventListener("contextmenu", event => event.preventDefault());
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

let clock = 0;

class Pacman {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.dir = 's';
        this.score = 0;
        this.super = false;
        this.timeStart = 0;
        this.lives = 3;
    }

    setDir(direction){
        /* tried to make it more like pacman movement this sorta works but is not forgiving enough
        if(this.checkAdjacent(direction)){
            this.dir = direction;
        }*/
        this.dir = direction;
    }

    setScore(scoreInc) {
        this.score += scoreInc;
    }

    checkAdjacent(direction) {
        switch(direction){
            case 's':
                return true;
            case 'u':
                //up
                if(gameBoard[this.y-1][this.x] == 1) {
                    break;
                } else {
                    return true;
                }
            case 'd':
                //down
                if(gameBoard[this.y+1][this.x] == 1) {
                    break;
                } else {
                    return true;
                }
            case 'l':
                //left
                if(gameBoard[this.y][this.x-1] == 1) {
                    break;
                } else {
                    return true;
                }
            case 'r':
                //right
                if(gameBoard[this.y][this.x+1] == 1) {
                    break;
                } else {
                    return true;
                }
        }
        return false;
    }

    checkKey(e) {

        e = e || window.event;

        if (e.keyCode == '38') {
            // up arrow
            console.log("Up");
            console.log(this);
            this.setDir('u');
        }
        else if (e.keyCode == '40') {
            // down arrow
            console.log("Down");
            this.setDir('d');
        }
        else if (e.keyCode == '37') {
            // left arrow
            console.log("Left");
            this.setDir('l');
        }
        else if (e.keyCode == '39') {
            // right arrow
            console.log("Right");
            this.setDir('r');
        }

    }

    die() {
        this.lives -= 1;
        this.x = 1;
        this.y = 9;
        this.dir = 's';
    }

    pixelCheck(direction) {
        let ctx = gameArea.context
        let pixdata = []
        switch(direction) {
            case 'u':
                pixdata = ctx.getImageData(this.x*30, (this.y*30)-1, 30, 1);
                break;
            case 'd':
                pixdata = ctx.getImageData(this.x*30, (this.y*30)+30, 30, 1);
                break;
            case 'l':
                pixdata = ctx.getImageData((this.x*30)-1, this.y*30, 1, 30);
                break;
            case 'r':
                pixdata = ctx.getImageData((this.x*30)+30, this.y*30, 1, 30);
                break;
        }
        
        return pixdata;
    }

    pixelWallCollision(direction) {
        // Checks pixel data for a wall
        let pixelStrip = this.pixelCheck(direction);
        for(let i = 0; i < pixelStrip.data.length-4; i +=4) {
            for(let j = 0; j < 4; j++) { // check for black pixel
                if( j < 3 && pixelStrip.data[i+j] != 0 ) {
                        return false
                } else if(pixelStrip.data[i+j] == 255) {
                    return true;
                }
            }
        }
        return false
    }

    update() {
        console.log('up',this.pixelWallCollision('u'))
        console.log('down',this.pixelWallCollision('d'))
        console.log('left',this.pixelWallCollision('l'))
        console.log('right',this.pixelWallCollision('r'))
        //wrap screen
        if(this.x < 0) {
            this.x = gameArea.canvas.width/30;
        } else if(this.x > gameArea.canvas.width/30) {
            this.x = 0;
        }
        //movement
        switch(this.dir){
            case 's':
                //still
                break;
            case 'u':
                //up
                if(!this.pixelWallCollision('u')) {
                    this.y -= 1;
                }
                break;
            case 'd':
                //down
                if(!this.pixelWallCollision('d')) {
                    this.y += 1;
                }
                break;
            case 'l':
                //left
                if(!this.pixelWallCollision('l')) {
                    this.x -= 1;
                }
                break;
            case 'r':
                //right
                if(!this.pixelWallCollision('r')) {
                    this.x += 1;
                }
                break; 
        }
        // pellets and points
        switch(gameBoard[this.y][this.x]) {
            case 8:
                this.setScore(1);
                gameBoard[this.y][this.x] = 0;
                break;
            case 9:
                this.super = true;
                this.timeStart = clock;
                gameBoard[this.y][this.x] = 0;
                console.log("super start!")
                this.setScore(10);
        }
        // super state
        if(this.super && clock - this.timeStart > 50 ) {
                this.super = false;
                console.log("super over")
        }
    }
}

class Ghost {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.alive = true;
        this.deathClock = 0;
    }

    checkAdjacent(direction) {
        switch(direction){
            case 'u':
                //up
                if(gameBoard[this.y-1][this.x] == 1) {
                    break;
                } else {
                    return true;
                }
            case 'd':
                //down
                if(gameBoard[this.y+1][this.x] == 1) {
                    break;
                } else {
                    return true;
                }
            case 'l':
                //left
                if(gameBoard[this.y][this.x-1] == 1) {
                    break;
                } else {
                    return true;
                }
            case 'r':
                //right
                if(gameBoard[this.y][this.x+1] == 1) {
                    break;
                } else {
                    return true;
                }
        }
        return false;
    }

    checkForGhost(direction,ghosts) {
        for(let i = 0; i < ghosts.length; i++) {
            let ghost = ghosts[i];
            switch(direction) {
                case 'u':
                    if (this.y-1 == ghost.y && this.x == ghost.x) { return true }
                    break;
                case 'd':
                    if (this.y+1 == ghost.y && this.x == ghost.x ) { return true }
                    break;
                case 'l':
                    if (this.x-1 == ghost.x && this.y == ghost.y ) { return true }
                    break;
                case 'r':
                    if (this.x+1 == ghost.x && this.y == ghost.y ) { return true }
                    break;
                default:
                    return false;
            }
        }
        return false;
    }

    die() {
        this.alive = false;
        this.x = 9;
        this.y = 9;
        this.deathClock = clock;
    }

    update(player, ghosts) {
        if(this.alive){
            // basic follow/ run from pacman
            // needs work
            let xDiff = player.x - this.x;
            let yDiff = player.y - this.y
            
            // run away 
            if(player.super) {
                if(yDiff < 0 && this.checkAdjacent('d') && !this.checkForGhost('d', ghosts)) {
                    console.log("ghost down");
                    this.y += 1;
                } else if(yDiff > 0 && this.checkAdjacent('u') && !this.checkForGhost('u', ghosts)) {
                    console.log("ghost up");
                    this.y -= 1;
                } else if(xDiff < 0 && this.checkAdjacent('r') && !this.checkForGhost('r', ghosts)) {
                    console.log("ghost right");
                    this. x += 1;
                }else if(xDiff > 0 && this.checkAdjacent('l') && !this.checkForGhost('l', ghosts)) {
                    console.log("ghost left");
                    this. x -= 1;
                } else {
                    console.log("ghost stuck");
                }
            // run towards
            } else {
                if(yDiff > 0 && this.checkAdjacent('d') && !this.checkForGhost('d', ghosts)) {
                    console.log("ghost down");
                    this.y += 1;
                } else if(yDiff < 0 && this.checkAdjacent('u') && !this.checkForGhost('u', ghosts)) {
                    console.log("ghost up");
                    this.y -= 1;
                } else if(xDiff > 0 && this.checkAdjacent('r') && !this.checkForGhost('r', ghosts)) {
                    console.log("ghost right");
                    this. x += 1;
                }else if(xDiff < 0 && this.checkAdjacent('l') && !this.checkForGhost('l', ghosts)) {
                    console.log("ghost left");
                    this. x -= 1;
                } else {
                    console.log("ghost stuck");
                }
            }


            // check for pacman
            if (player.x == this.x && player.y == this.y) {
                if(player.super){
                    this.die();
                    player.setScore(50);
                } else {
                    player.die();
                }
            }
        } else {
            console.log("I'm dead")
            if(clock - this.deathClock > 50) {
                this.alive = true;
            }
        }

        

    }

}

function pelletCheck() {
    for(let i = 0; i < gameBoard.length; i++){
        if(gameBoard[i].includes(8)){
            return true
        }  
    }
    return false;
}

function nextLevel(player, ghosts) {
    // reset board
    gameBoard = gameBoard = JSON.parse(JSON.stringify(gameBoardOne));
    player.x = 1;
    player.y = 9;
    player.dir = 's';
    for(let i = 0; i < ghosts.length; i++) {
        ghost = ghosts[i];
        ghost.x = 8+i;
        ghost.y = 9;
    }
}

function drawScreen(player, ghosts) {
    ctx = gameArea.context;

    //draw board
    for(let i = 0; i< gameBoard.length; i++) {
        for(let j = 0; j < gameBoard.length; j++) {
            //pellets
            switch(gameBoard[i][j]){
                //walls
                case 1:
                    ctx.fillStyle = 'black';
                    ctx.fillRect(j*30, i*30, 30, 30)
                    break;
                //pellets
                case 8:
                    ctx.fillStyle = 'blue';
                    ctx.fillRect((j*30)+15, (i*30)+15, 6, 6)
                    break;
                //super pellets
                case 9:
                    ctx.fillStyle = 'red';
                    ctx.fillRect((j*30)+15, (i*30)+15, 6, 6)
                    break;
            }
        }
    }

    //draw player
    if(player.super){
        ctx.fillStyle = 'red';
    } else {
        ctx.fillStyle = 'yellow';
    }
    ctx.fillRect(player.x*30, player.y*30, 30,30);

    // draw ghosts
    let ghostColors = {
        0:'green',
        1:'purple',
        2:'pink'
    }
    for(let i = 0; i < ghosts.length; i++) {
        ghost = ghosts[i];
        ctx.fillStyle = ghostColors[i];
        ctx.fillRect(ghost.x*30, ghost.y*30, 30, 30);
    }
    
    //update clock
    clock += 1;

}

let player = new Pacman(1,9);
let ghosts = [
    new Ghost(8,9),
    new Ghost(11,9),
    new Ghost(12,9),
];

function updateGameArea() {
    document.onkeydown = function(e){player.checkKey(e)};
    
    player.update();
    for(let i = 0; i < ghosts.length; i++) {
        ghost = ghosts[i];
        ghost.update(player, ghosts);
    }
    
    gameArea.clear();
    drawScreen(player, ghosts);

    document.getElementById("player_score").innerHTML = player.score;
    document.getElementById("player_lives").innerHTML = player.lives;
    
    if(!pelletCheck()) {
        nextLevel(player, ghosts);
    }
}

