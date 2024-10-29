const para = document.querySelector("p");
let count = 0;

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

const balls = [];
const initVelocity = 7;
var id = 0;

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}

// function to generate random RGB color value

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

class Ball {
  constructor(x, y, velX, velY, color, size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;

    this.color = color;
    this.size = size;
    this.id = id;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillText("click: +ball", canvas.width / 2, canvas.height / 2.5);
    ctx.fillText("W: +ball", canvas.width / 2, canvas.height / 2.25);
    ctx.fillText("S: -ball", canvas.width / 2, canvas.height / 2);
    ctx.fillText('" ": reset', canvas.width / 2, canvas.height / 1.8);
    ctx.fillStyle = "black";
    ctx.fillText(this.id, this.x, this.y);
  }

  update() {
    //wall bounce code
    if (this.x + this.size >= width) {
      this.velX = -this.velX;
      this.x = width - this.size;
    }

    if (this.x - this.size <= 0) {
      this.velX = -this.velX;
      this.x = this.size;
    }

    if (this.y + this.size >= height) {
      this.velY = -this.velY;
      this.y = height - this.size;
    }

    if (this.y - this.size <= 0) {
      this.velY = -this.velY;
      this.y = this.size;
    }

    this.x += this.velX;
    this.y += this.velY;
  }

  collide() {
    for (let i = this.id + 1; i < balls.length; i++) {
      let dx = balls[i].x - this.x;
      let dy = balls[i].y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      let minDist = balls[i].size + this.size;
      if (distance < minDist) {
        let angle = Math.atan2(dy, dx);
        let targetX = this.x - balls[i].x + Math.cos(angle) * minDist;
        let targetY = this.y - balls[i].y + Math.sin(angle) * minDist;
        this.velX -= targetX;
        this.velY -= targetY;
        balls[i].velX += targetX;
        balls[i].velY += targetY;
        // console.log(`${balls[i].id} & ${this.id}`);
      }
    }
  }
}

//initializes balls in the balls array
//and calls the main loop at the end
function init() {
  ctx.font = "40px Comic Sans MS";
  ctx.textAlign = "center";
  ctx.strokeStyle = "white";
  //Add mouse events
  canvas.addEventListener("mousedown", (event) => {
    let adjust = canvas.getBoundingClientRect();
    let pos = {
      x: event.clientX - adjust.left,
      y: event.clientY - adjust.top,
    };
    const size = random(75, 125);
    const newBall = new Ball(
      pos.x,
      pos.y,
      random(-initVelocity, initVelocity),
      random(-initVelocity, initVelocity),
      randomRGB(),
      size,
      id
    );
    id++;
    count++;
    balls.push(newBall);
    console.log(`${pos.x},${pos.y}`);
  });
  document.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "w":
        const size = random(75, 125);
        const newBall = new Ball(
          random(0 + size, width - size),
          random(0 + size, height - size),
          random(-initVelocity, initVelocity),
          random(-initVelocity, initVelocity),
          randomRGB(),
          size,
          id
        );
        id++;
        count++;
        balls.push(newBall);
        break;
      case "s":
        if (balls.length > 0) {
          balls.pop();
          id--;
        }
        break;
      case " ":
        for (let ball of balls) {
          ball.velX = random(-initVelocity, initVelocity);
          ball.velY = random(-initVelocity, initVelocity);
        }
        break;
    }
  });
  loop();
}

function loop() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);

  for (const ball of balls) {
    ball.draw();
    ball.collide();
    ball.update();
  }
  if (balls.length === 0) ctx.strokeText("Try Clicking", 110, 30);
  para.textContent = "Ball count: " + count;

  requestAnimationFrame(loop);
}

init();