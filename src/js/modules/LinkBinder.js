'use strict'

class LinkBinder {
    constructor() {
        window.addEventListener("popstate", function (e) {
            document.title = e.originalEvent.state.title;
            document.getElementById("content").innerHTML = e.originalEvent.state.content;
            this.Bind();
        });
    }

    Bind() {
        var anchors = document.getElementsByTagName('a');
        for (var anchor_idx = 0; anchor_idx < anchors.length; anchor_idx++) {
            anchors[anchor_idx].onclick = function(event) {
                
                event.preventDefault();
                
                // Get the URL to load
                var url = event.target.href;

                httpReq = new XMLHttpRequest();
                httpReq.onreadystatechange = function() {
                    if (httpReq.readyState === XMLHttpRequest.DONE) {
                        if (httpReq.status === 200) {
                            var regex = /<title>(.*)<\/title>/g;
                            var title = regex.exec(httpReq.responseText)[1];
                            document.title = title;

                            var parser = new DOMParser();
                            var doc = parser.parseFromString(httpReq.responseText, "text/html");
                            var content = doc.getElementById("content").innerHTML;
                            document.getElementById("content").innerHTML = content;

                            history.pushState({
                                'title': title,
                                'content': content
                            }, title, url);

                            this.Bind();
                        } else {
                            console.log('There was a problem with the request.');
                        }
                    }
                };
                httpReq.open('GET', url);
                httpReq.send();

            }
        }
 
        
    }
};

export { LinkBinder }