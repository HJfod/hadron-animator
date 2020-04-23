let app_tip_timeout = 1000;

$('[data-menu]').contextmenu((e) => {
    e.preventDefault();
    let ta = $(e.target);

    let i = 0;
    while (ta.attr('data-menu') == undefined) {
        if (i < 50) {
            i++;
        } else {
            return false;
        }
        ta = ta.parent();
    }

    open_contextmenu(ta.attr('data-menu'));
});

function open_contextmenu(menu, x = null, y = null, level = 0) {
    let e = arr(document.getElementsByClassName('app-contextmenu'));
    e.forEach((item, index) => {
        if (Number(item.getAttribute('level')) >= Number(level)) {
            $(item).remove();
        }
    });

    let m = document.createElement('div');
    m.setAttribute('class', 'app-contextmenu');
    m.setAttribute('level', level);

    let text = [];
    let sub = menu;
    let count = 0;
    let collect = '';

    if (sub.startsWith('{')) {
        sub = sub.substring(1, sub.length - 1);
    }

    while (sub.length > 0) {
        switch (sub[0]) {
            case ';':
                if (!count) {
                    text[text.length] = collect;
                    collect = '';
                } else {
                    collect += sub[0];
                }
                break;
            case '{':
                count++;
                collect += sub[0];
                break;
            case '}':
                count--;
                collect += sub[0];
                break;
            default:
                collect += sub[0];
        }
        if (sub.length > 1) {
            sub = sub.substring(1);
        } else {
            text[text.length] = collect;
            sub = '';
        }
    }

    let add = [];

    for (let i in text) {
        let button = document.createElement('button');
        button.setAttribute('class', 'app-contextmenu-option');
        button.innerHTML = text[i].split('=>').shift();

        let action = text[i].substring(text[i].split('=>').shift().length + 2);

        if (action) {
            if (action.startsWith('{')) {
                add[add.length] = { a: action, b: button, i: i };
            } else {
                button.setAttribute('onmouseup', 'close_menu(true);' + action);
            }
        }

        m.appendChild(button);
    }

    document.body.appendChild(m);

    let mex = mouse_x, mey = mouse_y, mw = Number($(m).css('width').replace('px', '')), mh = Number($(m).css('height').replace('px', ''));

    if ((x && y) !== null) {
        mex = x;
        mey = y;
    }

    if (mex > window.innerWidth - mw) {
        mex = mex - mw;
    }
    if (mey > window.innerHeight - mh) {
        mey = mey - mh;
    }

    // console.log(mex + ',' + mey);

    $(m).css('top', mey + 'px').css('left', mex + 'px');

    add.forEach((item, index) => {
        let i = Number((getComputedStyle(html).getPropertyValue('--s-menu')).replace('px', ''));
        let si = Number((getComputedStyle(html).getPropertyValue('--pad-small')).replace('px', '')) * 2;

        item.b.setAttribute('onmouseup', `open_contextmenu("${item.a}",${mex + mw + si},${mey + item.i * i},${level + 1})`);
    });
}

function close_menu(click = false) {
    let hover = false;
    let e = arr(document.getElementsByClassName('app-contextmenu'));
    e.forEach((item, index) => {
        if ($(item).is(':hover')) {
            hover = true;
        }
    });
    if (!hover || click) {
        $('.app-contextmenu').remove();
    }
}

let tip_timeout;
let current_tip = null;

$('[data-tip]').mouseover((e) => {
    let ta = $(e.target);

    let i = 0;
    while (ta.attr('data-tip') == undefined) {
        if (i < 50) {
            i++;
        } else {
            return false;
        }
        ta = ta.parent();
    }

    current_tip = ta.attr('data-tip');
}).mouseleave((e) => {
    current_tip = null;
});

$(document).mousemove(() => {
    let e = arr(document.getElementsByTagName('app-tooltip'));
    e.forEach((item, index) => {
        $(item).remove();
    });
    clearTimeout(tip_timeout);
    tip_timeout = setTimeout(() => {
        if (current_tip !== null) {
            let tip = document.createElement('app-tooltip');
            $(tip).text(current_tip);
            let mex = mouse_x, mey = mouse_y, mw = Number($(tip).css('width').replace('px', '')), mh = Number($(tip).css('height').replace('px', ''));

            if (mex > window.innerWidth - mw) {
                mex = mex - mw;
            }
            if (mey > window.innerHeight - mh) {
                mey = mey - mh;
            }

            $(tip).css('top', mey + 'px').css('left', mex + 'px');

            document.body.appendChild(tip);
        }
    }, app_tip_timeout);
});

$(document).mouseup((e) => {
    close_menu();
});