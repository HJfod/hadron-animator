/// main

const html = document.documentElement;

const canvas = document.getElementById("preview");
const ctx = canvas.getContext("2d");

const tl_can = document.getElementById("timeline");
const tl_ctx = tl_can.getContext("2d");

let grid = false;
let snap = false;
let playing = false;
let mouse_x, mouse_y;
let selected;
let dragger_click;
let layers = [
    { name: "Master", contents: [] }
];

function handleSliderInput(e) {
    document.querySelectorAll(`[data-link="${e.target.getAttribute("data-link")}"]`)[0].innerHTML = e.target.value;
};

document.addEventListener("mousemove", (event) => {
    mouse_x = event.pageX;
    mouse_y = event.pageY;
});

document.addEventListener("mouseup", drag_off());

const menu = [
    {
        name: "File",
        menu: "New[#Ctrl+N]=>;Save[#Ctrl+S]=>;Open[#Ctrl+O]=>;sep;Quit[#Alt+F4]=>window.close()"
    },
    {
        name: "Tools",
        menu: "Add object=>{Add line=>;Add shape=>;Add particles=>};Add image=>;Add text=>;sep;Toggle grid[noclose#Ctrl+G]=>toggle_grid()"
    },
    {
        name: "Window",
        menu: "Nested menu=>{Nah=>;No=>;Even nesteder menu=>{Never[#fag]=>;Nestedest menu=>{Finalest nestedest menu=>{awesome sauce=>}};Aldrig=>};Nope=>}"
    },
    {
        name: "Help",
        menu: "Reload app[#Ctrl+R]=>ipc.send(\"app\",`{\"action\":\"w_reload\"}`);Toggle Dev Tools[#Ctrl+Shift+I]=>ipc.send(\"app\",`{\"action\":\"toggle_dev\"}`)"
    }
];

const sett = {
    grid_size: 16,
    ratio: 4 / 3,
    tl_size: 40,
    tl_fnt_sz: 16,
    v_lgt: 10,
    layer_size: 96,
    layer_limit: 10,
    tl_snap: 8
}

function add(o) {
    
}

function toggle_grid() {
    grid ? grid = false : grid = true;
    g = document.getElementById("t_grid");
    if (g.classList.contains("toggled")) {
        g.classList.remove("toggled");
    } else {
        g.classList.add("toggled");
    }
}

function toggle_snap() {
    snap ? snap = false : snap = true;
    g = document.getElementById("t_snap");
    if (g.classList.contains("toggled")) {
        g.classList.remove("toggled");
    } else {
        g.classList.add("toggled");
    }
}

function resize_grid(e) {
    sett.grid_size = Math.pow(e.target.value * 4, 2);
}

ipc.on("app", (event, arg) => {
    arg = JSON.parse(arg);
    switch (arg.action) {
        case "toggle-grid":
            toggle_grid();
            break;
    }
});

function drag_on(e) {
    e.preventDefault();
    let obj = arr(e.target.parentElement.children);
    let i = obj.indexOf(e.target);
    let p, m, off = 0, aff = e.target.getAttribute("affect");

    let w, h;
    switch (e.target.getAttribute("direction")) {
        case "left-right":
            w = getCSS(aff);
            off = mouse_x;
            p = 1;
            break;
        case "right-left":
            w = getCSS(aff);
            off = mouse_x;
            p = 0;
            break;
        case "top-down":
            h = getCSS(aff);
            off = mouse_y;
            p = 1;
            break;
        case "down-top":
            h = getCSS(aff);
            off = mouse_y;
            p = 0;
            break;
    }

    dragging(e.target, p, off, w, h, aff);
}

function dragging(e, p, offset, w, h, a) {
    if (w) {
        html.style.setProperty(a, p ? w - offset + mouse_x + "px" : w + offset - mouse_x + "px");
        document.body.style.cursor = "ew-resize";
    } else {
        html.style.setProperty(a, p ? h - offset + mouse_y + "px" : h + offset - mouse_y + "px");
        document.body.style.cursor = "ns-resize";
    }
    dragger_click = setTimeout(() => { if (dragger_click != null) { dragging(e, p, offset, w, h, a) } }, 1);
}

function drag_off(e) {
    clearTimeout(dragger_click);
    dragger_click = null;
    document.body.style.cursor = "initial";
}