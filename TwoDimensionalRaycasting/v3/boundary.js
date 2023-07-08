class Boundary {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    draw2D(context) {
        context.beginPath();
        context.moveTo(this.x1, this.y1);
        context.lineTo(this.x2, this.y2);
        context.lineWidth = 1;
        context.strokeStyle = "rgb(255, 0, 0)";
        context.stroke();
    }

    intersect(particle, rayAngle) {
        const x1 = this.x1;
        const y1 = this.y1;
        const x2 = this.x2;
        const y2 = this.y2;
        const x3 = particle.x;
        const y3 = particle.y;
        const x4 = particle.x + Math.cos(rayAngle);
        const y4 = particle.y + Math.sin(rayAngle);

        const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

        if (denominator === 0) {
            return null;
        }

        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator;

        if (t > 0 && t < 1 && u > 0) {
            const intersectionX = x1 + t * (x2 - x1);
            const intersectionY = y1 + t * (y2 - y1);
            const distance = Math.sqrt(
                Math.pow(intersectionX - x3, 2) + Math.pow(intersectionY - y3, 2)
            );
            return { x: intersectionX, y: intersectionY, distance };
        }

        return null;
    }
}
