/// timeline

let mx, my;

let tl;
let tcl;
let tct;


function drawMouse() {
    let x = mx - tcl, y = -my + sett.tlFontSize;
    tlCtx.fillStyle = getCSS("--c-lightest");
    tlCtx.globalAlpha = 0.1;
    if (snap) {
        x = Math.round(x / ((tlCanvas.width - sett.layerSize) / (sett.videoLength + 1) / sett.tlSnap)) * ((tlCanvas.width - sett.layerSize) / (sett.videoLength + 1) / sett.tlSnap);
    }
    y = Math.round(y / (tlCanvas.height / sett.tlFontSize * 1.28)) * (tlCanvas.height / sett.tlFontSize * 1.28);

    if (x + tlCanvas.width / sett.tlSize / 2 > - sett.layerSize * tlCanvas.tlSnap || x + tlCanvas.width / sett.tlSize - tl < 0) { return };

    tlCtx.fillRect(x, sett.tlFontSize + tct, (tlCanvas.width - sett.layerSize) / (sett.videoLength + 1) / sett.tlSnap, tlCanvas.height);
    if (y > -sett.tlFontSize * layers.length && y < sett.tlFontSize) {
        tlCtx.globalAlpha = 0.3;
        tlCtx.fillRect(x, -y + sett.tlFontSize, (tlCanvas.width - sett.layerSize) / (sett.videoLength + 1) / sett.tlSnap, sett.tlFontSize);
    }

    tlCtx.globalAlpha = 1;
}

function drawTime() {
    let div = Math.round(sett.tlSize / 24);
    if (div < 1) { div = 1; }
    if (div & 2 > 0 && div != 1) {
        div += 1;
    }

    for (let i in layers) {
        if (i % 2 == 0) {
            tlCtx.globalAlpha = 0.15;
            tlCtx.fillStyle = getCSS("--c-darkest");
            tlCtx.fillRect(tl + sett.layerSize, i * sett.tlFontSize + sett.tlFontSize, tlCanvas.width, sett.tlFontSize)
        }
        tlCtx.globalAlpha = 1;
    }

    tlCtx.fillStyle = getCSS("--c-lightest");
    tlCtx.globalAlpha = 0.5;
    for (let i = 0; i < (sett.videoLength + 1) * sett.tlSnap; i += div) {
        tlCtx.fillRect(i * (tlCanvas.width - sett.layerSize) / (sett.videoLength + 1) / sett.tlSnap + sett.layerSize, 0, 1, tlCanvas.height);
    }
    tlCtx.globalAlpha = 0.15;
    for (let i = 0; i < (sett.videoLength + 1) * sett.tlSnap; i++) {
        tlCtx.fillRect(i * (tlCanvas.width - sett.layerSize) / (sett.videoLength + 1) / sett.tlSnap + sett.layerSize, 0, 1, tlCanvas.height);
    }
    tlCtx.globalAlpha = 1;

    tlCtx.fillStyle = colorLuminance(getCSS("--c-dark"), -.6);
    tlCtx.fillRect(0, tct, tlCanvas.width, sett.tlFontSize);

    tlCtx.fillStyle = getCSS("--c-lightest");
    for (let i = 0; i < (sett.videoLength + 1) * sett.tlSnap; i += div) {
        tlCtx.font = `${sett.tlFontSize / 1.2}px Segoe UI`;
        tlCtx.fillText(i / sett.tlSnap + "s", i * (tlCanvas.width - sett.layerSize) / (sett.videoLength + 1) / sett.tlSnap + sett.layerSize + sett.tlFontSize / 4, tct + sett.tlFontSize / 1.2);
    }

    tlCtx.fillStyle = colorLuminance(getCSS("--c-dark"), -.5);
    tlCtx.fillRect(tl, 0, sett.layerSize, tlCanvas.height);

    for (let i in layers) {
        (selected == i) ? tlCtx.fillStyle = colorLuminance(getCSS("--c-yes"), -.4) : tlCtx.fillStyle = colorLuminance(getCSS("--c-dark"), (i % 2 == 0) ? .2 : 0);
        tlCtx.fillRect(tl, i * sett.tlFontSize + sett.tlFontSize, sett.layerSize, sett.tlFontSize);
        tlCtx.fillStyle = getCSS("--c-lightest");
        tlCtx.fillText(layers[i].name, tl + tcl + sett.tlFontSize / 2, i * sett.tlFontSize + sett.tlFontSize * 1.8);
    }

    tlCtx.fillStyle = colorLuminance(getCSS("--c-dark"), -.8);
    tlCtx.fillRect(tl, tct, sett.layerSize, sett.tlFontSize);
}

function addLayer(l = false) {
    if (l) {
        layers.splice(selected, 1);
        document.getElementById("del_layer").style.display = "none";
        deselect();
    } else {
        if (layers.length < sett.layerLimit) {
            layers[layers.length] = { name: `Layer ${layers.length}`, contents: [] };
        }
    }
}

function tlClick() {
    for (let i in layers) {
        if (mx > tl && mx < tl + sett.layerSize && my > i * sett.tlFontSize + sett.tlFontSize / 2 && my < i * sett.tlFontSize + sett.tlFontSize + sett.tlFontSize / 2) {
            selected = i;
            document.getElementById("del_layer").style.display = "initial";
            document.getElementById("timeline").setAttribute("data-menu", "Rename=>;Remove layer=>addLayer(1)");
        } else {
            if (selected == i) {
                deselect();
                document.getElementById("del_layer").style.display = "none";
            }
        }
    }
}

function deselect() {
    selected = undefined;
    document.getElementById("timeline").setAttribute("data-menu", "");
}

function changeTime(o) {
    sett.tlSize = o.value;
    tlCanvas.width = window.screen.width / 10 * 100 / sett.tlSize * sett.videoLength + sett.layerSize;
}

function drawTimeline() {
    tl = document.querySelector(".timeline_container").scrollLeft;
    tcl = document.querySelector(".timeline_container").getBoundingClientRect().left;

    tct = document.querySelector(".timeline_container").scrollTop;

    mx = mouseX + tl - tcl;
    my = -(tct - mouseY - document.querySelector(".timeline_container").scrollHeight + getCSS("--pad") + getCSS("--pad-small"));

    drawTime();
    if (isHover(document.getElementById("timeline"))) {
        drawMouse();
    }
}