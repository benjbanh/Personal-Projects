// src/PhysicsEngine.js
class PhysicsEngine {
  constructor() {
    this.gravity = 0.98;  // Gravity constant
    this.bounce = 0.7;    // Bounce factor
    this.objects = [];    // List of objects in the physics engine
  }

  addObject(object) {
    this.objects.push(object);
  }

  update() {
    this.objects.forEach(obj => {
      obj.vy += this.gravity;  // Apply gravity to vertical velocity
      obj.x += obj.vx;         // Update x position based on horizontal velocity
      obj.y += obj.vy;         // Update y position based on vertical velocity

      // Collision detection with the floor
      if (obj.y + obj.radius > window.innerHeight) {
        obj.y = window.innerHeight - obj.radius;  // Reset position
        obj.vy *= -this.bounce;  // Reverse and reduce velocity
      }

      // Collision detection with walls
      if (obj.x + obj.radius > window.innerWidth || obj.x - obj.radius < 0) {
        obj.vx *= -this.bounce;  // Reverse and reduce horizontal velocity
      }
    });
  }
}

export default PhysicsEngine;
