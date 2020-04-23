const $ = require('jquery');
const remote = require('electron').remote;
const ipc = require('electron').ipcRenderer;
const html = document.documentElement;

const canvas = document.getElementById('preview');
const ctx = canvas.getContext('2d');

const tl_can = document.getElementById('timeline');
const tl_ctx = tl_can.getContext('2d');

let grid = false;
let snap = false;
let playing = false;
let mouse_x, mouse_y;
let selected;
let layers = [
    { name: 'Master', contents: [] }
];

$('input[type=range]').on('input', (e) => {
    $(`[data-link=${$(e.target).attr('data-link')}]`).text($(e.target).val());
    eval($(e.target).attr('data-slide').toString().replace('event',`'${$(e.target).attr('data-link')}'`));
});

$(document).mousemove((e) => {
    mouse_x = e.pageX;
    mouse_y = e.pageY;
});

const sett = {
    grid_size: 16,
    ratio: 4 / 3,
    tl_size: 32,
    tl_fnt_sz: 16,
    v_lgt: 1,
    layer_size: 96,
    layer_limit: 10
}

function arr(list) {
    return Array.prototype.slice.call(list);
}

function getCSS(v) {
    let g = (getComputedStyle(html).getPropertyValue(v)).replace('px', '');
    if (isNaN(g)) {
        return g;
    } else {
        return Number(g);
    }
}

function colorLuminance(hex, lum) {	// thanks sitepoint.com

    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
    }

    return rgb;
}

function add(o) {
    
}

function toggle_grid() {
    grid ? grid = false : grid = true;
    $('#t_grid').toggleClass('toggled');
}

function toggle_snap() {
    snap ? snap = false : snap = true;
    $('#t_snap').toggleClass('toggled');
}

function resize_grid(o) {
    sett.grid_size = Math.pow($(`input[data-link=${o}]`).val() * 4, 2);
}

ipc.on('app', (event, arg) => {
    arg = JSON.parse(arg);
    switch (arg.action) {
        case 'toggle-grid':
            toggle_grid();
            break;
    }
});