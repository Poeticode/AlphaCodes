module.exports.register = function (handlebars) {
    handlebars.registerHelper('breaklines', function(text) {
        text = handlebars.Utils.escapeExpression(text);
        text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
        return new handlebars.SafeString(text);
    });
}; 