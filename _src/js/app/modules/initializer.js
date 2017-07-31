module.exports = function(pageName) {
    if (!pageName) pageName = $('body').attr("class");
    switch (pageName) {
        case "cms":
            require("../pages/cms.js")();
            break;
    } 
}