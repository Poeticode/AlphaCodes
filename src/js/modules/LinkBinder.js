'use strict'

class LinkBinder {
    constructor() {
        var self = this;
        this.initialContent = document.getElementById("content").innerHTML;
        this.initialTitle = location.title;
        window.addEventListener("popstate", function (e) {
            if (e.state) {
                document.title = e.state.title;
                document.getElementById("content").innerHTML = e.state.content;
            } else {
                document.title = self.initialTitle;
                document.getElementById("content").innerHTML = self.initialContent;
            }
            self.Bind();
        });
        this.Bind();
    }

    Bind() {
        var anchors = document.getElementsByTagName('a');
        var self = this;
        for (var anchor_idx = 0; anchor_idx < anchors.length; anchor_idx++) {
            anchors[anchor_idx].onclick = function(event) {
                
                event.preventDefault();
                
                // Get the URL to load
                var url = event.target.href;
                var httpReq = new XMLHttpRequest();

                httpReq.onreadystatechange = () => {
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

                            self.Bind();
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