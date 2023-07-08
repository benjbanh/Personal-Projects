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
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
    }
    highlight() {
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
    }

    //determines distance between point and line
    isIntersecting(x, y, range) {
        // circleX, circleY, radius, lineX1, lineY1, lineX2, lineY2) {
        const A = this.y2 - this.y1;
        const B = this.x1 - this.x2;
        const C = this.x2 * this.y1 - this.x1 * this.y2;

        const numerator = Math.abs(A * x + B * y + C);
        const denominator = Math.sqrt(A * A + B * B);
        const distance = numerator / denominator;

        return distance <= range;
    }
}
