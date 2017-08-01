'use strict';

class Msg {
    constructor(title = "Title", content = "Content") {
        document.getElementById("js-toast").innerHTML = `<strong>${title}</strong> ${content}`;
    }

    animateOut() {
        TweenLite.fromTo(document.getElementById("js-toast"), 1.5, {y: 0, opacity: 1}, {y: 40, opacity: 0}).delay(1.5);
    }

    animateIn() {

        TweenLite.fromTo(document.getElementById("js-toast"), 0.5, {y: 40, opacity: 0}, {y: 0, opacity: 1, onComplete: this.animateOut});

    }


};


    // btn smooth btn-b btn-sm

export { Msg }