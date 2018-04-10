// setup canvas

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var WIDTH = canvas.width = window.innerWidth;
var HEIGHT = canvas.height = window.innerHeight;

ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
ctx.fillRect(0, 0, WIDTH, HEIGHT);

// function to generate random number
function random(min, max) {
  var num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}

function Ball(x, y, vx, vy, color, r) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.color = color;
  this.r = r;
}

Ball.prototype.draw = function () {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
  ctx.fill();
};

function EvilBall(x, y, vx, vy, color, r) {
  Ball.call(this, x, y, vx, vy, color, r);
}

EvilBall.prototype = Object.create(Ball.prototype);

var MIN_R = 10;
var MAX_R = 30;
var NUM_BALLS = prompt("Number of balls:", 20);
var MAX_SPEED = 20;
var EVIL_BALL_SPEED = MAX_SPEED;
var balls = [];
var min_r = MAX_R;

function create_balls(num) {
  for (let i = 0; i < num; i++) {
    var ball = new Ball(
      random(MAX_R, WIDTH - MAX_R),
      random(MAX_R, HEIGHT - MAX_R),
      random(-MAX_SPEED, MAX_SPEED),
      random(-MAX_SPEED, MAX_SPEED),
      "rgba(" + random(0, 255) + ", " + random(0, 255) + ", " + random(0, 255) + ", " + random(0, 255) + ")",
      random(MIN_R, MAX_R)
    );
    min_r = Math.min(min_r, ball.r)

    balls.push(ball);
  }
}

create_balls(NUM_BALLS);
var evil_ball = new EvilBall(
  random(MAX_R, WIDTH - MAX_R),
  random(MAX_R, HEIGHT - MAX_R),
  EVIL_BALL_SPEED,
  EVIL_BALL_SPEED,
  "rgba(" + random(0, 255) + ", " + random(0, 255) + ", " + random(0, 255) + ", " + random(0, 255) + ")",
  random(MIN_R, MAX_R)
);
evil_ball.r = Math.max(evil_ball.r, min_r);

function sgn(x) {
  if (x > 0) {
    return 1;
  }
  else if (x < 0) {
    return -1;
  }
  else {
    return 0;
  }
}

function closer_than(b1, b2, d) {
  return Math.hypot(b1.x - b2.x, b1.y - b2.y) <= d;
}

function check_collision() {
  for (let i = 0; i < NUM_BALLS; i++) {
    for (let j = i + 1; j < NUM_BALLS; j++) {
      var b1 = balls[i], b2 = balls[j];
      if (closer_than(b1, b2, b1.r + b2.r)) {
        if (sgn(b1.vx) != sgn(b2.vx)) {
          b1.vx = -b1.vx;
          b2.vx = -b2.vx;
        }
        if (sgn(b1.vy) != sgn(b2.vy)) {
          b1.vy = -b1.vy;
          b2.vy = -b2.vy;
        }
        
        b1.color = "rgba(" + random(0, 255) + ", " + random(0, 255) + ", " + random(0, 255) + ", " + random(0, 255) + ")";
        b2.color = "rgba(" + random(0, 255) + ", " + random(0, 255) + ", " + random(0, 255) + ", " + random(0, 255) + ")";
      }
    }
  }
}

function check_eat(i) {
  var ball = balls[i];
  if (closer_than(ball, evil_ball, evil_ball.r)) {
    var score = document.getElementById("score");
    score.innerHTML = parseInt(score.innerHTML) + 1;

    evil_ball.r += (ball.r / 2);
    balls.splice(i, 1);
    NUM_BALLS--;
    if (NUM_BALLS == 0) {
      alert("Congratulations! You win!!!")
    }
  }
}

function update() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  check_collision();
  
  for (let i = 0; i < NUM_BALLS; i++) {
    var ball = balls[i];
    check_eat(i);
    
    if (ball.x - ball.r < 0 || ball.x + ball.r > WIDTH) {
      ball.vx = -ball.vx;
    }
    if (ball.y - ball.r < 0 || ball.y + ball.r > HEIGHT) {
      ball.vy = -ball.vy;
    }
    
    ball.x += ball.vx;
    ball.y += ball.vy;
    
    ball.draw();
  }
  
  evil_ball.color = "rgba(" + random(0, 255) + ", " + random(0, 255) + ", " + random(0, 255) + ", " + random(0, 255) + ")";
  evil_ball.draw();
}

var update_every_milliseconds = 100;
window.setInterval(update, update_every_milliseconds);


// left, up, right, down
var KEYS = [37, 38, 39, 40];
var DXS = [-1, 0, 1, 0];
var DYS = [0, -1, 0, 1];
var key_map = {};

function check_key(e) {
  key_map[e.which] = (e.type == 'keydown');
  
  if (evil_ball.x - evil_ball.r < 0) {
    evil_ball.x = WIDTH - evil_ball.r;
  }
  else if (evil_ball.x + evil_ball.r > WIDTH) {
    evil_ball.x = evil_ball.r;
  }
  
  if (evil_ball.y - evil_ball.r < 0) {
    evil_ball.y = HEIGHT - evil_ball.r;
  }
  else if (evil_ball.y + evil_ball.r > HEIGHT) {
    evil_ball.y = evil_ball.r;
  }

  for (let i = 0; i < KEYS.length; i++) {
    if (key_map[KEYS[i]]) {
      evil_ball.x += DXS[i] * EVIL_BALL_SPEED;
      evil_ball.y += DYS[i] * EVIL_BALL_SPEED;
    }
  }
}

document.onkeydown = check_key;
document.onkeyup = check_key;
