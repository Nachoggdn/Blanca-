const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
setupCanvas();
window.addEventListener("resize", setupCanvas);

const pointer = {
    x: 0.5 * window.innerWidth,
    y: 0.5 * window.innerHeight,
};

window.addEventListener("click", e => updateMousePosition(e.pageX, e.pageY));
window.addEventListener("mousemove", e => updateMousePosition(e.pageX, e.pageY));
window.addEventListener("touchmove", e => {
    updateMousePosition(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
});

function updateMousePosition(eX, eY) {
    pointer.x = eX;
    pointer.y = eY;
}

const p = {x: pointer.x, y: pointer.y};

const params = {
    spring: 0.1, // cuanto más bajo, más lenta la transición
    pointsNumber: 10,
    baseWidth: 50,
    friction: 3.
};

const trail = new Array(params.pointsNumber);
for (let i = 0; i < params.pointsNumber; i++) {
    trail[i] = {
        x: pointer.x,
        y: pointer.y,
        dx: 0,
        dy: 0,
    }
}



function update(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    trail.forEach((p, pIdx) => {
        const prev = pIdx === 0 ? pointer : trail[pIdx - 1];

        p.dx = (prev.x - p.x) * params.spring;
        p.dy = (prev.y - p.y) * params.spring;
        p.dx *= params.friction;
        p.dy *= params.friction;

        p.x += p.dx;
        p.y += p.dy;

        // ctx.beginPath();
        // ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
        // ctx.fill();

        trail.forEach((p, pIdx) => {
            // calc p.x and p.y

            if (pIdx === 0) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                // } else {
                //     ctx.lineTo(p.x, p.y);
            }
        });
        for (let i = 1; i < trail.length - 1; i++) {
            const xc = .5 * (trail[i].x + trail[i + 1].x);
            const yc = .5 * (trail[i].y + trail[i + 1].y);
            ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
            ctx.lineWidth = params.baseWidth * (params.pointsNumber - i);
        }
    });

// draw the thing
ctx.stroke();

    window.requestAnimationFrame(update);
}

update(0);

