function draw_grid() {
    if (grid) {
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        for (let i = 1; i < sett.grid_size; i++) {
            ctx.fillRect(i * canvas.width / sett.grid_size - 1, 0, 2, canvas.height);
        }
        for (let i = 1; i < sett.grid_size / sett.ratio; i++) {
            ctx.fillRect(0, i * canvas.height / sett.grid_size * sett.ratio - 1, canvas.width, 2);
        }

        ctx.fillStyle = 'rgba(255,255,255,0.25)';

        ctx.fillRect(canvas.width / 4 - 1, 0, 2, canvas.height);
        ctx.fillRect(canvas.width / (4 / 3) - 1, 0, 2, canvas.height);
        ctx.fillRect(0, canvas.height / 4 - 1, canvas.width, 2);
        ctx.fillRect(0, canvas.height / (4 / 3) - 1, canvas.width, 2);

        ctx.fillStyle = 'rgba(255,255,255,0.5)';

        ctx.fillRect(canvas.width / 2 - 1, 0, 2, canvas.height);
        ctx.fillRect(0, canvas.height / 2 - 1, canvas.width, 2);
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    draw_grid();

    requestAnimationFrame(draw);
}

draw();