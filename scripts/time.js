function draw_mouse() {
    tl_ctx.fillStyle = 'rgba(255,255,255,0.4)';
    let x = mouse_x - getCSS('--pad') - getCSS('--pad-small') - $('#timeline').position().left - canvas.width / sett.tl_size / 2;
    if (snap) {
        x = Math.round(x / (canvas.width / sett.tl_size)) * (canvas.width / sett.tl_size);
    }
    tl_ctx.fillRect(x, 0, canvas.width / sett.tl_size, tl_can.height);
}

function draw_time() {
    tl_ctx.fillStyle = getCSS('--c-lightest');

    let div = Math.round(sett.tl_size / 24);
    if (div < 1) { div = 1; }

    for (let i = 0; i < canvas.width / sett.tl_size * 24; i += 1 * div) {
        tl_ctx.font = `${sett.tl_fnt_sz}px Segoe UI`;
        tl_ctx.fillText(i / 16, i * canvas.width / sett.tl_size + sett.tl_fnt_sz / 4, $('#timeline').position().top + sett.tl_fnt_sz);
    }

    tl_ctx.fillStyle = 'rgba(255,255,255,0.5)';
    for (let i = 0; i < canvas.width / sett.tl_size * 24; i += 1 * div) {
        tl_ctx.fillRect(i * canvas.width / sett.tl_size,0,1,canvas.height);
    }
}

function change_time(o) {
    sett.tl_size = $(`input[data-link=${o}]`).val() * 2;
    tl_can.width = Math.pow($(`input[data-link=${o}]`).val(), -1) * 1920 * 100;
}


function draw_timeline() {
    if ($('#timeline').is(':hover')) {
        draw_mouse();
    }
    draw_time();
}