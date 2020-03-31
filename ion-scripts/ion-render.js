module.exports = {};

let ion_files = ['ion-main.js', 'ion-main.css', 'ion-menu-toolbox.js', 'ion-menu-toolbox.css', 'ion-tabs.js', 'ion-tabs.css', 'ion-elements.js', 'ion-elements.css'];

let ion_path = require('path');

for (let i in ion_files) {
    let n;
    switch (ion_files[i].split('.').pop()) {
        case 'js':
            n = document.createElement('script');
            n.type = 'text/javascript';
            n.src = ion_path.join(__dirname + '/' + ion_files[i]);
            break;
        case 'css':
            n = document.createElement('link');
            n.rel = 'stylesheet';
            n.href = ion_path.join(__dirname + '/' + ion_files[i]);
            break;
    }
    document.getElementsByTagName('body')[0].appendChild(n);
}