            class Particle {
                constructor(x, y) {
                    this.x = x;
                    this.y = y;
                    this.angle = 0;
                    this.speed = 5;

                    // Bind event handlers to the current instance
                    this.handleKeyDown = this.handleKeyDown.bind(this);

                    document.addEventListener("keydown", this.handleKeyDown);
                }

                handleKeyDown(event) {
                    if (event.key === "ArrowUp") {
                        this.moveForward();
                    } else if (event.key === "ArrowDown") {
                        this.moveBackward();
                    } else if (event.key === "ArrowLeft") {
                        this.rotateLeft();
                    } else if (event.key === "ArrowRight") {
                        this.rotateRight();
                    }
                }

                moveForward() {
                    this.x = this.x + this.speed * Math.cos(this.angle);
                    this.y = this.y + this.speed * Math.sin(this.angle);
                }

                moveBackward() {
                    this.x = this.x - this.speed * Math.cos(this.angle);
                    this.y = this.y - this.speed * Math.sin(this.angle);
                }

                rotateLeft() {
                    this.angle -= 0.05;
                }

                rotateRight() {
                    this.angle += 0.05;
                }

                checkBoundaryCollision(newX, newY) {
                    for (const boundary of boundaries) {
                        const intersection = boundary.intersect(
                            this,
                            this.angle,
                            newX,
                            newY
                        );
                        if (intersection) {
                            return true;
                        }
                    }
                    return false;
                }
            }
