import createHistory from 'history/createBrowserHistory';
// import localforage from 'localforage';

(function() {

    // localforage.setDriver(localforage.INDEXEDDB);
    
    var notification = document.querySelector('.mdl-js-snackbar');
    require('./modules/service-worker-registration.js')(notification);

    const history = createHistory();
    const location = history.location;
    const unlisten = history.listen((location, action) => {
        
        if (action === "POP") {
            require('./modules/goto.js')(history, location.pathname, 'body');
        }  
    });

    require("./modules/linkreplacer.js")(history);
    require("./modules/initializer.js")();

})();  