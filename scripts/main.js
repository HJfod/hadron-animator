const $ = require('jquery');
const remote = require('electron').remote;
const ipc = require('electron').ipcRenderer;
const html = document.documentElement;

const canvas = document.getElementById('preview');
const ctx = canvas.getContext('2d');

let grid = false;
let snap = false;
let playing = false;

$('input[type=range]').on('input', (e) => {
    $(`[data-link=${$(e.target).attr('data-link')}]`).text($(e.target).val());
    eval($(e.target).attr('data-slide').toString().replace('event',`'${$(e.target).attr('data-link')}'`));
});

const sett = {
    grid_size: 16,
    ratio: 4/3
}

function arr(list) {
    return Array.prototype.slice.call(list);
}

function CSSVarColorLuminance(hex, lum) {	// thanks sitepoint.com

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

$(document).mousemove((e) => {
    mouse_x = e.pageX;
    mouse_y = e.pageY;
});

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

function play() {
    if (playing) {
        playing = false;
        $('#b_play').html('&#9654;');
    } else {
        playing = true;
        $('#b_play').html('&#10074;&#10074;');
    }
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