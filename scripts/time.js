let mx, my;

function draw_mouse() {
    let x = mx - getCSS('--pad') - sett.layer_size, y = -my + sett.tl_fnt_sz;
    tl_ctx.fillStyle = getCSS('--c-lightest');
    tl_ctx.globalAlpha = 0.1;
    if (snap) {
        x = Math.round(x / (tl_can.width / sett.tl_size)) * (tl_can.width / sett.tl_size);
    }
    y = Math.round(y / (tl_can.height / sett.tl_fnt_sz * 1.28)) * (tl_can.height / sett.tl_fnt_sz * 1.28);

    if (x + tl_can.width / sett.tl_size / 2 > + tl_can.width - sett.layer_size || x + tl_can.width / sett.tl_size / 2 + $('#timeline').position().left < 0) { return };

    tl_ctx.fillRect(x + sett.layer_size, sett.tl_fnt_sz + $('.timeline_container').scrollTop(), tl_can.width / sett.tl_size, tl_can.height);
    if (y > -sett.tl_fnt_sz * layers.length && y < sett.tl_fnt_sz) {
        tl_ctx.globalAlpha = 0.3;
        tl_ctx.fillRect(x + sett.layer_size, -y + sett.tl_fnt_sz, tl_can.width / sett.tl_size, sett.tl_fnt_sz);
    }

    tl_ctx.globalAlpha = 1;
}

function draw_time() {
    let div = Math.round(sett.tl_size / 24);
    if (div < 1) { div = 1; }

    for (let i in layers) {
        if (i % 2 > 0) {
            tl_ctx.globalAlpha = 0.15;
            tl_ctx.fillStyle = getCSS('--c-darkest');
            tl_ctx.fillRect(-$('#timeline').position().left + sett.layer_size, i * sett.tl_fnt_sz + sett.tl_fnt_sz, tl_can.width, sett.tl_fnt_sz)
        }
        tl_ctx.globalAlpha = 1;
    }

    tl_ctx.fillStyle = getCSS('--c-lightest');
    tl_ctx.globalAlpha = 0.5;
    for (let i = 0; i < tl_can.width / sett.tl_size * 24; i += 1 * div) {
        tl_ctx.fillRect(i * tl_can.width / sett.tl_size + sett.layer_size - 1, 0, 2, tl_can.height);
    }
    tl_ctx.globalAlpha = 0.15;
    for (let i = 0; i < tl_can.width / sett.tl_size * 24; i++) {
        tl_ctx.fillRect(i * tl_can.width / sett.tl_size + sett.layer_size - 1, 0, 2, tl_can.height);
    }
    tl_ctx.globalAlpha = 1;

    tl_ctx.fillStyle = colorLuminance(getCSS('--c-dark'), -.6);
    tl_ctx.fillRect(0, $('.timeline_container').scrollTop(), tl_can.width, sett.tl_fnt_sz);

    tl_ctx.fillStyle = getCSS('--c-lightest');
    for (let i = 0; i < tl_can.width / sett.tl_size * 24; i += 1 * div) {
        tl_ctx.font = `${sett.tl_fnt_sz / 1.2}px Segoe UI`;
        tl_ctx.fillText(i / 16 + 's', i * tl_can.width / sett.tl_size + sett.tl_fnt_sz / 4 + sett.layer_size, $('.timeline_container').scrollTop() + sett.tl_fnt_sz / 1.2);
    }

    tl_ctx.fillStyle = colorLuminance(getCSS('--c-dark'), -.5);
    tl_ctx.fillRect(-$('#timeline').position().left, 0, sett.layer_size, tl_can.height);

    for (let i in layers) {
        (selected == i) ? tl_ctx.fillStyle = colorLuminance(getCSS('--c-yes'), -.4) : tl_ctx.fillStyle = colorLuminance(getCSS('--c-dark'), (i % 2 > 0) ? .2 : 0);
        tl_ctx.fillRect(-$('#timeline').position().left, i * sett.tl_fnt_sz + sett.tl_fnt_sz, sett.layer_size, sett.tl_fnt_sz);
        tl_ctx.fillStyle = getCSS('--c-lightest');
        tl_ctx.fillText(layers[i].name, -$('#timeline').position().left + sett.tl_fnt_sz, i * sett.tl_fnt_sz + sett.tl_fnt_sz * 1.8);
    }

    tl_ctx.fillStyle = colorLuminance(getCSS('--c-dark'), -.8);
    tl_ctx.fillRect(-$('#timeline').position().left, $('.timeline_container').scrollTop(), sett.layer_size, sett.tl_fnt_sz);
}

function add_layer(l = false) {
    if (l) {
        layers.splice(selected, 1);
        selected = undefined;
        $('#del_layer').hide();
    } else {
        if (layers.length < sett.layer_limit) {
            layers[layers.length] = { name: `Layer ${layers.length}`, contents: [] };
        }
    }
}

function tl_click() {
    for (let i in layers) {
        if (mx > -$('#timeline').position().left && mx < -$('#timeline').position().left + sett.layer_size && my > i * sett.tl_fnt_sz + sett.tl_fnt_sz / 2 && my < i * sett.tl_fnt_sz + sett.tl_fnt_sz + sett.tl_fnt_sz / 2) {
            selected = i;
            $('#del_layer').show();
        } else {
            if (selected == i) {
                selected = undefined;
                $('#del_layer').hide();
            }
        }
    }
}

function change_time(o) {
    sett.tl_size = $(`input[data-link=${o}]`).val() * 2;
    tl_can.width = Math.pow($(`input[data-link=${o}]`).val(), -1) * window.innerWidth * 24 * sett.v_lgt + sett.layer_size;
}

function draw_timeline() {
    mx = mouse_x - getCSS('--pad-small') - $('#timeline').position().left - tl_can.width / sett.tl_size / 2;
    my = -($('.timeline_container').position().top - mouse_y - $('.timeline_container').scrollTop() + getCSS('--pad') + getCSS('--pad-small'));

    draw_time();
    if ($('#timeline').is(':hover')) {
        draw_mouse();
    }
}