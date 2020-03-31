const settings = document.getElementsByTagName('app-settings')[0];

const ion_ipc = require('electron').ipcRenderer;
const ion_html = document.documentElement;
const ion_$ = require('jquery');
const ion_remote = require('electron').remote;

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

ion_$(document).mousemove((e) => {
    mouse_x = e.pageX;
    mouse_y = e.pageY;
});

/*   settings   */

document.title = settings.getAttribute('app-name');
ion_html.style.setProperty('--ion-app-main-color', settings.getAttribute('main-color'));
ion_html.style.setProperty('--ion-app-extra-color', settings.getAttribute('extra-color'));
ion_html.style.setProperty('--ion-app-shadow-color', settings.getAttribute('shadow-color'));
ion_html.style.setProperty('--ion-app-panel-border-color', settings.getAttribute('darker-color'));
ion_html.style.setProperty('--ion-app-dark-color', settings.getAttribute('dark-color'));
ion_html.style.setProperty('--ion-app-font', settings.getAttribute('font'));
ion_html.style.setProperty('--ion-app-text-color', settings.getAttribute('text-color'));

/*   titlebar   */

class AppTitlebar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {

        let titlebar_buttons = [];
        if (this.hasAttribute('onhomeclick')) {
            let h = document.createElement('button');
            h.setAttribute('class', 'app-home-button hm');
            h.setAttribute('onclick', this.getAttribute('onhomeclick'));
            h.setAttribute('data-tool', 'Home (F2)');
            h.innerHTML = '\u2616';
            this.appendChild(h);
        }

        let titlebar_text = document.createElement('text');
        titlebar_text.innerHTML = this.getAttribute('name');
        titlebar_text.setAttribute('class', 'app-home-title');
        this.appendChild(titlebar_text);

        if (!this.hasAttribute('no-mz')) {
            let b_mz = document.createElement('button');
            ion_$(b_mz).attr('class', 'app-home-button mz').attr('onclick', `ion_ipc.send("ion-app",'{ "name": "mz", "val": "${ion_remote.getCurrentWindow().id}" }')`).attr('data-tool', 'Minimize (Ctrl + M)').html('\u2500');
            if (this.hasAttribute('disable-mz')) {
                ion_$(b_mz).addClass('app-home-disabled').attr('disabled','true');
            }
            this.appendChild(b_mz);
        }

        if (!this.hasAttribute('no-fs')) {
            let b_fs = document.createElement('button');
            ion_$(b_fs).attr('class', 'app-home-button fs').attr('onclick', `ion_ipc.send("ion-app",'{ "name": "fs", "val": "${ion_remote.getCurrentWindow().id}" }')`).attr('data-tool', 'Fullscreen (F11)').html('\u2610');
            if (this.hasAttribute('disable-fs')) {
                ion_$(b_fs).addClass('app-home-disabled').attr('disabled', 'true');
            }
            this.appendChild(b_fs);
        }

        let b_cl = document.createElement('button');
        ion_$(b_cl).attr('class', 'app-home-button close').attr('onclick', 'window.close()').attr('data-tool', 'Close App (Alt + F4)').html('\u2715');
        this.appendChild(b_cl);

        ion_html.style.setProperty('--ion-app-titlebar-color', this.getAttribute('background-color'));
        ion_html.style.setProperty('--ion-app-home-title-color', this.getAttribute('text-color'));
    }
}

/*   panels   */

function sizePanelOrGroup(o) {
    let size = o.getAttribute('size');

    if (size) {
        if (o.parentNode.getAttribute('direction') === 'left-right') {
            o.style.width = size;
            o.style.flexGrow = 0;
        } else {
            o.style.height = size;
            o.style.flexGrow = 0;
        }
    }
}

class AppGroup extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        switch (this.getAttribute('direction')) {
            case 'top-down':
                this.style.flexDirection = 'column';
                break;
            case 'left-right': default:
                this.style.flexDirection = 'row';
                break;
        }

        sizePanelOrGroup(this);
    }
}

class AppPanel extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        sizePanelOrGroup(this);
    }
}

class AppMain extends HTMLElement {
    constructor() {
        super();
    }
}

class AppDragger extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.setAttribute('class', `app-dragger ${this.parentNode.getAttribute('direction')}`);
        let r = btoa(Math.round(Math.random()*256));
        while (document.getElementsByName(r).length) {
            r = btoa(Math.round(Math.random() * 256));
        }
        this.setAttribute('name',r);
        this.setAttribute('data-menu', `Toggle panel=>toggle_panel("`+ r + `")`);
        this.addEventListener('mousedown', drag_on);
    }
}

customElements.define('app-titlebar', AppTitlebar);
customElements.define('app-group', AppGroup);
customElements.define('app-panel', AppPanel);
customElements.define('app-main', AppMain);
customElements.define('app-dragger', AppDragger);

/*   draggers   */

let dragger_click;

function toggle_panel(which) {
    which = document.getElementsByName(which)[0];
    console.log(which);
    let obj = arr(which.parentElement.children);
    let i = obj.indexOf(which);
    let o, refer = which.getAttribute('refer');

    switch (refer) {
        case 'above':
            o = obj[i - 1];
            break;
        case 'below':
            o = obj[i + 1];
            break;
        default:
            if (obj[i - 1].hasAttribute('size')) {
                o = obj[i - 1];
            } else if (obj[i + 1].hasAttribute('size')) {
                o = obj[i + 1];
            } else {
                o = obj[i - 1];
            }
    }

    if (o.style.display !== 'none') {
        o.style.display = 'none';
    } else {
        o.style.display = 'flex';
    }
}

function drag_on(e) {
    e.preventDefault();
    let obj = arr(e.target.parentElement.children);
    let i = obj.indexOf(e.target);
    let o, p, m, off = 0, refer = e.target.getAttribute('refer');

    switch (refer) {
        case 'above':
            o = obj[i - 1]; p = 1; m = -1;
            break;
        case 'below':
            o = obj[i + 1]; p = 0; m = 1;
            break;
        default:
            if (obj[i - 1].hasAttribute('size')) {
                o = obj[i - 1]; p = 1; m = -1;
            } else if (obj[i + 1].hasAttribute('size')) {
                o = obj[i + 1]; p = 0; m = 1;
            } else {
                o = obj[i - 1]; p = 1; m = -1; o.style.flexGrow = '0';
            }
    }

    let w, h;
    if (e.target.getAttribute('class') == 'app-dragger left-right') {
        w = (Number(o.style.width.replace('px', '')));
        off = mouse_x;
    } else {
        h = (Number(o.style.height.replace('px', '')));
        off = mouse_y;
    }

    dragging(e.target, o, p, off, w, h);
}

function dragging(e, o, p, offset, w, h) {
    let prev_w = o.style.width, prev_h = o.style.height;

    if (e.getAttribute('class') == 'app-dragger left-right') {
        o.style.width = p ? w - offset + mouse_x + 'px' : w + offset - mouse_x + 'px';
        document.body.style.cursor = 'ew-resize';
        if (o.hasAttribute('min-size')) {
            if (Number(o.style.width.replace('px', '')) < Number(o.getAttribute('min-size').replace('px', ''))) {
                o.style.width = o.getAttribute('min-size');
            }
        }
    } else {
        o.style.height = p ? h - offset + mouse_y + 'px' : h + offset - mouse_y + 'px';
        document.body.style.cursor = 'ns-resize';
        if (o.hasAttribute('min-size')) {
            if (Number(o.style.height.replace('px', '')) < Number(o.getAttribute('min-size').replace('px', ''))) {
                o.style.height = o.getAttribute('min-size');
            }
        }
    }
    
    if (ion_$('app-main')[0].scrollWidth > ion_$('app-main').innerWidth() + 7) {
        if (o.style.width > prev_w) {
            o.style.width = prev_w;
        }
    }

    if (ion_$('app-main')[0].scrollHeight > ion_$('app-main').innerHeight()) {
        if (o.style.height > prev_h) {
            o.style.height = prev_h;
        }
    }

    dragger_click = setTimeout(() => { if (dragger_click != null) { dragging(e, o, p, offset, w, h) } }, 1 );
}

function drag_off(e) {
    clearTimeout(dragger_click);
    dragger_click = null;
    document.body.style.cursor = 'initial';
}

let stop_resize_while_loop = [false,false];     /*   width, height   */

window.onresize = (e) => {
    let a = ion_$('app-main');
    let ele = [ion_$('app-panel'), ion_$('app-group')];
    let i = 0;
    let limit = { loop: 600, min: 20, inc: 2 };
    while ((a[0].scrollWidth > a.innerWidth() + 7) && !stop_resize_while_loop[0]) {
        ele.forEach((item) => {
            item.each((index) => {
                let min = limit.min;
                if (item[index].hasAttribute('min-size')) {
                    min = Number(item[index].getAttribute('min-size').replace('px', ''));
                }
                if (Number(item[index].style.width.replace('px', '')) > min) {
                    item[index].style.width = (Number(item[index].style.width.replace('px', '')) - limit.inc) + 'px';
                }
            });
        });
        i++;
        if (i > limit.loop) {
            stop_resize_while_loop[0] = true;
            break;
        }
    }

    let j = 0;
    while ((a[0].scrollHeight > a.innerHeight() + 7) && !stop_resize_while_loop[1]) {
        ele.forEach((item) => {
            item.each((index) => {
                let min = limit.min;
                if (item[index].hasAttribute('min-size')) {
                    min = Number(item[index].getAttribute('min-size').replace('px', ''));
                }
                if (Number(item[index].style.height.replace('px', '')) > min) {
                    item[index].style.height = (Number(item[index].style.height.replace('px', '')) - limit.inc) + 'px';
                }
            });
        });
        j++;
        if (j > limit.loop) {
            stop_resize_while_loop[1] = true;
            break;
        }
    }

    if (a[0].scrollWidth <= a.innerWidth() + 7) {
        stop_resize_while_loop[0] = false;
    }
    if (a[0].scrollHeight <= a.innerHeight() + 7) {
        stop_resize_while_loop[1] = false;
    }
};