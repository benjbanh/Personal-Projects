const canvas2D = document.getElementById("canvas-2d");
const context2D = canvas2D.getContext("2d");
const width2D = canvas2D.width;
const height2D = canvas2D.height;
const canvas3D = document.getElementById("canvas-3d");
const context3D = canvas3D.getContext("2d");
const width3D = canvas3D.width;
const height3D = canvas3D.height;
const particle = new Particle(width2D / 2, height2D / 2);
const rayCount = 200; // Number of rays to cast
const rayLength = 500; // Length of the rays
const fov = Math.PI / 6; // Field of view    //Math.PI * x
const boundaries = [
    new Boundary(0, 0, width2D, 0),
    new Boundary(width2D, 0, width2D, height2D),
    new Boundary(width2D, height2D, 0, height2D),
    new Boundary(0, height2D, 0, 0),
    // Add more boundaries as needed
];
function render2D() {
    // Clear the canvas
    context2D.clearRect(0, 0, width2D, height2D);
    // Draw boundaries in 2D
    boundaries.forEach((boundary) => {
        boundary.draw2D(context2D);
    });
    // Cast rays from the particle
    for (let i = 0; i < rayCount; i++) {
        const rayAngle = particle.angle - fov / 2 + (i / rayCount) * fov;
        const rayEndX = particle.x + Math.cos(rayAngle) * rayLength;
        const rayEndY = particle.y + Math.sin(rayAngle) * rayLength;
        // Check for ray intersection with boundaries
        let closestIntersection = null;
        let closestDistance = Infinity;
        for (const boundary of boundaries) {
            const intersection = boundary.intersect(particle, rayAngle);
            if (intersection && intersection.distance < closestDistance) {
                closestIntersection = intersection;
                closestDistance = intersection.distance;
            }
        }
        // Draw the 2D perspective
        context2D.beginPath();
        context2D.moveTo(particle.x, particle.y);
        if (closestIntersection) {
            context2D.lineTo(closestIntersection.x, closestIntersection.y);
            context2D.strokeStyle = "white";
        } else {
            context2D.lineTo(rayEndX, rayEndY);
            context2D.strokeStyle = "rgba(255, 255, 255, 0.2)";
        }
        context2D.stroke();
    }
    // Draw the particle
    context2D.beginPath();
    context2D.arc(particle.x, particle.y, 5, 0, Math.PI * 2);
    context2D.fillStyle = "white";
    context2D.fill();
}
function render3D() {
    // Clear the canvas
    context3D.clearRect(0, 0, width3D, height3D);
    // Cast rays from the particle
    for (let i = 0; i < rayCount; i++) {
        const rayAngle = particle.angle - fov / 2 + (i / rayCount) * fov;
        const rayEndX = particle.x + Math.cos(rayAngle) * rayLength;
        const rayEndY = particle.y + Math.sin(rayAngle) * rayLength;
        // Check for ray intersection with boundaries
        let closestIntersection = null;
        let closestDistance = Infinity;
        for (const boundary of boundaries) {
            const intersection = boundary.intersect(particle, rayAngle);
            if (intersection && intersection.distance < closestDistance) {
                closestIntersection = intersection;
                closestDistance = intersection.distance;
            }
        }
        // Calculate the height of the wall based on the distance
        const wallHeight = Math.min(
            height3D /
                (closestDistance * Math.cos(rayAngle - particle.angle)),
            height3D
        );
        // Calculate the top and bottom positions of the wall
        const wallTop = (height3D - wallHeight) / 2;
        const wallBottom = wallTop + wallHeight;
        // Calculate the shade of the wall based on the distance
        const shade = 1 - closestDistance / rayLength;
        const wallColor = `rgba(255, 255, 255, ${shade})`;
        // Draw the wall column
        context3D.fillStyle = wallColor;
        context3D.fillRect(
            i * (width3D / rayCount),
            wallTop,
            width3D / rayCount,
            wallHeight
        );
    }
}
window.onload = function () {
    setInterval(() => {
        render2D();
        // shade3D();
        render3D();
    }, 16); // Call the render functions every 16 milliseconds (60 FPS)
};
