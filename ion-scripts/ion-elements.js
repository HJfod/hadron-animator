class AppSlider extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        let w = Number(getComputedStyle(ion_html).getPropertyValue('--ion-app-slider-width').replace('px', ''));

        let calc = (Math.round((Number(this.getAttribute('default'))) + Number(getComputedStyle(ion_html).getPropertyValue('--ion-app-slider-size').replace('px', ''))));

        let knob = document.createElement('div');
        knob.setAttribute('class', 'app-slider-thumb');
        knob.style.marginLeft = calc + 'px';
        this.appendChild(knob);

        if (this.hasAttribute('affect')) {
            window[this.getAttribute('affect')] = Number(this.getAttribute('default'));
        }

        this.setAttribute('value', this.getAttribute('default'));

        knob.style.borderColor = CSSVarColorLuminance(getComputedStyle(ion_html).getPropertyValue('--ion-app-dark-color'), 0.2);

        this.setAttribute('onmousedown', 'app_slider_move(event)');
        let t = document.createElement('text');
        t.setAttribute('class', 'app-slider-text');
        t.style.marginLeft = w + (Number(getComputedStyle(ion_html).getPropertyValue('--ion-app-padding').replace('px', '')) * 2) + 'px';
        t.innerHTML = Number(this.getAttribute('default'));
        this.appendChild(t);
    }
}

class AppButton extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {

    }
}

class AppCheckbox extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        let t = this.innerText;
        this.innerText = '';

        let box = document.createElement('div');
        box.setAttribute('class', 'app-checkbox-box');
        this.appendChild(box);

        let text = document.createElement('text');
        text.innerHTML = t;
        text.setAttribute('class', 'app-checkbox-text');
        this.appendChild(text);

        this.setAttribute('onclick', 'app_checkbox_check(event)');

        if (this.hasAttribute('affect')) {
            window[this.getAttribute('affect')] = this.hasAttribute('checked');
        }

        if (this.hasAttribute('checked')) {
            ion_$(box).addClass('app-checkbox-checked');
            ion_$(this).append(document.createElement('app-checkmark'));
        }
    }
}

let slider_timeout = null;

function app_slider_move(e) {
    e.preventDefault();
    let b;
    
    switch (e.target.tagName) {
        case 'APP-SLIDER':
            b = ion_$(e.target).children().first();
            break;
        case 'DIV':
            b = ion_$(e.target);
            break;
        default:
            return;
    }
    moving_slider(b);
}

var testvar = 0;
var testvar2 = 0;

function moving_slider(s) {
    pos = s.position().left;

    s.css('margin-left', mouse_x - pos).css('background-color', 'var(--ion-app-extra-color)').css('border-width', '0px');

    let w = Number(s.parent().css('width').replace('px', ''));
    let l = Number((s.css('margin-left')).replace('px', ''));
    let m = Number(getComputedStyle(ion_html).getPropertyValue('--ion-app-slider-size').replace('px',''));
    let o = (Number(getComputedStyle(ion_html).getPropertyValue('--ion-app-slider-thumb-size').replace('px','')) - m) / 2;

    if (pos + l > pos + w - m) {
        s.css('margin-left', w - m);
    }
    if (pos + l < pos) {
        s.css('margin-left', 0);
    }

    let max = Number(s.parent().attr('max')),
        min = Number(s.parent().attr('min')),
        b = Number(getComputedStyle(ion_html).getPropertyValue('--ion-app-slider-size').replace('px', '')),
        inc = Number(s.parent().attr('increment'));

    let calc = (Math.round((Number(s.css('margin-left').replace('px', '')) / ((w - b) / (max - min)) + min) * (1 / inc)) / (1 / inc));
    s.parent().children().last().text(calc);

    if (s.parent().attr('affect') !== undefined) {
        window[s.parent().attr('affect')] = calc;
    }

    s.css('margin-left', `calc(${s.css('margin-left')} - ${o}px)`);

    s.parent().attr('value',calc);

    slider_timeout = setTimeout(() => { if (slider_timeout != null) { moving_slider(s) } else { s.css('background-color', '').css('border-width', '') } }, 1);
}

function app_slider_stop_move() {
    slider_timeout = null;
}

function app_checkbox_check(e) {
    e.preventDefault();
    let b;

    switch (e.target.tagName) {
        case 'APP-CHECKBOX':
            b = ion_$(e.target).children().first();
            break;
        case 'DIV':
            b = ion_$(e.target);
            break;
        case 'TEXT':
            b = ion_$(e.target).parent().children().first();
            break;
        default:
            return;
    }

    if (b.parent().attr('checked')) {
        b.removeClass('app-checkbox-checked');
        b.parent().removeAttr('checked');
        b.parent().children().each((i) => {
            if (ion_$(b.parent().children()[i]).prop('tagName') === 'APP-CHECKMARK') {
                ion_$(b.parent().children()[i]).remove();
            }
        });

        if (b.parent().attr('affect')) {
            window[b.parent().attr('affect')] = false;
        }
    } else {
        b.addClass('app-checkbox-checked');
        b.parent().attr('checked', 1);
        b.parent().append(document.createElement('app-checkmark'));

        if (b.parent().attr('affect')) {
            window[b.parent().attr('affect')] = true;
        }
    }
}

customElements.define('app-slider', AppSlider);
customElements.define('app-button', AppButton);
customElements.define('app-checkbox', AppCheckbox);