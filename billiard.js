
/**
 * Abstract class Shape
 * 
 * @class Shape
 */

class Shape {

	constructor() {
		if (this.constructor == Shape) {
			throw new Error("Abstract classes can't be instantiated.");
		}
	}
	collide() {
		throw new Error("Method 'collide()' must be implemented.");
	}
	draw() {
		throw new Error("Method 'draw()' must be implemented.")
	}
}

/**
 * Polygon
 * 
 * @class Polygon
 * @extends {Animal}
 */
class Polygon extends Shape {

	constructor(ptArray) {
		super();
		this.ptArray = ptArray;
	}

	collide(particle) {
		let prevPoint = this.ptArray[this.ptArray.length-1]
		for (const point of this.ptArray) {
			console.log(prevPoint, point);
			// prevPoint -- point is a side
			// check collision by intersecting lines
			if (prevPoint[0] != point[0] && particle.vx != 0) {
				let m = (point[1] - prevPoint[1]) / (point[0] - prevPoint[0]);
				let v = particle.vy / particle.vx;
				let xIntersect = (particle.x * v - particle.y - m * point[0] + point[1]) / (v - m);
				let yIntersect = m * (xIntersect - point[0]) + point[1];
				console.log(xIntersect, yIntersect);
			}
			prevPoint = point;
		}
	}

	draw(ctx) {
		let prevPoint = this.ptArray[this.ptArray.length-1]
		for (const point of this.ptArray) {
			ctx.strokeStyle = "black";
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(prevPoint[0], prevPoint[1]);
			ctx.lineTo(point[0], point[1]);
			ctx.stroke();
			prevPoint = point;
		}
	}

}

class Particle {
	constructor(x, y, vx, vy) {
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
	}
}

