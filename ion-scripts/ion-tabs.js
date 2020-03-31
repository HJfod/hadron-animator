function ion_tabs_switch_to(where, tab) {
    const pages = arr(document.getElementsByTagName('app-pages'));
    for (i in pages) {
        if (pages[i].getAttribute('from') === where) {
            arr(pages[i].children).forEach((item) => {
                item.style.display = 'none';
                if (item.getAttribute('link') === tab) {
                    item.style.display = 'initial';
                }
            });
            break;
        }
    }
    const tabs = arr(document.getElementsByTagName('app-tabs'));
    for (i in tabs) {
        if (tabs[i].getAttribute('destination') === where) {
            arr(tabs[i].children).forEach((item) => {
                item.setAttribute('class', '');
                item.style.color = tabs[i].getAttribute('text-color');
                item.style.backgroundColor = '';
                if (item.getAttribute('link') === tab) {
                    item.setAttribute('class', 'app-tab-selected');
                    item.style.backgroundColor = tabs[i].getAttribute('selected-color');
                    item.style.color = tabs[i].getAttribute('selected-text-color');
                }
            });
            break;
        }
    }
}

class AppTabs extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        arr(this.children).forEach((item) => {
            if (!this.hasAttribute('text-color')) {
                this.setAttribute('text-color', 'var(--ion-app-dark-color)');
            }
            if (!this.hasAttribute('selected-text-color')) {
                this.setAttribute('selected-text-color','var(--ion-app-text-color)')
            }
            if (!this.hasAttribute('selected-color')) {
                this.setAttribute('selected-color', 'var(--ion-app-main-color)')
            }
            item.style.height = this.getAttribute('tab-height');
            item.style.fontSize = Number(this.getAttribute('tab-height').replace('px', '')) * 0.65 + 'px';
            if (item.hasAttribute('default')) {
                ion_tabs_switch_to(this.getAttribute('destination'), item.getAttribute('link'));
            }
        });
    }
}

class AppTab extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.setAttribute('onclick', `ion_tabs_switch_to("${this.parentElement.getAttribute('destination')}","${this.getAttribute('link')}")`);
        this.innerHTML = this.getAttribute('name');
    }
}

customElements.define('app-tabs', AppTabs);
customElements.define('app-tab', AppTab);