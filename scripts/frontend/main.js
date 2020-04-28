/// main
ipcSend({ action: "get-window-id" });

const html = document.documentElement;

const canvas = document.getElementById("preview");
const ctx = canvas.getContext("2d");

const tlCanvas = document.getElementById("timeline");
const tlCtx = tlCanvas.getContext("2d");

let grid = false;
let tlSnapOn = false;
let pSnapOn = false;
let playing = false;
let frame = 0;
let mouseX, mouseY;
let tlSelected;
let pSelected;
let draggerClick;
let windowID;
let randomSeed = 0;
let adding = null;
let layers = [
    { name: "Master", contents: [] }
];
let obj = [];

function inpSlider(e) {
    document.querySelector(`text[data-link="${e.getAttribute("data-link")}"]`).innerHTML = e.value;
};

document.addEventListener("mousemove", (event) => {
    mouseX = event.pageX;
    mouseY = event.pageY;
});

const menu = [
    {
        name: "File",
        menu: "New[#Ctrl+N]=>;Save[#Ctrl+S]=>;Open[#Ctrl+O]=>;sep;Quit[#Alt+F4]=>window.close()"
    },
    {
        name: "Tools",
        menu: `Add object=>{Add line=>add("line");Add shape=>add("shape");Add particles=>add("particle")};Add image=>;Add text=>;sep;Toggle grid[noclose#Ctrl+G]=>toggleGrid()`
    },
    {
        name: "Window",
        menu: "Theme=>{Dark=>;Light=>;Custom=>};"+
        "Size=>{50%=>setWindowSize(0.5);75%=>setWindowSize(0.75);100%=>setWindowSize(1);125%=>setWindowSize(1.25);150%=>setWindowSize(1.5);175%=>setWindowSize(1.75);200%=>setWindowSize(2)}"
    },
    {
        name: "Help",
        menu: `Reload app[#Ctrl+R]=>ipcSend(${JSON.stringify({ action: "w-reload" })});Toggle Dev Tools[#Ctrl+Shift+I]=>ipcSend(${JSON.stringify({ action: "toggle-dev" })});sep;Test IPC=>ipcSend(${JSON.stringify({ action: "return" })})`
    }
];

const sett = {
    gridSize: 16,
    ratio: 4 / 3,
    tlSize: 40,
    tlFontSize: 16,
    videoLength: 2,
    layerSize: 96,
    layerLimit: 10,
    tlSnap: 8,
    fps: 60,
    defaultLineWidth: 32,
    defaultLineLength: 240,
    font: "Segoe UI",
    pFontSize: 48
}

function toggleGrid() {
    grid ? grid = false : grid = true;
    g = document.getElementById("t_grid");
    if (g.classList.contains("toggled")) {
        g.classList.remove("toggled");
    } else {
        g.classList.add("toggled");
    }
}

function toggleSnap() {
    tlSnapOn ? tlSnapOn = false : tlSnapOn = true;
    g = document.getElementById("t_snap");
    if (g.classList.contains("toggled")) {
        g.classList.remove("toggled");
    } else {
        g.classList.add("toggled");
    }
}

function togglePreviewSnap() {
    pSnapOn ? pSnapOn = false : pSnapOn = true;
    g = document.getElementById("t_psnap");
    if (g.classList.contains("toggled")) {
        g.classList.remove("toggled");
    } else {
        g.classList.add("toggled");
    }
}

function resizeGrid(e) {
    sett.gridSize = Math.pow(e.value * 4, 2);
}

function setWindowSize(s) {
    html.style.setProperty("--scale", s);
    sett.tlSize = 40 * getCSS("--scale");
    sett.tlFontSize = 16 * getCSS("--scale");
    sett.layerSize = 96 * getCSS("--scale");
}

window.addEventListener("message", event => {
    const message = event.data;

    if (message.protocol === "from-app") {
        let args = JSON.parse(message.data);
        switch (args.action) {
            case "toggle-grid":
                toggleGrid();
                break;
            case "window-id":
                windowID = args.id;
                document.querySelector(".app-home-button.mz").setAttribute("onclick", `ipcSend(${JSON.stringify({ action: "mz", val: windowID })})`);
                document.querySelector(".app-home-button.fs").setAttribute("onclick", `ipcSend(${JSON.stringify({ action: "fs", val: windowID })})`);
                break;
            case "return":
                alert(`Received: ${args.text}`);
                break;
        }
    }
});

function dragOn(e) {
    e.preventDefault();
    let obj = arr(e.target.parentElement.children);
    let i = obj.indexOf(e.target);
    let p, m, off = 0, aff = e.target.getAttribute("affect");

    let w, h;
    switch (e.target.getAttribute("direction")) {
        case "left-right":
            w = getCSS(aff);
            off = mouseX;
            p = 1;
            break;
        case "right-left":
            w = getCSS(aff);
            off = mouseX;
            p = 0;
            break;
        case "top-down":
            h = getCSS(aff);
            off = mouseY;
            p = 1;
            break;
        case "down-top":
            h = getCSS(aff);
            off = mouseY;
            p = 0;
            break;
    }

    dragging(e.target, p, off, w, h, aff);
}

function dragging(e, p, offset, w, h, a) {
    if (w) {
        html.style.setProperty(a, p ? w - offset + mouseX + "px" : w + offset - mouseX + "px");
        document.body.style.cursor = "ew-resize";
    } else {
        html.style.setProperty(a, p ? h - offset + mouseY + "px" : h + offset - mouseY + "px");
        document.body.style.cursor = "ns-resize";
    }
    draggerClick = setTimeout(() => { if (draggerClick != null) { dragging(e, p, offset, w, h, a) } }, 1);
}

function dragOff(e) {
    clearTimeout(draggerClick);
    draggerClick = null;
    document.body.style.cursor = "initial";
}