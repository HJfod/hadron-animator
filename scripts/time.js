function draw_mouse() {
    tl_ctx.fillStyle = 'rgba(255,255,255,0.4)';
    let x = mouse_x - getCSS('--pad') - getCSS('--pad-small') - $('#timeline').position().left - canvas.width / sett.tl_size / 2;
    if (x + canvas.width / sett.tl_size / 2 < sett.layer_size) { return };
    if (snap) {
        x = Math.round(x / (canvas.width / sett.tl_size)) * (canvas.width / sett.tl_size);
    }
    tl_ctx.fillRect(x, 0, canvas.width / sett.tl_size, tl_can.height);
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

    tl_ctx.fillStyle = 'rgba(255,255,255,0.5)';
    for (let i = 0; i < tl_can.width / sett.tl_size * 24; i += 1 * div) {
        tl_ctx.fillRect(i * canvas.width / sett.tl_size + sett.layer_size, 0, 1, tl_can.height);
    }

    tl_ctx.fillStyle = colorLuminance(getCSS('--c-dark'), -.6);
    tl_ctx.fillRect(0, $('.timeline_container').scrollTop(), tl_can.width, sett.tl_fnt_sz);

    tl_ctx.fillStyle = getCSS('--c-lightest');
    for (let i = 0; i < canvas.width / sett.tl_size * 24; i += 1 * div) {
        tl_ctx.font = `${sett.tl_fnt_sz / 1.2}px Segoe UI`;
        tl_ctx.fillText(i / 16 + 's', i * canvas.width / sett.tl_size + sett.tl_fnt_sz / 4 + sett.layer_size, $('.timeline_container').scrollTop() + sett.tl_fnt_sz / 1.2);
    }

    tl_ctx.fillStyle = colorLuminance(getCSS('--c-dark'), -.5);
    tl_ctx.fillRect(-$('#timeline').position().left, 0, sett.layer_size, tl_can.height);

    for (let i in layers) {
        tl_ctx.fillStyle = colorLuminance(getCSS('--c-dark'), (i % 2 > 0) ? .2 : 0);
        tl_ctx.fillRect(-$('#timeline').position().left, i * sett.tl_fnt_sz + sett.tl_fnt_sz, sett.layer_size, sett.tl_fnt_sz);
        tl_ctx.fillStyle = getCSS('--c-lightest');
        tl_ctx.fillText(layers[i].name, -$('#timeline').position().left + sett.tl_fnt_sz, i * sett.tl_fnt_sz / 1.1 + sett.tl_fnt_sz * 2);
    }
}

function change_time(o) {
    sett.tl_size = $(`input[data-link=${o}]`).val() * 2;
    tl_can.width = Math.pow($(`input[data-link=${o}]`).val(), -1) * 1920 * 100 + sett.layer_size;
}


function draw_timeline() {
    if ($('#timeline').is(':hover')) {
        draw_mouse();
    }
    draw_time();
}