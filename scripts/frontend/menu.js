/// menus

let app_tipTimeout = 1000;

document.querySelector("[data-menu]").addEventListener("contextmenu", (e) => {
    e.preventDefault();
    let ta = e.target;

    let i = 0;
    while (ta.getAttribute("data-menu") == undefined || ta.getAttribute("data-menu") === "") {
        if (i < 50) {
            i++;
        } else {
            return false;
        }
        ta = ta.parentElement;
    }

    open_contextmenu(ta.getAttribute("data-menu"));
});

function open_contextmenu(menu, x = null, y = null, level = 0, cutTop = false, isMenu = false) {
    let e = arr(document.getElementsByClassName("app-contextmenu"));
    e.forEach((item, index) => {
        if (Number(item.getAttribute("level")) >= Number(level)) {
            item.parentElement.removeChild(item);
        }
    });

    let m = document.createElement("div");
    m.setAttribute("class", `app-contextmenu${cutTop ? " top" : ""}${isMenu ? " ismenu" : ""}`);
    m.setAttribute("level", level);

    let text = [];
    let sub = menu;
    let count = 0;
    let collect = "";

    if (sub.startsWith("{")) {
        sub = sub.substring(1, sub.length - 1);
    }

    while (sub.length > 0) {
        switch (sub[0]) {
            case ";":
                if (!count) {
                    text[text.length] = collect;
                    collect = "";
                } else {
                    collect += sub[0];
                }
                break;
            case "{":
                count++;
                collect += sub[0];
                break;
            case "}":
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
            sub = "";
        }
    }

    let add = [];

    for (let i in text) {
        let button;
        if (text[i] !== "sep") {
            button = document.createElement("button");
            button.setAttribute("class", "app-contextmenu-option");

            let txt = text[i].split("=>").shift();
            let args = "";
            let reg = /\[([^)]+)\]/g;
            if (txt.search(reg) > -1) {
                args = txt.match(reg)[0];
            }
            txt = txt.replace(reg, "");

            button.innerHTML = txt + (args.indexOf("#") < 0 ? "" : ("\u2003").repeat(Math.round(args.split("#").pop().replace("]", "").length / 3)) + "\u2003");
            if (args.indexOf("#") > -1) {
                let scut = document.createElement("text");
                scut.classList.add("app-contextmenu-shortcut");
                scut.innerText = args.split("#").pop().replace("]", "");
                m.appendChild(scut);
            }

            let action = text[i].substring(text[i].split("=>").shift().length + 2);

            if (action && action.startsWith("{")) {
                add[add.length] = { a: action, b: button, i: i };

                button.innerHTML = button.innerHTML + "\u2003";

                let arrow = document.createElement("text");
                arrow.classList.add("app-contextmenu-arrow");
                arrow.innerText = "\u25b8";
                m.appendChild(arrow);
            } else {
                button.setAttribute("onmouseup", `${(args.indexOf("noclose") < 0) ? "closeMenu(true);" : ""} ${action}`);
            }
        } else {
            button = document.createElement("div");
            button.classList.add("app-contextmenu-separator");
        }

        m.appendChild(button);
    }

    document.body.appendChild(m);

    let mex = mouseX, mey = mouseY, mw = m.offsetWidth, mh = m.offsetHeight;
    
    if (x !== null) { 
        mex = x;
    }
    if (y !== null) {
        mey = y;
    }

    if (mex > window.innerWidth - mw) {
        mex = mex - mw;
    }
    if (mey > window.innerHeight - mh) {
        mey = mey - mh;
    }

    // console.log(mex + "," + mey);

    m.style.top = mey + "px";
    m.style.left = mex - getCSS("--pad-small") + "px";

    add.forEach((item, index) => {
        let i = getCSS("--s-menu");

        item.b.setAttribute("onmouseup", `open_contextmenu('${item.a}',${mex + mw},${mey + item.i * i},${level + 1},false,${isMenu})`);
    });
}

function closeMenu(click = false) {
    let hover = false;
    let e = arr(document.getElementsByClassName("app-contextmenu"));
    e.forEach((item, index) => {
        if (isHover(item)) {
            hover = true;
        }
    });
    if (!hover || click) {
        let acm = arr(document.getElementsByClassName("app-contextmenu"));
        acm.forEach((item) => {
            item.remove();
        });
    }
}

let tipTimeout;
let tipTimeoutTime = 1000;
let currentTip = null;

document.querySelector("[data-tip]").addEventListener("mouseenter", (e) => {
    let ta = e.target;

    let i = 0;
    while (ta.getAttribute("data-tip") == undefined) {
        if (i < 50) {
            i++;
        } else {
            return false;
        }
        ta = ta.parentElement;
    }

    currentTip = ta.getAttribute("data-tip");
})
document.querySelector("[data-tip]").addEventListener("mouseleave", (e) => {
    currentTip = null;
});

document.addEventListener("mousemove", (event) => {
    let e = arr(document.getElementsByTagName("app-tooltip"));
    e.forEach((item, index) => {
        item.parentElement.removeChild(item);
    });
    clearTimeout(tipTimeout);
    tipTimeout = setTimeout(() => {
        if (currentTip !== null) {
            let tip = document.createElement("app-tooltip");
            tip.innerText = currentTip;
            let mex = mouseX, mey = mouseY, mw = Number(tip.style.width.replace("px", "")), mh = Number(tip.style.height.replace("px", ""));

            if (mex > window.innerWidth - mw) {
                mex = mex - mw;
            }
            if (mey > window.innerHeight - mh) {
                mey = mey - mh;
            }

            tip.style.top = mey + "px"
            tip.style.left = mex + "px";

            document.body.appendChild(tip);
        }
    }, tipTimeoutTime);
});

document.addEventListener("mouseup", (e) => {
    closeMenu();
    dragOff(e);
});