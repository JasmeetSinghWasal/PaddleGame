var ball;
var paddle;
var playingArea;
var score;

// var aWidth = 400;; //width of screen
// var aHeight = 600; //height of screen
// var paddleWidth = 0;
// var pWidth = 390; //of playing area
// var pHeight = 595; //of playing area
var aWidth;
var aHeight;
var paddleWidth;
var pWidth;
var pHeight;

var dx = 2; //speed of ball, x coordinates
var dy = 2; //speed of ball, y coordinated
var pdx = 48; //speed of paddle

var currentScore = 0;
var timer;

//initial positions
var paddleLeft = 200;
var ballLeft = 100;
var ballTop = 30;

var drag = false;
window.addEventListener('load', init);
window.addEventListener('resize', init);

function init() {
    playingArea = document.getElementById('playingArea');
    ball = document.getElementById('ball');
    paddle = document.getElementById('paddle');
    score = document.getElementById('score');

    paddleWidth = 100;

    //store your dom object in local variable whenever possible, to reduce DOm interaction in gaming, its costly
    //after all are loaded

    layoutPage();
    document.addEventListener('keydown', keyListener, false);

    playingArea.addEventListener('mousedown', mouseDown, false);
    playingArea.addEventListener('mousemove', mouseMove, false);
    playingArea.addEventListener('mouseup', mouseUp, false);

    playingArea.addEventListener('touchstart', mouseDown, false);
    playingArea.addEventListener('touchmove', mouseMove, false);
    playingArea.addEventListener('touchend', mouseUp, false);


    timer = requestAnimationFrame(start); //optimised than setInterval and setTimeout

}

function layoutPage() {
    aWidth = window.innerWidth;
    aHeight = window.innerHeight;

    pWidth = aWidth - 22;
    pHeight = aHeight - 50; // height of device used - (height and bottom of score)

    playingArea.style.width = pWidth + "px";
    playingArea.style.height = pHeight + "px";
    score.style.width = pWidth - 14 + "px";
}

//this event by default gets a key
function keyListener(e) {
    var key = e.keyCode;
    // if key pressed => left key = 37, a = 65, and paddle is not on left
    if ((key == 37 || key == 65) && paddleLeft >= 1) {
        paddleLeft -= pdx;
        if (paddleLeft < 0)
            paddleLeft = 11;

    } else if ((key == 39 || key == 68) && (paddleLeft >= 1) && paddleLeft <= (pWidth - paddleWidth)) {
        paddleLeft += pdx;
        if (paddleLeft >= (pWidth - paddleWidth))
            paddleLeft = pWidth - paddleWidth;
    }
    paddle.style.left = paddleLeft + "px";
}

//Game loop
function start() {
    render();
    detectCollision();
    diffuculty();
    if (ballTop <= (pHeight - (25 + 20))) //playingArea height + score + paddle height
    {
        timer = requestAnimationFrame(start);

    } else {
        gameOver();
    }
}

function render() {
    moveBall();
    updateScore();
}

function moveBall() {
    ballLeft += dx;
    ballTop += dy;
    ball.style.top = ballTop + "px";
    ball.style.left = ballLeft + "px";
}

function updateScore() {
    currentScore += 5;
    score.innerHTML = "Score " + currentScore;
}

function detectCollision() {
    if (collisionX())
        dx *= -1;
    if (collisionY())
        dy *= -1;
}

function collisionX() {
    //check if ball collided with left or right edge of plaing area
    //let 11px margin
    if (ballLeft < 5 || ballLeft > (pWidth - 5))
        return true;
    else
        return false;

}

function collisionY() {
    //11 is top of gaming area
    if (ballTop < 5)
        return true;

    //to check collision with paddle
    // check if ball on top of paddle and then ball between left and right of paddle
    //if (ballTop > pHeight - 33) {
    if (ballTop > (pHeight - 50)) {
        if ((ballLeft >= paddleLeft) && (ballLeft <= (paddleLeft + paddleWidth)))
            return true;
    }

    return false;
}

function diffuculty() {
    if (currentScore % 1000 == 0) {
        if (dy > 0)
            dy += 2;
        else
            dy -= 2;

    }
}

function gameOver() {
    cancelAnimationFrame(timer);
    score.innerHTML += ".......GAME OVER.....";
    score.style.backgrounColor = "red";
}

function mouseDown(e) {
    drag = true;
}

function mouseUp(e) {
    drag = false;
}

function mouseMove(e) {
    if (drag) {
        e.preventDefault();
        paddleLeft = e.clientX - 32 || e.TargetTouches[0] - 32;
        if (paddleLeft < 0)
            paddleLeft = 11;
        if (paddleLeft > (pWidth - paddleWidth))
            paddleLeft = pWidth - paddleWidth;
        paddle.style.left = paddleLeft + "px";
    }
}