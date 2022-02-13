const canvas = document.getElementById("canvas");
let canvasBounds = canvas.getBoundingClientRect();
let ctx = canvas.getContext("2d");

let mousePosDiv = document.getElementById("mousePos");

let collideButton = document.getElementById("collideButton");
collideButton.addEventListener("click", collideAndDraw);
let numCollidesPer = 1;
let numCollideInput = document.getElementById("numCollideInput")
numCollideInput.addEventListener("input", function() {
	let value = parseInt(numCollideInput.value);
	if (value < parseInt(numCollideInput.min)) {
		numCollideInput.value = numCollideInput.min;
	}
	else if (value > parseInt(numCollideInput.max)) {
		numCollideInput.value = numCollideInput.max;
	}
	numCollidesPer = numCollideInput.value;
});


function getCursorPosition(canvas, e) {
	var rect = canvas.getBoundingClientRect();
	x = e.clientX - rect.left
	y = e.clientY - rect.top
	return [x, y]
}

function drawDot(ctx, x, y, r) {
	ctx.beginPath();
	ctx.moveTo(x, y)
	ctx.arc(x, y, r, 0, 360);
	ctx.fill();
}

const arrowLength = 20;
const arrowHeadSize = 10;

function drawArrow(ctx, x, y, theta, length, headSize) {
	ctx.beginPath();
	ctx.moveTo(x, y);
	let arrowHeadX = x+length*Math.cos(theta);
	let arrowHeadY = y+length*Math.sin(theta);
	ctx.lineTo(arrowHeadX, arrowHeadY);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(arrowHeadX, arrowHeadY);
	pt1 = [arrowHeadX+headSize*0.577*Math.cos(theta+1.57), arrowHeadY+headSize*0.577*Math.sin(theta+1.57)];
	pt2 = [arrowHeadX+headSize*Math.cos(theta), arrowHeadY+headSize*Math.sin(theta)];
	pt3 = [arrowHeadX+headSize*0.577*Math.cos(theta-1.57), arrowHeadY+headSize*0.577*Math.sin(theta-1.57)];
	ctx.lineTo(pt1[0], pt1[1]);
	ctx.lineTo(pt2[0], pt2[1]);
	ctx.lineTo(pt3[0], pt3[1]);
	ctx.fill();
}

function collideAndDraw() {
	for (let i=0; i<numCollidesPer; i++) {
		ctx.beginPath();
		ctx.moveTo(p.x, p.y);
		poly.collide(p)
		ctx.lineTo(p.x, p.y);
		ctx.stroke();
		drawDot(ctx, p.x, p.y, 2);
	}
}

// Add event handlers for radio buttons
currentMode = "addVerticesMode";
let modeSelect = document.forms.modeSelect;
for (let i=0; i<modeSelect.length; i++) {
	modeSelect[i].onclick = function(e) {
		currentMode = e.target.id;
	}
}

let hoveredPointIndex = -1;
let isOnParticle = false;
let heldDownParticle = false;
let isOnArrowHead = false;
let heldDownArrowHead = false;
canvas.addEventListener("mousemove", function(e) {
	let pos = getCursorPosition(canvas, e);
	mousePosDiv.innerHTML = "x: " + pos[0] + ", y: " + pos[1];
	switch (currentMode) {
		case "addVerticesMode":
			let mouseWindowPos = [pos[0]+canvasBounds.left, pos[1]+canvasBounds.top];
			if (canvasBounds.left+5 < mouseWindowPos[0] && mouseWindowPos[0] < canvasBounds.right-5 &&
			canvasBounds.top+5 < mouseWindowPos[1] && mouseWindowPos[1] < canvasBounds.bottom-5){
				document.body.style.cursor = "pointer";
			}
			else {
				document.body.style.cursor = "default";
			}
			break;
		case "removeVerticesMode":
			let isOnPoint = false;
			for (let i=0; i<poly.ptArray.length; i++) {
				if (dist(poly.ptArray[i], pos) <= 5) {
					isOnPoint = true
					hoveredPointIndex = i;
					document.body.style.cursor = "pointer";
				}
			}
			if (!isOnPoint) {
				hoveredPointIndex = -1;
				document.body.style.cursor = "default";
			}
			break;
		case "moveParticleMode":
			isOnParticle = dist([p.x, p.y], pos) < 10;
			if (isOnParticle) {
				document.body.style.cursor = "pointer";
			}
			else {
				document.body.style.cursor = "default";
			}
			if (heldDownParticle) {
				p.x = pos[0];
				p.y = pos[1];
			}
			break;
		case "pointDirectionMode":
			theta =  Math.atan2(p.vy, p.vx);
			let arrowHeadXCenter = p.x+arrowLength*Math.cos(theta);
			let arrowHeadYCenter = p.y+arrowLength*Math.sin(theta);
			isOnArrowHead = dist([arrowHeadXCenter, arrowHeadYCenter], pos) < 20;
			if (isOnArrowHead) {
				document.body.style.cursor = "pointer";
			}
			else {
				document.body.style.cursor = "default";
			}
			if (heldDownArrowHead) {
				let v = Math.sqrt(p.vx ** 2 + p.vy ** 2);
				let theta = Math.atan2(pos[1] - p.y, pos[0]-p.x);
				p.vx = Math.cos(theta) * v;
				p.vy = Math.sin(theta) * v;
			}
	}
	renderFrame(currentMode, pos);
});


canvas.addEventListener("click", function(e) {
	let pos = getCursorPosition(canvas, e);
	switch (currentMode) {
		case "addVerticesMode":
			poly.ptArray.push([pos[0], pos[1]]);
			break;
		case "removeVerticesMode":
			if (hoveredPointIndex != -1) {
				poly.ptArray.splice(hoveredPointIndex, 1);
				hoveredPointIndex = -1;
			}
			break;
	}
	renderFrame(currentMode, pos);
});


canvas.addEventListener("mousedown", function(e) {
	let pos = getCursorPosition(canvas, e);
	switch (currentMode) {
		case "moveParticleMode":
			if (isOnParticle) {
				heldDownParticle = true;
			}
			break;
		case "pointDirectionMode":
			if (isOnArrowHead) {
				heldDownArrowHead = true;
			}
			break;
	}
	renderFrame(currentMode, pos);
});

canvas.addEventListener("mouseup", function(e) {
	let pos = getCursorPosition(canvas, e);
	switch (currentMode) {
		case "moveParticleMode":
			heldDownParticle = false;
			break;
		case "pointDirectionMode":
			heldDownArrowHead = false;
			break;
	}
	renderFrame(currentMode, pos);
});

canvas.addEventListener("mouseout", function(e) {
	let pos = getCursorPosition(canvas, e);
	hoveredPointIndex = -1;
	isOnParticle = false;
	heldDownParticle = false;
	renderFrame(currentMode, pos);
});
//poly = new Polygon([[100, 100], [100, 400], [400, 400], [400, 100]]);
//poly = new Polygon([[200, 100], [400, 100], [461.8, 290.2], [300, 407.8], [138.2, 290.2]]);
poly = new Polygon([[100, 100], [400, 050], [400, 400], [100, 400]]);

p = new Particle(150, 250, 0, 2);

function renderFrame(mode, pos) {
	ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

	ctx.fillStyle = "blue";
	drawDot(ctx, p.x, p.y, 5);
	ctx.fillStyle = "black";
	drawArrow(ctx, p.x, p.y, Math.atan2(p.vy, p.vx), arrowLength, arrowHeadSize);

	if (poly.ptArray.length > 0) {
		poly.draw(ctx);
	}

	switch (mode) {
		case "addVerticesMode":
			ctx.fillStyle = "green";
			drawDot(ctx, pos[0], pos[1], 5);
			ctx.fillStyle = "black";
			break;
		case "removeVerticesMode":
			if (hoveredPointIndex != -1) {
				ctx.fillStyle = "red";
				let hoveredPoint = poly.ptArray[hoveredPointIndex]
				drawDot(ctx, hoveredPoint[0], hoveredPoint[1], 10);
				ctx.fillStyle = "black";
			}
			break;
		case "moveParticleMode":
			if (heldDownParticle) {
				ctx.fillStyle = "red";
				drawDot(ctx, p.x, p.y, 10);
				ctx.fillStyle = "black";
			}
			else if (isOnParticle) {
				drawDot(ctx, p.x, p.y, 10);
			}
			break;
		case "pointDirectionMode":
			if (isOnArrowHead || heldDownArrowHead) {
				ctx.fillStyle = "red";
				drawArrow(ctx, p.x, p.y, Math.atan2(p.vy, p.vx), arrowLength, arrowHeadSize*2)
				ctx.fillStyle = "black";
			}
	}

}

renderFrame("addVerticesMode", [0,0]);