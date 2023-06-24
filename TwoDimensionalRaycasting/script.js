const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight - 32);

const walls = [];
let particle;

function init() {
  //eventListeners
  canvas.addEventListener("mousemove", onMouseMove);

  //stroke and fill style
  ctx.fillStyle = "rgb(0,0,0)";
  ctx.strokeStyle = "rgb(255,255,255)";
  ctx.lineWidth = 2;

  randomizeWalls();
  // walls.push(new Boundary(0, 0, width, height));
  particle = new Particle();
  particle.show();
  particle.detect(walls);
}

class Boundary {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.show();
  }

  show() {
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.stroke();
  }
}

class Ray {
  constructor(x1, y1, angle) {
    this.x1 = x1;
    this.y1 = y1;
    this.angle = angle;

    this.x2 = x1 + Math.cos(angle * (Math.PI / 180));
    this.y2 = y1 + Math.sin(angle * (Math.PI / 180));
    this.show();
  }
  show() {
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.stroke();
  }
  updatePos(x, y) {
    this.x1 = x;
    this.y1 = y;

    this.x2 = x + Math.cos(this.angle * (Math.PI / 180));
    this.y2 = y + Math.sin(this.angle * (Math.PI / 180));
  }

  //determines if a ray is intersecting with a boundary
  cast(wall) {
    const x1 = wall.x1;
    const y1 = wall.y1;
    const x2 = wall.x2;
    const y2 = wall.y2;

    const x3 = this.x1;
    const y3 = this.y1;
    const x4 = this.x2;
    const y4 = this.y2;

    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    //returns 0 if parallel
    if (den == 0) {
      return;
    }

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
    if (t > 0 && t < 1 && u > 0) {
      return {
        x: x1 + t * (x2 - x1),
        y: y1 + t * (y2 - y1),
      };
    } else {
      return;
    }
  }
}

class Particle {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.rays = [];
    this.angleOffset = 1;

    for (let i = 0; i < 360; i += 1) {
      this.rays.push(new Ray(this.x, this.y, i));
    }
  }
  show() {
    ctx.beginPath();
    ctx.ellipse(this.x, this.y, 5, 5, 0, 0, 2 * Math.PI);
    ctx.stroke();
    for (let ray of this.rays) {
      ray.show();
    }
  }
  detect() {
    for (let i = 0; i < this.rays.length; i++) {
      const ray = this.rays[i];
      let closest = null;
      let record = Infinity;
      for (let wall of walls) {
        const point = ray.cast(wall);
        //calculate euclidian distance between particle and point
        if (point) {
          let x1 = Math.min(this.x, point.x);
          let x2 = Math.max(this.x, point.x);
          let y1 = Math.min(this.y, point.y);
          let y2 = Math.max(this.y, point.y);
          const dist = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
          //finds closest wall
          if (dist < record) {
            record = dist;
            closest = point;
          }
        }
      }
      if (closest) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(closest.x, closest.y);
        ctx.stroke();
      }
    }
  }

  update(x, y, angleOffset) {
    if (this.angleOffset != angleOffset) {
      this.rays = [];
      for (let i = 0; i < 360; i += angleOffset) {
        this.rays.push(new Ray(x, y, i));
      }
      this.angleOffset = angleOffset;
    } else {
      this.x = x;
      this.y = y;
      for (let ray of this.rays) {
        ray.updatePos(x, y);
      }
    }
  }
}

function random(max) {
  const num = Math.floor(Math.random() * (max + 1));
  return num;
}

function randomizeWalls() {
  for (let i = 0; i < 5; i++) {
    walls[i] = new Boundary(
      random(width),
      random(height),
      random(width),
      random(height)
    );
  }
  walls.push(new Boundary(0, 0, width, 0));
  walls.push(new Boundary(width, 0, width, height));
  walls.push(new Boundary(width, height, 0, height));
  walls.push(new Boundary(0, height, 0, 0));
}

function onMouseMove(e) {
  ctx.fillRect(0, 0, width, height);
  let pos = getMousePos(e);
  let angleOffset = parseInt(document.getElementById("myRange").value);
  //render boundaries
  for (let wall of walls) {
    wall.show();
  }
  particle.update(pos.x, pos.y, angleOffset);
  particle.show();
  particle.detect(walls);
}

function getMousePos(e) {
  let pos = canvas.getBoundingClientRect();
  // console.log(`x:${e.clientX - pos.left}, y:${e.clientY - pos.top}`);
  return {
    x: e.clientX - pos.left,
    y: e.clientY - pos.top,
  };
}

console.log("run");
init();
