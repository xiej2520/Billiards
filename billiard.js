
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

	/**
	 * Collides a particle with the polygon.
	 * Particle's position and velocity is modified by the collision.
	 * @param {*} particle collides with polygon.
	 * @returns position of collision.
	 */
	collide(particle) {
		let prevPoint = this.ptArray[this.ptArray.length-1]
		let intersections = []
		for (const point of this.ptArray) {
			// prevPoint -- point is a side
			// checks if particle will collide with side
			let result = particle.intersectLineSegment(prevPoint, point)
			if (result[0] == true) {
				// collision location, then two points defining side
				intersections.push([result[1], prevPoint, point]);
			}
			prevPoint = point;
		}

		if (intersections.length > 0) {
			// find first side that particle collides with (handle concave polygons)
			let minDistIndex = 0;
			let minDist = dist(intersections[0][0], [particle.x, particle.y]);
			for (let i=1; i<intersections.length; i++) {
				let thisDist = dist(intersections[i][0], [particle.x, particle.y])
				if (thisDist < minDist) {
					minDistIndex = i;
					minDist = thisDist;
				}
			}
			// calculate angle of collision
			let correctCollision = intersections[minDistIndex];
			let lineAngle = Math.atan2(correctCollision[2][1]-correctCollision[1][1], correctCollision[2][0]-correctCollision[1][0]);
			// positive angle
			lineAngle = ((lineAngle % (2*Math.PI)) + 2*Math.PI) % (2*Math.PI);
			let particleAngle = Math.atan2(particle.vy, particle.vx);
			let incidence = particleAngle - lineAngle;
			let reflectedAngle = lineAngle - incidence;

			// modify particle's location and new direction
			particle.x = correctCollision[0][0];
			particle.y = correctCollision[0][1];
			let velocity = Math.sqrt(particle.vx ** 2 + particle.vy ** 2);
			particle.vx = velocity * Math.cos(reflectedAngle);
			particle.vy = velocity * Math.sin(reflectedAngle);
			return [particle.x, particle.y];
		}
		// no collision (handle this somewhere?)
		else {
			return [];
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
			ctx.beginPath();
			ctx.arc(point[0], point[1], 5, 0, 360);
			ctx.fill();
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
	
	/**
	 * Computes the intersection of the particle with a given line segment.
	 * @param {*} pt1 first point defining line segment.
	 * @param {*} pt2 second point defining line segment.
	 * @returns array with truth value for collision, 
	 * 		if true then also includes position of collision.
	 */
	intersectLineSegment(pt1, pt2) {
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
					let yIntersect = m * (xIntersect - pt2[0]) + pt2[1];
					// intersects within line segment bounds
					// and is in right direction
					// and point is not already on line segment
					if (leftX < xIntersect && xIntersect < rightX && 
						(xIntersect-this.x)/this.vx > 0 && (Math.abs((xIntersect-this.x)) > 0.001
						|| Math.abs((yIntersect-this.y)) > 0.001)
						) { // fudge factor
						// formula
						return [true, [xIntersect, yIntersect]];
					}
				}
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

function dist(pt1, pt2) {
	return Math.sqrt((pt1[0] - pt2[0]) ** 2 + (pt1[1] - pt2[1]) ** 2);
}