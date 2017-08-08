import { TweenLite, CSSPlugin } from "gsap";
import { Msg } from "./modules/msg.js";
import { LinkBinder } from "./modules/LinkBinder.js";

(function() {

    console.log('init');
    const msg = document.getElementById('js-toast');
    require('./modules/service-worker-registration.js')(msg);

    new LinkBinder();

})();  