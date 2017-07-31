module.exports = function(history, urlToGet, elementToReplace) {

    // it's a full page load, so send an xhr
    var xhr = new XMLHttpRequest();
    xhr.open('GET', urlToGet, true);
    xhr.responseType = 'document'; // make sure we read it as a document
    xhr.overrideMimeType('text/html'); // it better be html, or else!
    xhr.onload = function () { 
        if (xhr.readyState === xhr.DONE) { 
            if (xhr.status === 200) {
                var $receivedElement = $(xhr.responseXML).find(elementToReplace);
                require('./loadelement.js')(history, elementToReplace, $receivedElement);
                history.push({
                    pathname: urlToGet, 
                    state: { element: elementToReplace }
                });
            }
        }
    }; 
    xhr.send(null);
 
}