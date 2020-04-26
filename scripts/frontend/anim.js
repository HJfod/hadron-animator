/// animations

function drawGrid() {
    if (grid) {
        ctx.fillStyle = getCSS('--c-lightest');
        ctx.globalAlpha = 0.2;
        for (let i = 1; i < sett.gridSize; i++) {
            ctx.fillRect(i * canvas.width / sett.gridSize - 1, 0, 2, canvas.height);
        }
        for (let i = 1; i < sett.gridSize / sett.ratio; i++) {
            ctx.fillRect(0, i * canvas.height / sett.gridSize * sett.ratio - 1, canvas.width, 2);
        }

        ctx.fillStyle = getCSS('--c-lightest');
        ctx.globalAlpha = 0.4;

        ctx.fillRect(canvas.width / 4 - 1, 0, 2, canvas.height);
        ctx.fillRect(canvas.width / (4 / 3) - 1, 0, 2, canvas.height);
        ctx.fillRect(0, canvas.height / 4 - 1, canvas.width, 2);
        ctx.fillRect(0, canvas.height / (4 / 3) - 1, canvas.width, 2);

        ctx.fillStyle = getCSS('--c-lightest');
        ctx.globalAlpha = 0.5;

        ctx.fillRect(canvas.width / 2 - 1, 0, 2, canvas.height);
        ctx.fillRect(0, canvas.height / 2 - 1, canvas.width, 2);
        ctx.globalAlpha = 1;
    }
}

function play(p = null) {
    if ((p === null) ? playing : p === false) {
        playing = false;
        document.getElementById('b_play').innerHTML = '&#9654;';
    } else {
        playing = true;
        document.getElementById('b_play').innerHTML = '&#10074;&#10074;';
        if (frame === sett.videoLength * sett.fps) {
            frame = 0;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    tlCtx.clearRect(0, 0, tlCanvas.width, tlCanvas.height);

    drawGrid();

    drawTimeline();

    requestAnimationFrame(draw);
}

draw();

changeTime(document.querySelector("input[data-link='stime']"));
resizeGrid(document.querySelector("input[data-link='sgrid']"));

document.querySelector(`text[data-link="stime"]`).innerText = document.querySelector("input[data-link='stime']").value;
document.querySelector(`text[data-link="sgrid"]`).innerText = document.querySelector("input[data-link='sgrid']").value;

document.getElementById("del_layer").style.display = "none";

deselect();

document.getElementById('timeline').height = window.innerHeight;

sett.layerLimit = (window.innerHeight - sett.tlFontSize * 3) / sett.tlFontSize;