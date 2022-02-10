const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let mousePosDiv = document.getElementById("mousePos");

square = new Polygon([[150, 150], [400, 150], [500, 400], [350, 400]]);
square.draw(ctx);

p = new Particle(200, 200, 2, 1);
ctx.moveTo(p.x, p.y);
ctx.arc(p.x, p.y, 5, 0, 360);
ctx.fill();

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

square.collide(p)