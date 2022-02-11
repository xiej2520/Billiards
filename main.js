const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let mousePosDiv = document.getElementById("mousePos");

function drawDot(ctx, x, y) {
	ctx.beginPath();
	ctx.moveTo(x, y)
	ctx.arc(x, y, 2, 0, 360);
	ctx.fill();
}


square = new Polygon([[100, 100], [100, 400], [400, 400], [400, 100]]);
//square = new Polygon([[200, 100], [400, 100], [461.8, 290.2], [300, 407.8], [138.2, 290.2]]);
square.draw(ctx);

p = new Particle(200, 200, 0.11, 1);
drawDot(ctx, p.x, p.y);

ctx.beginPath();
ctx.moveTo(p.x, p.y);
ctx.lineTo(p.x+p.vx*10, p.y+p.vy*10);
ctx.stroke();


var x = 0, y = 0;
window.addEventListener("mousemove", function (e) {
	var rect = canvas.getBoundingClientRect();
	x = e.clientX - rect.left
	y = e.clientY - rect.top
	mousePosDiv.innerHTML = "x: " + x + ", y: " + y;
}, false);


let collideButton = document.getElementById("collideButton");
collideButton.addEventListener("click", collideAndDraw);

function collideAndDraw() {
	for (i=0; i<100; i++) {
		ctx.beginPath();
		ctx.moveTo(p.x, p.y);
		square.collide(p)
		ctx.lineTo(p.x, p.y);
		ctx.stroke();
		drawDot(ctx, p.x, p.y);
	}
}