/// custom elements

class AppHead extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        let tbIMG = document.createElement("img");
        tbIMG.setAttribute("src", this.getAttribute("img-src"));
        tbIMG.classList.add("app-home-logo");
        tbIMG.setAttribute("width", `${getCSS("--s-titlebar")}px`);
        this.appendChild(tbIMG);
        console.log(tbIMG.getAttribute("src"));

        /*
        let titlebar_text = document.createElement("text");
        titlebar_text.innerHTML = document.title;
        titlebar_text.setAttribute("class", "app-home-title");
        this.appendChild(titlebar_text);
        */

        for (let i in menu) {
            let bNew = document.createElement("button");
            bNew.setAttribute("class", "app-home-button menu");
            bNew.innerText = menu[i].name;
            this.appendChild(bNew);
            bNew.setAttribute("onclick", `open_contextmenu('${menu[i].menu}',Number(${i} * getCSS("--pad") * 2 + getCSS("--pad")),getCSS("--s-titlebar"),0,true,true)`);
        }

        let buff = document.createElement("div");
        buff.classList.add("app-home-buffer");
        this.appendChild(buff);

        if (!this.hasAttribute("no-mz")) {
            let bMZ = document.createElement("button");
            bMZ.setAttribute("class", "app-home-button mz");
            bMZ.setAttribute("data-tool", "Minimize (Ctrl + M)");
            bMZ.innerHTML = "\u2500";
            if (this.hasAttribute("disable-mz")) {
                bMZ.classList.add("app-home-disabled");
                bMZ.setAttribute("disabled", "true");
            }
            this.appendChild(bMZ);
        }

        if (!this.hasAttribute("no-fs")) {
            let bFS = document.createElement("button");
            bFS.setAttribute("class", "app-home-button fs");
            bFS.setAttribute("data-tool", "Fullscreen (F11)");
            bFS.innerHTML = "\u2610";
            if (this.hasAttribute("disable-fs")) {
                bFS.classList.add("app-home-disabled")
                bFS.setAttribute("disabled", "true");
            }
            this.appendChild(bFS);
        }

        let bCL = document.createElement("button");
        bCL.setAttribute("class", "app-home-button close");
        bCL.setAttribute("onclick", "window.close()");
        bCL.setAttribute("data-tool", "Close App (Alt + F4)");
        bCL.innerHTML = "\u2715";
        this.appendChild(bCL);
    }
}

class AppDragger extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        let dir;
        switch (this.getAttribute("direction")) {
            case "top-down": case "down-top": dir = "top-down"; break;
            case "left-right": case "right-left": dir = "left-right"; break;
        }
        this.setAttribute("class", `app-dragger ${dir}`);
        let r = btoa(Math.round(Math.random() * 256));
        while (document.getElementsByName(r).length) {
            r = btoa(Math.round(Math.random() * 256));
        }
        this.setAttribute("name", r);
        this.setAttribute("data-menu", `Toggle panel=>toggle_panel("` + r + `")`);
        this.addEventListener("mousedown", dragOn);
    }
}

customElements.define("app-head", AppHead);
customElements.define("app-dragger", AppDragger);