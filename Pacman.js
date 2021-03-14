
let gameBoard = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,9,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,9,1],
    [1,8,1,1,1,1,8,1,1,1,1,1,1,8,1,1,1,1,8,1],
    [1,8,8,8,8,1,8,1,8,8,8,8,1,8,1,8,8,8,8,1],
    [1,8,1,1,8,1,8,1,8,1,1,8,1,8,1,8,1,1,8,1],
    [1,8,1,1,8,8,8,8,8,8,8,8,8,8,8,8,1,1,8,1],
    [1,8,1,1,8,1,1,1,1,1,1,1,1,1,1,8,1,1,8,1],
    [1,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,1],
    [1,1,1,8,8,1,8,1,1,8,8,1,1,8,1,8,8,1,1,1],
    [0,0,0,8,1,1,8,1,8,8,8,8,1,8,1,1,8,0,0,0],
    [0,0,0,8,1,1,8,1,8,8,8,8,1,8,1,1,8,0,0,0],
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
let gameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 600;
        this.canvas.height = 600;
        this.canvas.id = "canvas";
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 150);
        this.canvas.addEventListener("contextmenu", event => event.preventDefault());
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

class Pacman {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.dir = 's';
    }

    setDir(direction){
        /* tried to make it more like pacman movement this sorta works but is not forgiving enough
        if(this.checkAdjacent(direction)){
            this.dir = direction;
        }*/
        this.dir = direction;
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
                break;
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

    update() {
        //wrap screen
        if(this.x < 0) {
            this.x = gameArea.canvas.width/30;
        } else if(this.x > gameArea.canvas.width/30) {
            this.x = 0;
        }

        switch(this.dir){
            case 's':
                //still
                break;
            case 'u':
                //up
                if(this.checkAdjacent('u')) {
                    this.y -= 1;
                }
                break;
            case 'd':
                //down
                if(this.checkAdjacent('d')) {
                    this.y += 1;
                }
                break;
            case 'l':
                //left
                if(this.checkAdjacent('l')) {
                    this.x -= 1;
                }
                break;
            case 'r':
                //right
                if(this.checkAdjacent('r')) {
                    this.x += 1;
                }
                break; 
        }
    }
}

function drawScreen(player) {
    ctx = gameArea.context;

    //draw board
    for(let i = 0; i< gameBoard.length; i++) {
        for(let j = 0; j < gameBoard.length; j++) {
            
            /* if(gameBoard[i][j] == 1) {
                ctx.fillStyle = 'black';
                ctx.fillRect(j*30, i*30, 30, 30)
            } */
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
    ctx.fillStyle = 'yellow';
    ctx.fillRect(player.x*30, player.y*30, 30,30)

}

let player = new Pacman(1,1);
function updateGameArea() {
    gameArea.clear();
    document.onkeydown = function(e){player.checkKey(e)};
    player.update();
    drawScreen(player);

}

