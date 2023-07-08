const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);
const sceneW = 400;
const sceneH = 400;

const x = sceneW / 10;
const y = sceneH / 10;
const angle = 0;
let fov = 30;
const velocity = 10;
const turnSpeed = 10;
const rayPerDegree = 2;

const walls = [];
const particle = new Particle(x, y, angle, fov);

function init() {
    randomizeWalls();
    render2D();
    console.log("loop");
    loop();
}
function render2D() {
    //eventListeners

    //Particle follow mouse
    // canvas.addEventListener("mousemove", onMouseMove);

    //Particle moved using arrow keys
    document.addEventListener("keydown", (event) => {
        switch (event.key) {
            case "ArrowUp":
                particle.move(velocity);
                // console.log(`${particle.x},${particle.y}`);
                break;
            case "ArrowDown":
                particle.move(-velocity);
                // console.log(`${particle.x},${particle.y}`);
                break;
            case "ArrowLeft":
                particle.rotate(-turnSpeed);
                // console.log(particle.angle);
                break;
            case "ArrowRight":
                particle.rotate(turnSpeed);
                // console.log(particle.angle);
                break;
        }
    });
}

function random(max) {
    const num = Math.floor(Math.random() * (max + 1));
    return num;
}

function randomizeWalls() {
    // for (let i = 0; i < 2; i++) {
    //     walls.push(
    //         new Boundary(
    //             random(sceneW),
    //             random(height),
    //             random(sceneW),
    //             random(height)
    //         )
    //     );
    // }
    //adds edges of screen
    walls.push(new Boundary(0, 0, sceneW, 0));
    walls.push(new Boundary(sceneW, 0, sceneW, height));
    walls.push(new Boundary(sceneW, height, 0, height));
    walls.push(new Boundary(0, height, 0, 0));
}

function onMouseMove(e) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, sceneW, height);
    let pos = getMousePos(e);
    //render boundaries
    for (let wall of walls) {
        wall.show();
    }
    particle.updatePos(pos.x, pos.y);
    particle.show2D();
    particle.detect();
}

function getMousePos(e) {
    let pos = canvas.getBoundingClientRect();
    // console.log(`x:${e.clientX - pos.left}, y:${e.clientY - pos.top}`);
    return {
        x: e.clientX - pos.left,
        y: e.clientY - pos.top,
    };
}

function loop() {
    //stroke and fill style
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.strokeStyle = "rgb(255,255,255)";
    ctx.lineWidth = 2;
    //clears canvas
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, sceneW, height);
    //render 2D
    for (let wall of walls) {
        wall.show();
    }
    particle.show2D();

    //render 3D and rays
    const scene = particle.detect(rayPerDegree);
    const w = sceneW / scene.length;

    for (let i = 0; i < scene.length; i++) {
        const h = ((scene[i] - 0) * (0 - sceneH)) / (sceneW - 0) + sceneH;
        ctx.fillStyle = "black";
        ctx.fillStyle = "yellow";
        ctx.rect(sceneW, 0, sceneW * 2, sceneH);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "blue";
        ctx.rect(i * w + sceneW, sceneH / 2, w + sceneW, h);
        ctx.fill();
        ctx.stroke();
    }
    // particle.show3D();
    requestAnimationFrame(loop);
}

console.log("run");
init();
