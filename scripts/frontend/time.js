/// timeline

let mx, my;

let tl;
let tcl;
let tct;


function handlePlayer() {
    if (playing) {
        if (frame < sett.fps * sett.videoLength) {
            frame++;
        } else {
            play(false);
        }
    }
    let pos = frame * calcTimelineSize() * sett.tlSnap / sett.fps + sett.layerSize;
    if (playing) {
        let grd = ctx.createLinearGradient(pos - sett.tlFontSize, 0, pos, 0);
        grd.addColorStop(0, "rgba(0,0,0,0)");
        grd.addColorStop(1, getCSS("--c-yes"));

        tlCtx.globalAlpha = .5;
        tlCtx.fillStyle = grd;
        tlCtx.fillRect(pos - sett.tlFontSize, sett.tlFontSize, sett.tlFontSize, calcTimelineSize("h") - sett.tlFontSize);
    }
    tlCtx.globalAlpha = 1;
    tlCtx.fillStyle = getCSS("--c-yes");
    tlCtx.fillRect(pos, sett.tlFontSize, 2, calcTimelineSize("h") - sett.tlFontSize);
}

function drawTLMouse() {
    let x = mx, y = my - sett.tlFontSize * 1.5 + tct;
    tlCtx.fillStyle = getCSS("--c-lightest");
    tlCtx.globalAlpha = 0.1;
    if (tlSnapOn) {
        x = Math.round((x - sett.layerSize + calcTimelineSize() / 2) / calcTimelineSize()) * calcTimelineSize() + sett.layerSize - calcTimelineSize() / 2;
    }
    y = Math.round(y / sett.tlFontSize) * sett.tlFontSize;

    if (x < sett.layerSize + tl) { return };

    if (y > tct - sett.tlFontSize) {
        tlCtx.fillRect(x - calcTimelineSize() / 2, sett.tlFontSize + tct, calcTimelineSize(), tlCanvas.height);
        if (y < sett.tlFontSize * layers.length && y > -sett.tlFontSize) {
            tlCtx.globalAlpha = 0.3;
            tlCtx.fillRect(x - calcTimelineSize() / 2, y + sett.tlFontSize, calcTimelineSize(), sett.tlFontSize);
        }
    } else {
        if (tlSnapOn) {
            x -= calcTimelineSize() / 2;
        }
        tlCtx.globalAlpha = .8;
        tlCtx.fillStyle = getCSS("--c-yes");
        tlCtx.fillRect(Math.round(x), tct, 2, sett.tlFontSize);
    }

    tlCtx.globalAlpha = 1;
}

function drawTime() {
    let div = 1;
    div = Math.round(sett.tlSnap * (64 / sett.tlSnap) / calcTimelineSize());
    div = Math.pow(2, Math.ceil(Math.log(div) / Math.log(2)));
    if (div < 1) { div = 1; }

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
        tlCtx.fillRect(i * calcTimelineSize() + sett.layerSize, 0, 1, calcTimelineSize("h"));
    }
    tlCtx.globalAlpha = 0.15;
    for (let i = 0; i < (sett.videoLength + 1) * sett.tlSnap; i++) {
        tlCtx.fillRect(i * calcTimelineSize() + sett.layerSize, 0, 1, calcTimelineSize("h"));
    }
    tlCtx.globalAlpha = 1;

    tlCtx.fillStyle = colorLuminance(getCSS("--c-dark"), -.6);
    tlCtx.fillRect(0, tct, tlCanvas.width, sett.tlFontSize);

    tlCtx.fillStyle = getCSS("--c-lightest");
    for (let i = 0; i < (sett.videoLength + 1) * sett.tlSnap; i += div) {
        tlCtx.font = `${sett.tlFontSize / 1.2}px ${sett.font}`;
        tlCtx.fillText(i / sett.tlSnap + "s", i * calcTimelineSize() + sett.layerSize + sett.tlFontSize / 4, tct + sett.tlFontSize / 1.2);
    }

    tlCtx.fillStyle = colorLuminance(getCSS("--c-dark"), -.5);
    tlCtx.fillRect(tl, 0, sett.layerSize, tlCanvas.height);

    for (let i in layers) {
        (tlSelected == i) ? tlCtx.fillStyle = colorLuminance(getCSS("--c-yes"), -.4) : tlCtx.fillStyle = colorLuminance(getCSS("--c-dark"), (i % 2 == 0) ? .2 : 0);
        if (timelineHover("layer",i)) tlCtx.fillStyle = colorLuminance(tlCtx.fillStyle, +.5);
        tlCtx.fillRect(tl, i * sett.tlFontSize + sett.tlFontSize, sett.layerSize, sett.tlFontSize);
        tlCtx.fillStyle = getCSS("--c-lightest");
        tlCtx.fillText(layers[i].name, tl + tcl + sett.tlFontSize / 2, i * sett.tlFontSize + sett.tlFontSize * 1.8);
    }

    tlCtx.fillStyle = colorLuminance(getCSS("--c-dark"), -.8);
    tlCtx.fillRect(tl, tct, sett.layerSize, sett.tlFontSize);
    tlCtx.font = `${sett.tlFontSize / 1.6}px Segoe UI`;
    tlCtx.fillStyle = getCSS("--c-mid");
    tlCtx.fillText(`F: ${frame}, fps: ${sett.fps}`, tl + sett.tlFontSize / 4, tct + sett.tlFontSize / 1.3);
}

function addLayer(l = false) {
    if (l) {
        layers.splice(tlSelected, 1);
        document.getElementById("del_layer").style.display = "none";
        deselect();
    } else {
        if (layers.length < sett.layerLimit) {
            layers[layers.length] = { name: `Layer ${layers.length}`, contents: [] };
        }
    }
}

function tlClick() {
    if (my < tct + sett.tlFontSize) {
        frame = Math.round((mx - sett.layerSize) / (calcTimelineSize() * sett.tlSnap / sett.fps) - (sett.layerSize / (calcTimelineSize() * sett.tlSnap / sett.fps + sett.layerSize))) + 1;
        if (tlSnapOn) {
            frame = Math.round(Math.round((frame - (calcTimelineSize() / sett.tlSnap / 2)) / (sett.fps / sett.tlSnap)) * (sett.fps / sett.tlSnap));
        }
        if (frame < 0) {
            frame = 0;
        }
        if (frame >= sett.fps * sett.videoLength) {
            frame = sett.fps * sett.videoLength;
        }
    }
    for (let i in layers) {
        if (timelineHover("layer",i)) {
            tlSelected = i;
            document.getElementById("del_layer").style.display = "initial";
            document.getElementById("timeline").setAttribute("data-menu", "Rename=>;Remove layer=>addLayer(1)");
        } else {
            if (tlSelected == i) {
                deselect();
                document.getElementById("del_layer").style.display = "none";
            }
        }
    }
}

function timelineHover(type, i) {
    if (type === "layer") {
        return (mx > tl && mx < tl + sett.layerSize && my + tct > i * sett.tlFontSize + sett.tlFontSize && my + tct < i * sett.tlFontSize + sett.tlFontSize * 2);
    } else {
        return false;
    }
}

function calcTimelineSize(t = null) {
    if (t === "h") {
        return (sett.tlFontSize * layers.length + sett.tlFontSize);
    } else {
        return ((tlCanvas.width - sett.layerSize) / (sett.videoLength + 1) / sett.tlSnap);
    }
}

function deselect() {
    tlSelected = undefined;
    document.getElementById("timeline").setAttribute("data-menu", "");
}

function changeTime(o) {
    sett.tlSize = o.value;
    tlCanvas.width = window.screen.width / 10 * 100 / sett.tlSize * sett.videoLength + sett.layerSize;
    tl = tl * o.value;
}

function drawTimeline() {
    tl = document.querySelector(".timeline_container").scrollLeft;
    tcl = document.querySelector(".timeline_container").getBoundingClientRect().left;

    tct = document.querySelector(".timeline_container").scrollTop;
    tch = document.querySelector(".timeline_container").getBoundingClientRect().top;

    mx = mouseX + tl - tcl;
    my = mouseY - tch;

    drawTime();
    handlePlayer();
    if (isHover(document.getElementById("timeline"))) {
        drawTLMouse();
    }
}