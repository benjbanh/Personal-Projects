class Particle {
    constructor(x, y, angle, view) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.dx = this.cos(angle);
        this.dy = this.sin(angle);
        this.view = view;
        this.maxW = width / 2;
        this.maxH = height / 2;
        this.rays = [];
    }

    cos(angle) {
        return Math.cos((angle * Math.PI) / 180);
    }
    sin(angle) {
        return Math.sin((angle * Math.PI) / 180);
    }
    // updatePos(x, y) {
    //     this.x = x;
    //     this.y = y;
    //     // console.log(`particle.updatePos(${x},${y})`);
    // }
    show2D() {
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        for (let ray of this.rays) {
            ctx.strokeStyle = ray.d;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(ray.x, ray.y);
            ctx.stroke();
        }
    }
    // show3D() {
    //     let xind = 0;
    //     let step = this.maxw / this.rays.length;

    //     for (let ray of this.rays) {
    //         let dist = ray.d;
    //         let len = (10 * this.maxh) / dist;
    //         let top = (this.maxh - len) / 2;
    //         // function map(x, in_min, in_max, out_min, out_max)：
    //         //      return (((x - in_min) * (out_max - out_min)) / (in_max - in_min) +out_min);

    //         let map = ((len - 10) * (100 - 30)) / (this.maxh * 2 - 100) + 30;
    //         // ctx.rect(0, 100, map);
    //         ctx.rect(xind, top, 3, len);
    //         xind += step;
    //     }
    // }
    rotate(angle) {
        this.angle += angle;
        this.dx = this.cos(this.angle);
        this.dy = this.sin(this.angle);
    }
    move(velocity) {
        let x = this.x + velocity * this.dx;
        let y = this.y + velocity * this.dy;

        //detect if particle is colliding with the wall
        let cx = false;
        let cy = false;
        let close = Math.abs(velocity);
        for (let wall of walls) {
            if (wall.isIntersecting(x, this.y, close)) cx = true;
            if (wall.isIntersecting(this.x, y, close)) cy = true;
        }
        if (!cx) this.x = x;
        if (!cy) this.y = y;
    }
    detect(rayPerDegree) {
        this.rays = [];
        const scene = [];
        for (let i = 0; i < rayPerDegree * this.view; i++) {
            let ang = this.angle + i / rayPerDegree - this.view / rayPerDegree;
            // let ang = this.angle + i / rayPerDegree - this.view;

            let x1 = this.x;
            let y1 = this.y;
            let x2 = this.x + this.cos(ang);
            let y2 = this.y + this.sin(ang);
            let maxDist = Infinity;
            let wx = width;
            let wy = height;

            for (let wall of walls) {
                let ray = this.createRay(x1, y1, x2, y2, wall);
                //calculate euclidian distance between particle and point
                if (ray != null) {
                    let x1 = Math.min(this.x, ray.x);
                    let x2 = Math.max(this.x, ray.x);
                    let y1 = Math.min(this.y, ray.y);
                    let y2 = Math.max(this.y, ray.y);
                    const dist = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
                    //finds closest wall
                    if (dist < maxDist) {
                        maxDist = dist;
                        wx = ray.x;
                        wy = ray.y;
                    }
                }
            }
            this.rays.push({ x: wx, y: wy, d: maxDist });
            scene[i] = maxDist;
        }
        return scene;
    }
    //determines if a ray is intersecting with a boundary
    createRay(ax, ay, bx, by, wall) {
        const x1 = wall.x1;
        const y1 = wall.y1;
        const x2 = wall.x2;
        const y2 = wall.y2;

        const x3 = ax;
        const y3 = ay;
        const x4 = bx;
        const y4 = by;

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
