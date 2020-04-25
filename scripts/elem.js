/// custom elements

class AppHead extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        let tb_img = document.createElement('img');
        $(tb_img).attr('src', path.join(__dirname + this.getAttribute('img-src'))).addClass('app-home-logo').attr('width', `${getCSS('--s-titlebar')}px`);
        this.appendChild(tb_img);
        console.log($(tb_img).attr('src'));

        /*
        let titlebar_text = document.createElement('text');
        titlebar_text.innerHTML = document.title;
        titlebar_text.setAttribute('class', 'app-home-title');
        this.appendChild(titlebar_text);
        */

        for (let i in menu) {
            let b_n = document.createElement('button');
            $(b_n).attr('class', 'app-home-button menu').text(menu[i].name);
            this.appendChild(b_n);
            $(b_n).attr('onclick', `open_contextmenu('${menu[i].menu}',${i * getCSS('--pad') * 2 + getCSS('--pad')},${getCSS('--s-titlebar')},0,true,true)`)
        }

        let buff = document.createElement('div');
        $(buff).addClass('app-home-buffer');
        this.appendChild(buff);

        if (!this.hasAttribute('no-mz')) {
            let b_mz = document.createElement('button');
            $(b_mz).attr('class', 'app-home-button mz').attr('onclick', `ipc.send("app",'{ "action": "mz", "val": "${remote.getCurrentWindow().id}" }')`).attr('data-tool', 'Minimize (Ctrl + M)').html('\u2500');
            if (this.hasAttribute('disable-mz')) {
                $(b_mz).addClass('app-home-disabled').attr('disabled', 'true');
            }
            this.appendChild(b_mz);
        }

        if (!this.hasAttribute('no-fs')) {
            let b_fs = document.createElement('button');
            $(b_fs).attr('class', 'app-home-button fs').attr('onclick', `ipc.send("app",'{ "action": "fs", "val": "${remote.getCurrentWindow().id}" }')`).attr('data-tool', 'Fullscreen (F11)').html('\u2610');
            if (this.hasAttribute('disable-fs')) {
                $(b_fs).addClass('app-home-disabled').attr('disabled', 'true');
            }
            this.appendChild(b_fs);
        }

        let b_cl = document.createElement('button');
        $(b_cl).attr('class', 'app-home-button close').attr('onclick', 'window.close()').attr('data-tool', 'Close App (Alt + F4)').html('\u2715');
        this.appendChild(b_cl);
    }
}

class AppDragger extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        let dir;
        switch (this.getAttribute('direction')) {
            case 'top-down': case 'down-top': dir = 'top-down'; break;
            case 'left-right': case 'right-left': dir = 'left-right'; break;
        }
        this.setAttribute('class', `app-dragger ${dir}`);
        let r = btoa(Math.round(Math.random() * 256));
        while (document.getElementsByName(r).length) {
            r = btoa(Math.round(Math.random() * 256));
        }
        this.setAttribute('name', r);
        this.setAttribute('data-menu', `Toggle panel=>toggle_panel("` + r + `")`);
        this.addEventListener('mousedown', drag_on);
    }
}

customElements.define('app-head', AppHead);
customElements.define('app-dragger', AppDragger);