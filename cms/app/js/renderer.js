// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
require('electron-connect').client.create();
const fs = require('fs');
const path = require('path');
const {dialog} = require('electron').remote;

var EventEmitter = require("events").EventEmitter;

var cms_data = [];
var receivedFilesEmitter = new EventEmitter();

var tabs = document.getElementById('tabs');
var form_holder = document.getElementById("form_holder");
require(path.join(__dirname,'js/getDynamicData'))(fs, path).then(data => {
    cms_data = data;

    // create tab items
    cms_data.forEach((file, index) => {
        var tab_class = index === 0 ? "tab-item active": "tab-item";
        var tab = createElement("div", "", tab_class);
        tab.appendChild(createElement("span", "", "icon icon-cancel icon-close-tab"))
        tab.appendChild(document.createTextNode(file.name));
        tabs.appendChild(tab);
    });
    console.log(cms_data[0].contents);
    var current_form = createForm(cms_data[0].contents[0]);
    console.log(new FormData(current_form));
    form_holder.appendChild(
        current_form
    );
    
}).catch(err => {
    console.log(err);
});

function createElement(type, content, classes) {
    type = type || 'h1';
    content = content || "";
    classes = classes || "";

    var header = document.createElement(type);
    header.appendChild(document.createTextNode(content));
    header.className = classes;

    return header;
}

function createForm(json_data) {
    var container = document.createElement("form");
    for (var prop in json_data) {
        var group_container = document.createElement("div");
        group_container.className = "form-group";

        var group_label = document.createElement("label");
        group_label.appendChild(document.createTextNode(prop));

        var group_input = document.createElement("textarea");
        group_input.className = "form-control";
        group_input.appendChild(document.createTextNode(json_data[prop]));

        group_container.appendChild(
            group_label
        );
        group_container.appendChild(
            group_input
        );

        container.appendChild(
            group_container
        );
    }
    return container;
}

receivedFilesEmitter.on("*", () => {
    console.log("kapow");
});

