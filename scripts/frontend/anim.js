/// animations

let amx, amy;

function add(o) {
    adding = o;
}

function newObject(o) {
    let x = amx;
    let y = amy;
    if (pSnapOn) {
        x = Math.round(amx / calcGridSize()) * calcGridSize();
        y = Math.round(amy / calcGridSize("h")) * calcGridSize("h");
    }

    switch (o) {
        case "line":
            obj[obj.length] = {
                id: getRandom(),
                type: "line",
                x: x,
                y: y,
                length: sett.defaultLineLength,
                width: sett.defaultLineWidth,
                rot: 0,
                color: getCSS("--c-lightest"),
                alpha: 1
            };
            break;
    }
}

function drawMouse() {
    if (adding !== null) {
        let x = amx;
        let y = amy;
        if (pSnapOn) {
            x = Math.round(amx / calcGridSize()) * calcGridSize();
            y = Math.round(amy / calcGridSize("h")) * calcGridSize("h");
        }
        switch (adding) {
            case "line":
                ctx.fillStyle = getCSS("--c-lightest");
                ctx.globalAlpha = .5;
                ctx.fillRect(x - sett.defaultLineWidth / 2, y - sett.defaultLineWidth / 2, sett.defaultLineLength + sett.defaultLineWidth, sett.defaultLineWidth);
                ctx.globalAlpha = 1;
                break;
        }
    }
}

function pClick() {
    if (adding !== null) {
        newObject(adding);
        adding = null;
    } else {
        let h = true;
        for (let i in obj) {
            if (pHover("obj", { x: obj[i].x, y: obj[i].y, w: obj[i].width, l: obj[i].length })) {
                pSelected = obj[i].id;
                h = false;
            }
        }
        if (h) {
            pSelected = null;
        }
    }
}

function drawObjects() {
    for (let i in obj) {
        if (obj[i].type === "line") {
            ctx.fillStyle = obj[i].color;
            if (pSelected === obj[i].id) {
                ctx.fillStyle = getCSS("--c-yes");
            }
            if (pHover("obj", { x: obj[i].x, y: obj[i].y, w: obj[i].width, l: obj[i].length })) {
                ctx.globalAlpha = obj[i].alpha / 1.2;
            } else {
                ctx.globalAlpha = obj[i].alpha;
            }
            ctx.fillRect(obj[i].x - obj[i].width / 2, obj[i].y - obj[i].width / 2, obj[i].length + obj[i].width, obj[i].width);
            ctx.globalAlpha = 1;
        }
    }
}

function drawGrid() {
    if (grid) {
        ctx.fillStyle = getCSS("--c-lightest");
        ctx.globalAlpha = 0.2;
        for (let i = 1; i < sett.gridSize; i++) {
            ctx.fillRect(i * calcGridSize() - 1, 0, 2, canvas.height);
        }
        for (let i = 1; i < sett.gridSize / sett.ratio; i++) {
            ctx.fillRect(0, i * calcGridSize("h") - 1, canvas.width, 2);
        }

        ctx.fillStyle = getCSS("--c-lightest");
        ctx.globalAlpha = 0.4;

        ctx.fillRect(canvas.width / 4 - 1, 0, 2, canvas.height);
        ctx.fillRect(canvas.width / (4 / 3) - 1, 0, 2, canvas.height);
        ctx.fillRect(0, canvas.height / 4 - 1, canvas.width, 2);
        ctx.fillRect(0, canvas.height / (4 / 3) - 1, canvas.width, 2);

        ctx.fillStyle = getCSS("--c-lightest");
        ctx.globalAlpha = 0.5;

        ctx.fillRect(canvas.width / 2 - 1, 0, 2, canvas.height);
        ctx.fillRect(0, canvas.height / 2 - 1, canvas.width, 2);
        ctx.globalAlpha = 1;
    }
}

function pHover(type, i) {
    if (type === "obj") {
        return (amx > i.x - i.w/2 && amx < i.x + i.l + i.w/2 && amy > i.y - i.w/2 && amy < i.y + i.w/2);
    } else {
        return false;
    }
}

function play(p = null) {
    if ((p === null) ? playing : p === false) {
        playing = false;
        document.getElementById("b_play").innerHTML = "&#9654;";
    } else {
        playing = true;
        document.getElementById("b_play").innerHTML = "&#10074;&#10074;";
        if (frame === sett.videoLength * sett.fps) {
            frame = 0;
        }
    }
}

function calcGridSize(w = "w") {
    if (w === "h") {
        return canvas.height / sett.gridSize * sett.ratio;
    } else {
        return canvas.width / sett.gridSize;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    tlCtx.clearRect(0, 0, tlCanvas.width, tlCanvas.height);

    pt = document.querySelector("#preview").getBoundingClientRect().top;
    pl = document.querySelector("#preview").getBoundingClientRect().left;
    let p = document.querySelector("#preview");

    amx = (mouseX - pl) * (p.width / p.getBoundingClientRect().width);
    amy = (mouseY - pt) * (p.height / p.getBoundingClientRect().height);

    drawGrid();
    drawObjects();
    drawMouse();

    drawTimeline();

    requestAnimationFrame(draw);
}

draw();

changeTime(document.querySelector(`input[data-link="stime"]`));
resizeGrid(document.querySelector(`input[data-link="sgrid"]`));

document.querySelector(`text[data-link="stime"]`).innerText = document.querySelector(`input[data-link="stime"]`).value;
document.querySelector(`text[data-link="sgrid"]`).innerText = document.querySelector(`input[data-link="sgrid"]`).value;

document.getElementById("del_layer").style.display = "none";

deselect();

document.getElementById("timeline").height = window.innerHeight;

sett.layerLimit = (window.innerHeight - sett.tlFontSize * 3) / sett.tlFontSize;