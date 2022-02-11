
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
			// prevPoint -- point is a side
			let result = particle.intersectLineSegment(prevPoint, point)
			if (result[0] == true) {
				let lineAngle = Math.atan2(point[1]-prevPoint[1], point[0]-prevPoint[0]);
				// positive angle
				lineAngle = ((lineAngle % (2*Math.PI)) + 2*Math.PI) % (2*Math.PI);
				let particleAngle = Math.atan2(particle.vy, particle.vx);
				let incidence = particleAngle - lineAngle;
				let reflectedAngle = lineAngle - incidence;

				particle.x = result[1][0];
				particle.y = result[1][1];
				let velocity = Math.sqrt(particle.vx ** 2 + particle.vy ** 2);
				particle.vx = velocity * Math.cos(reflectedAngle);
				particle.vy = velocity * Math.sin(reflectedAngle);
				return [particle.x, particle.y];
			}
			else {
				prevPoint = point;
			}
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
	
	intersectLineSegment(pt1, pt2) {
		console.log("Line segment: ", pt1, pt2);
		// line segment isn't vertical
		if (pt1[0] != pt2[0]) {
			let m = (pt2[1] - pt1[1]) / (pt2[0] - pt1[0]);
			if (this.vx != 0) { // particle isn't moving vertically
				let v = this.vy / this.vx; // slope of particle path
				if (v != m) { // not parallel
					// formula
					let xIntersect = (this.x * v - this.y - m * pt2[0] + pt2[1]) / (v - m);

					let leftX = Math.min(pt1[0], pt2[0]);
					let rightX = Math.max(pt1[0], pt2[0])
					// intersects within line segment bounds
					// and is in right direction (false when point is on segment already)
					if (leftX < xIntersect && xIntersect < rightX && 
						(((xIntersect-this.x)/this.vx > 0.001) // right direction
						|| (xIntersect-this.x)/this.vx > 0 && Math.abs((xIntersect-this.x)) > 0.1
						)) { // fudge factor
						// formula
						let yIntersect = m * (xIntersect - pt2[0]) + pt2[1];
						return [true, [xIntersect, yIntersect]];
					}
				}
				// false when parallel and later intersecting line?
			}
			else { // particle is moving vertically
				let leftX = Math.min(pt1[0], pt2[0]);
				let rightX = Math.max(pt1[0], pt2[0])
				if (leftX < this.x && this.x < rightX) {
					let yIntersect = m * (this.x-pt2[0]) + pt2[1];
					if ((yIntersect - this.y) / this.vy > 0) {
						return [true, [this.x, yIntersect]];
					}
				}
			}
		}
		else { // vertical line segment
			if (this.vx != 0) { // not parallel
				let v = this.vy / this.vx; // slope of particle path
				let yIntersect = this.y + ((pt1[0] - this.x) * v);
				console.log("Y int", yIntersect);
				let bottomY = Math.min(pt1[1], pt2[1]);
				let topY = Math.max(pt1[1], pt2[1]);
				// intersects within line segment bounds
				// and is in right direction
				if (bottomY < yIntersect && yIntersect < topY && 
					(((pt1[0] - yIntersect)/this.vx > 0.001)
					|| (pt1[0]-this.y)/this.vx > 0 && Math.abs((yIntersect-this.y)) > 0.1
					)) {
					return [true, [pt1[0], yIntersect]];
				}
			}
		}
	return [false];
	}

}
